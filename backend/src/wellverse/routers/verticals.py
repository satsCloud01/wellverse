from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Vertical
from ..schemas import VerticalOut

router = APIRouter(prefix="/api/verticals", tags=["verticals"])


@router.get("", response_model=list[VerticalOut])
def list_verticals(db: Session = Depends(get_db)):
    return db.query(Vertical).all()


@router.get("/{vertical_id}", response_model=VerticalOut)
def get_vertical(vertical_id: str, db: Session = Depends(get_db)):
    v = db.query(Vertical).filter(Vertical.id == vertical_id).first()
    if not v:
        raise HTTPException(404, "Vertical not found")
    return v
