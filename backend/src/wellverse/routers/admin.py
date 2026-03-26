from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database import get_db
from ..models import (
    User, Guide, GuideApplication, Vertical, Booking, WaitlistEntry,
    Review, Payment, LibraryItem, Circle, BlogPost
)
from ..auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ─── DASHBOARD ────────────────────────────────────────────
@router.get("/dashboard")
def admin_dashboard(user: User = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        "users": db.query(User).count(),
        "guides": db.query(Guide).filter(Guide.is_preview == False).count(),
        "pending_applications": db.query(GuideApplication).filter(GuideApplication.status == "pending").count(),
        "total_bookings": db.query(Booking).count(),
        "completed_sessions": db.query(Booking).filter(Booking.status == "completed").count(),
        "waitlist_entries": db.query(WaitlistEntry).count(),
        "total_reviews": db.query(Review).count(),
        "total_payments": db.query(Payment).filter(Payment.status == "succeeded").count(),
    }


# ─── APPLICATION MANAGEMENT ──────────────────────────────
class ApplicationAction(BaseModel):
    status: str  # approved | declined
    admin_notes: str | None = None
    # For approval — guide details
    vertical_id: str | None = None
    color: str | None = None
    emoji: str | None = None
    quote: str | None = None
    bio: str | None = None
    methods: list[str] | None = None
    price: str | None = None
    location: str | None = None


@router.get("/applications")
def list_applications(
    status: str | None = None,
    user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    q = db.query(GuideApplication)
    if status:
        q = q.filter(GuideApplication.status == status)
    apps = q.order_by(GuideApplication.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "full_name": a.full_name,
            "email": a.email,
            "role_specialty": a.role_specialty,
            "qualifications": a.qualifications,
            "years_practice": a.years_practice,
            "why_wellverse": a.why_wellverse,
            "approach": a.approach,
            "status": a.status,
            "admin_notes": a.admin_notes,
            "created_at": a.created_at.isoformat(),
        }
        for a in apps
    ]


@router.patch("/applications/{app_id}")
def review_application(
    app_id: int,
    action: ApplicationAction,
    user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = db.query(GuideApplication).filter(GuideApplication.id == app_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    app.status = action.status
    app.admin_notes = action.admin_notes
    app.reviewed_by = user.id
    app.reviewed_at = datetime.now(timezone.utc)

    guide = None
    if action.status == "approved":
        # Create guide from application
        guide = Guide(
            name=app.full_name,
            role=app.role_specialty,
            emoji=action.emoji or "🧑",
            vertical_id=action.vertical_id or "mind",
            color=action.color or "#4A7A9A",
            quote=action.quote or app.why_wellverse or "Passionate about helping others.",
            bio=action.bio or app.approach or app.qualifications or "",
            methods=action.methods or [],
            price=action.price or "$100/session",
            location=action.location or app.city_country or "Virtual",
            is_preview=False,
            is_verified=True,
        )
        db.add(guide)
        db.flush()

        # Create user account for guide if not exists
        existing_user = db.query(User).filter(User.email == app.email).first()
        if existing_user:
            existing_user.role = "guide"
            existing_user.guide_id = guide.id
        else:
            from ..auth import hash_password
            new_user = User(
                email=app.email,
                password_hash=hash_password("welcome123"),  # They should reset
                full_name=app.full_name,
                role="guide",
                guide_id=guide.id,
            )
            db.add(new_user)

    db.commit()
    return {
        "id": app.id,
        "status": app.status,
        "guide_id": guide.id if guide else None,
    }


# ─── USER MANAGEMENT ─────────────────────────────────────
@router.get("/users")
def list_users(user: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "tier": u.tier,
            "created_at": u.created_at.isoformat(),
        }
        for u in users
    ]


# ─── GUIDE MANAGEMENT ────────────────────────────────────
@router.delete("/guides/{guide_id}")
def remove_guide(guide_id: int, user: User = Depends(require_admin), db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(404, "Guide not found")
    db.delete(guide)
    db.commit()
    return {"status": "deleted"}


# ─── GUIDE ANALYTICS ─────────────────────────────────────
@router.get("/guide-analytics/{guide_id}")
def guide_analytics(guide_id: int, user: User = Depends(require_admin), db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(404, "Guide not found")

    bookings = db.query(Booking).filter(Booking.guide_id == guide_id).all()
    reviews = db.query(Review).filter(Review.guide_id == guide_id).all()
    completed = [b for b in bookings if b.status == "completed"]
    cancelled = [b for b in bookings if b.status == "cancelled"]

    return {
        "guide_id": guide_id,
        "name": guide.name,
        "total_bookings": len(bookings),
        "completed_sessions": len(completed),
        "cancelled_sessions": len(cancelled),
        "completion_rate": round(len(completed) / max(len(bookings), 1) * 100, 1),
        "total_reviews": len(reviews),
        "avg_rating": round(sum(r.rating for r in reviews) / max(len(reviews), 1), 1) if reviews else guide.rating,
        "repeat_booking_rate": 0,  # Would need user tracking
    }


# ─── LIBRARY MANAGEMENT ──────────────────────────────────
class LibraryItemCreate(BaseModel):
    title: str
    description: str
    content_type: str
    vertical_id: str | None = None
    body: str | None = None
    media_url: str | None = None
    duration_minutes: int | None = None
    author: str | None = None
    tags: list[str] | None = None
    is_premium: bool = False


@router.post("/library", status_code=201)
def create_library_item(data: LibraryItemCreate, user: User = Depends(require_admin), db: Session = Depends(get_db)):
    item = LibraryItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "title": item.title}


# ─── CIRCLE MANAGEMENT ───────────────────────────────────
class CircleCreate(BaseModel):
    name: str
    description: str
    vertical_id: str | None = None
    host_guide_id: int | None = None
    max_members: int = 12
    schedule: str | None = None
    is_premium: bool = False


@router.post("/circles", status_code=201)
def create_circle(data: CircleCreate, user: User = Depends(require_admin), db: Session = Depends(get_db)):
    circle = Circle(**data.model_dump())
    db.add(circle)
    db.commit()
    db.refresh(circle)
    return {"id": circle.id, "name": circle.name}


# ─── BLOG MANAGEMENT ─────────────────────────────────────
class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str | None = None
    body: str
    author: str
    cover_image_url: str | None = None
    tags: list[str] | None = None
    published: bool = False


@router.post("/blog", status_code=201)
def create_blog_post(data: BlogPostCreate, user: User = Depends(require_admin), db: Session = Depends(get_db)):
    if db.query(BlogPost).filter(BlogPost.slug == data.slug).first():
        raise HTTPException(400, "Slug already exists")
    post = BlogPost(**data.model_dump())
    if data.published:
        post.published_at = datetime.now(timezone.utc)
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"id": post.id, "slug": post.slug}
