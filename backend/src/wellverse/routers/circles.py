from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from ..database import get_db
from ..models import User, Circle, CircleMembership
from ..auth import require_user, get_current_user

router = APIRouter(prefix="/api/circles", tags=["circles"])


class CircleOut(BaseModel):
    id: int
    name: str
    description: str
    vertical_id: str | None = None
    host_guide_id: int | None = None
    max_members: int
    schedule: str | None = None
    is_premium: bool
    image_url: str | None = None
    member_count: int = 0
    is_member: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("", response_model=list[CircleOut])
def list_circles(
    vertical_id: Optional[str] = Query(None),
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Circle)
    if vertical_id:
        q = q.filter(Circle.vertical_id == vertical_id)
    circles = q.all()
    result = []
    for c in circles:
        count = db.query(CircleMembership).filter(CircleMembership.circle_id == c.id).count()
        is_member = False
        if user:
            is_member = db.query(CircleMembership).filter(
                CircleMembership.circle_id == c.id,
                CircleMembership.user_id == user.id,
            ).first() is not None
        out = CircleOut.model_validate(c)
        out.member_count = count
        out.is_member = is_member
        result.append(out)
    return result


@router.post("/{circle_id}/join", status_code=201)
def join_circle(circle_id: int, user: User = Depends(require_user), db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(404, "Circle not found")

    existing = db.query(CircleMembership).filter(
        CircleMembership.circle_id == circle_id,
        CircleMembership.user_id == user.id,
    ).first()
    if existing:
        raise HTTPException(400, "Already a member")

    count = db.query(CircleMembership).filter(CircleMembership.circle_id == circle_id).count()
    if count >= circle.max_members:
        raise HTTPException(400, "Circle is full")

    if circle.is_premium and user.tier == "free":
        raise HTTPException(403, "Premium circle requires Seeker or Committed tier")

    # Free tier: max 1 circle
    if user.tier == "free":
        user_circles = db.query(CircleMembership).filter(CircleMembership.user_id == user.id).count()
        if user_circles >= 1:
            raise HTTPException(403, "Free tier allows 1 circle only. Upgrade to join more.")

    membership = CircleMembership(circle_id=circle_id, user_id=user.id)
    db.add(membership)
    db.commit()
    return {"status": "joined", "circle_id": circle_id}


@router.delete("/{circle_id}/leave")
def leave_circle(circle_id: int, user: User = Depends(require_user), db: Session = Depends(get_db)):
    membership = db.query(CircleMembership).filter(
        CircleMembership.circle_id == circle_id,
        CircleMembership.user_id == user.id,
    ).first()
    if not membership:
        raise HTTPException(404, "Not a member")
    db.delete(membership)
    db.commit()
    return {"status": "left", "circle_id": circle_id}
