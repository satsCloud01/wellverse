from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Booking, Guide, User
from ..schemas import BookingCreate, BookingOut
from ..auth import get_current_user
from ..email_service import send_booking_confirmation

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(
    data: BookingCreate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    guide = db.query(Guide).filter(Guide.id == data.guide_id).first()
    if not guide:
        raise HTTPException(404, "Guide not found")
    if guide.is_preview:
        raise HTTPException(400, "This guide is not yet available for booking")

    # Check for conflicts
    existing = db.query(Booking).filter(
        Booking.guide_id == data.guide_id,
        Booking.date_time == data.date_time,
        Booking.status.in_(["pending", "confirmed"]),
    ).first()
    if existing:
        raise HTTPException(409, "This time slot is already booked")

    booking = Booking(
        guide_id=data.guide_id,
        user_id=user.id if user else None,
        seeker_name=data.seeker_name,
        seeker_email=data.seeker_email,
        booking_type=data.booking_type,
        date_time=data.date_time,
        duration_minutes=30 if data.booking_type == "intro" else 60,
        notes=data.notes,
        amount_cents=0 if data.booking_type == "intro" else None,
    )

    # Auto-confirm free intro calls
    if data.booking_type == "intro":
        booking.status = "confirmed"

    db.add(booking)
    db.commit()
    db.refresh(booking)

    send_booking_confirmation(data.seeker_email, guide.name, data.date_time, data.booking_type)
    return booking


@router.get("", response_model=list[BookingOut])
def list_bookings(
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Booking)
    if user:
        q = q.filter(Booking.user_id == user.id)
    return q.order_by(Booking.created_at.desc()).all()


@router.get("/guide/{guide_id}/availability")
def get_availability(guide_id: int, db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(404, "Guide not found")

    booked = db.query(Booking).filter(
        Booking.guide_id == guide_id,
        Booking.status.in_(["pending", "confirmed"]),
    ).all()
    booked_slots = [b.date_time for b in booked]

    return {
        "guide_id": guide_id,
        "availability": guide.availability or [],
        "booked_slots": booked_slots,
    }


@router.patch("/{booking_id}/status")
def update_booking_status(booking_id: int, status: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    if status not in ("pending", "confirmed", "completed", "cancelled"):
        raise HTTPException(400, "Invalid status")
    booking.status = status
    db.commit()
    return {"id": booking_id, "status": status}
