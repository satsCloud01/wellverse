from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Guide, Vertical, User, Booking, Review, GuideApplication
from ..schemas import StatsOut

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    guides = db.query(Guide).filter(Guide.is_preview == False).all()
    verticals = db.query(Vertical).all()
    live_count = sum(1 for v in verticals if v.status == "live")
    user_count = db.query(User).count()
    booking_count = db.query(Booking).count()
    review_count = db.query(Review).count()

    # Use real data when available, seed defaults otherwise
    member_count = max(user_count, 847)  # Show at least seed value
    session_str = f"{booking_count:,}+" if booking_count > 0 else "2,300+"

    avg = round(sum(g.rating for g in guides) / max(len(guides), 1), 1)
    return StatsOut(
        founding_members=member_count,
        vetted_guides=len(guides),
        intro_sessions=session_str,
        avg_rating=f"{avg}\u2605",
        total_verticals=len(verticals),
        live_verticals=live_count,
    )
