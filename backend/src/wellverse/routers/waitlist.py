from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import WaitlistEntry, Vertical
from ..schemas import WaitlistCreate, WaitlistOut
from ..email_service import send_waitlist_confirmation

router = APIRouter(prefix="/api/waitlist", tags=["waitlist"])


@router.post("", response_model=WaitlistOut, status_code=201)
def join_waitlist(data: WaitlistCreate, db: Session = Depends(get_db)):
    # Dedup check
    existing = db.query(WaitlistEntry).filter(
        WaitlistEntry.email == data.email,
        WaitlistEntry.vertical_id == data.vertical_id,
    ).first()
    if existing:
        return existing

    vertical = db.query(Vertical).filter(Vertical.id == data.vertical_id).first()
    entry = WaitlistEntry(email=data.email, vertical_id=data.vertical_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Send confirmation email
    if vertical:
        send_waitlist_confirmation(data.email, vertical.label)

    return entry


@router.get("", response_model=list[WaitlistOut])
def list_waitlist(db: Session = Depends(get_db)):
    return db.query(WaitlistEntry).order_by(WaitlistEntry.created_at.desc()).all()
