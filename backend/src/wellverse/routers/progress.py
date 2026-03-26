from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from ..database import get_db
from ..models import User, ProgressEntry, Booking, SessionNote, Review
from ..auth import require_user

router = APIRouter(prefix="/api/progress", tags=["progress"])


class ProgressCreate(BaseModel):
    vertical_id: str | None = None
    entry_type: str  # goal | milestone | reflection | metric
    title: str
    content: str | None = None
    value: float | None = None


class ProgressOut(BaseModel):
    id: int
    user_id: int
    vertical_id: str | None = None
    entry_type: str
    title: str
    content: str | None = None
    value: float | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ProgressReport(BaseModel):
    total_bookings: int
    completed_sessions: int
    total_notes: int
    avg_mood_improvement: float | None = None
    goals: list[ProgressOut]
    milestones: list[ProgressOut]
    recent_entries: list[ProgressOut]


@router.post("", response_model=ProgressOut, status_code=201)
def create_entry(data: ProgressCreate, user: User = Depends(require_user), db: Session = Depends(get_db)):
    entry = ProgressEntry(user_id=user.id, **data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("", response_model=list[ProgressOut])
def list_entries(user: User = Depends(require_user), db: Session = Depends(get_db)):
    return db.query(ProgressEntry).filter(ProgressEntry.user_id == user.id).order_by(ProgressEntry.created_at.desc()).all()


@router.get("/report", response_model=ProgressReport)
def get_report(user: User = Depends(require_user), db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.user_id == user.id).all()
    completed = [b for b in bookings if b.status == "completed"]
    notes = db.query(SessionNote).filter(SessionNote.user_id == user.id).all()

    # Mood improvement
    mood_diffs = [n.mood_after - n.mood_before for n in notes if n.mood_before and n.mood_after]
    avg_mood = round(sum(mood_diffs) / len(mood_diffs), 1) if mood_diffs else None

    entries = db.query(ProgressEntry).filter(ProgressEntry.user_id == user.id).order_by(ProgressEntry.created_at.desc()).all()
    goals = [e for e in entries if e.entry_type == "goal"]
    milestones = [e for e in entries if e.entry_type == "milestone"]

    return ProgressReport(
        total_bookings=len(bookings),
        completed_sessions=len(completed),
        total_notes=len(notes),
        avg_mood_improvement=avg_mood,
        goals=[ProgressOut.model_validate(g) for g in goals],
        milestones=[ProgressOut.model_validate(m) for m in milestones],
        recent_entries=[ProgressOut.model_validate(e) for e in entries[:10]],
    )
