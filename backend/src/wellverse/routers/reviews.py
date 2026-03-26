from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Review, Guide, User
from ..schemas import ReviewCreate, ReviewOut
from ..auth import get_current_user

router = APIRouter(prefix="/api/guides/{guide_id}/reviews", tags=["reviews"])


@router.post("", response_model=ReviewOut, status_code=201)
def create_review(
    guide_id: int,
    data: ReviewCreate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(404, "Guide not found")

    if data.rating < 1 or data.rating > 5:
        raise HTTPException(400, "Rating must be between 1 and 5")

    review = Review(
        guide_id=guide_id,
        user_id=user.id if user else None,
        author=data.author,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)

    # Recalculate rating from all actual reviews
    all_reviews = db.query(Review).filter(Review.guide_id == guide_id).all()
    total = sum(r.rating for r in all_reviews) + data.rating
    count = len(all_reviews) + 1
    guide.rating = round(total / count, 1)
    guide.review_count = count

    db.commit()
    db.refresh(review)
    return review


@router.get("", response_model=list[ReviewOut])
def list_reviews(guide_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.guide_id == guide_id).order_by(Review.created_at.desc()).all()
