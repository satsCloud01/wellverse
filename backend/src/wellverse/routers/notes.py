from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import User, SessionNote, Booking
from ..auth import require_user

router = APIRouter(prefix="/api/notes", tags=["session-notes"])


class NoteCreate(BaseModel):
    booking_id: int
    content: str
    mood_before: int | None = None
    mood_after: int | None = None
    key_takeaways: list[str] | None = None


class NoteOut(BaseModel):
    id: int
    booking_id: int
    user_id: int
    content: str
    mood_before: int | None = None
    mood_after: int | None = None
    key_takeaways: list[str] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


@router.post("", response_model=NoteOut, status_code=201)
def create_note(data: NoteCreate, user: User = Depends(require_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    note = SessionNote(
        booking_id=data.booking_id,
        user_id=user.id,
        content=data.content,
        mood_before=data.mood_before,
        mood_after=data.mood_after,
        key_takeaways=data.key_takeaways,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("", response_model=list[NoteOut])
def list_notes(user: User = Depends(require_user), db: Session = Depends(get_db)):
    return db.query(SessionNote).filter(SessionNote.user_id == user.id).order_by(SessionNote.created_at.desc()).all()


@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: int, user: User = Depends(require_user), db: Session = Depends(get_db)):
    note = db.query(SessionNote).filter(SessionNote.id == note_id, SessionNote.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    return note
