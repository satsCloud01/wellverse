from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import User, Payment, Booking
from ..auth import require_user
from ..config import STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

router = APIRouter(prefix="/api/payments", tags=["payments"])


class CreateCheckoutRequest(BaseModel):
    booking_id: Optional[int] = None
    tier: Optional[str] = None  # "committed" for subscription


class CheckoutResponse(BaseModel):
    checkout_url: str | None = None
    client_secret: str | None = None
    message: str | None = None


@router.post("/create-checkout", response_model=CheckoutResponse)
def create_checkout(
    data: CreateCheckoutRequest,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    if not STRIPE_SECRET_KEY:
        # Dev mode: simulate payment
        if data.booking_id:
            booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
            if booking:
                booking.status = "confirmed"
                payment = Payment(
                    user_id=user.id,
                    booking_id=data.booking_id,
                    amount_cents=0,
                    status="succeeded",
                    description="Dev mode - free",
                )
                db.add(payment)
                db.commit()
            return CheckoutResponse(message="Dev mode: booking confirmed (no Stripe key configured)")

        if data.tier == "committed":
            user.tier = "committed"
            db.commit()
            return CheckoutResponse(message="Dev mode: upgraded to Committed tier (no Stripe key configured)")

        return CheckoutResponse(message="Dev mode: no action taken")

    import stripe
    stripe.api_key = STRIPE_SECRET_KEY

    if data.tier == "committed":
        from ..config import STRIPE_PRICE_COMMITTED
        if not STRIPE_PRICE_COMMITTED:
            raise HTTPException(400, "Subscription price not configured")

        if not user.stripe_customer_id:
            customer = stripe.Customer.create(email=user.email, name=user.full_name)
            user.stripe_customer_id = customer.id
            db.commit()

        session = stripe.checkout.Session.create(
            customer=user.stripe_customer_id,
            mode="subscription",
            line_items=[{"price": STRIPE_PRICE_COMMITTED, "quantity": 1}],
            success_url=f"{__import__('wellverse.config', fromlist=['APP_URL']).APP_URL}/settings?payment=success",
            cancel_url=f"{__import__('wellverse.config', fromlist=['APP_URL']).APP_URL}/settings?payment=cancelled",
            metadata={"user_id": str(user.id)},
        )
        return CheckoutResponse(checkout_url=session.url)

    if data.booking_id:
        booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
        if not booking:
            raise HTTPException(404, "Booking not found")

        if not user.stripe_customer_id:
            customer = stripe.Customer.create(email=user.email, name=user.full_name)
            user.stripe_customer_id = customer.id
            db.commit()

        amount = booking.amount_cents or 0
        if amount == 0:
            booking.status = "confirmed"
            db.commit()
            return CheckoutResponse(message="Free intro session - confirmed!")

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            customer=user.stripe_customer_id,
            metadata={"booking_id": str(booking.id), "user_id": str(user.id)},
        )
        booking.payment_intent_id = intent.id
        db.commit()
        return CheckoutResponse(client_secret=intent.client_secret)

    raise HTTPException(400, "Specify booking_id or tier")


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    if not STRIPE_SECRET_KEY or not STRIPE_WEBHOOK_SECRET:
        return {"status": "skipped", "reason": "Stripe not configured"}

    import stripe
    stripe.api_key = STRIPE_SECRET_KEY

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(400, "Invalid webhook signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = int(session["metadata"].get("user_id", 0))
        if session.get("mode") == "subscription":
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.tier = "committed"
                user.stripe_subscription_id = session.get("subscription")
                db.commit()

    elif event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        booking_id = int(intent["metadata"].get("booking_id", 0))
        user_id = int(intent["metadata"].get("user_id", 0))
        if booking_id:
            booking = db.query(Booking).filter(Booking.id == booking_id).first()
            if booking:
                booking.status = "confirmed"
                payment = Payment(
                    user_id=user_id,
                    booking_id=booking_id,
                    stripe_payment_intent_id=intent["id"],
                    amount_cents=intent["amount"],
                    status="succeeded",
                )
                db.add(payment)
                db.commit()

    elif event["type"] == "customer.subscription.deleted":
        sub = event["data"]["object"]
        user = db.query(User).filter(User.stripe_subscription_id == sub["id"]).first()
        if user:
            user.tier = "free"
            user.stripe_subscription_id = None
            db.commit()

    return {"status": "ok"}


@router.get("/history")
def payment_history(user: User = Depends(require_user), db: Session = Depends(get_db)):
    payments = db.query(Payment).filter(Payment.user_id == user.id).order_by(Payment.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "amount_cents": p.amount_cents,
            "currency": p.currency,
            "status": p.status,
            "description": p.description,
            "created_at": p.created_at.isoformat(),
        }
        for p in payments
    ]
