from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from ..database import get_db
from ..models import LibraryItem

router = APIRouter(prefix="/api/library", tags=["library"])


class LibraryItemOut(BaseModel):
    id: int
    title: str
    description: str
    content_type: str
    vertical_id: str | None = None
    body: str | None = None
    media_url: str | None = None
    duration_minutes: int | None = None
    author: str | None = None
    tags: list[str] | None = None
    is_premium: bool
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("", response_model=list[LibraryItemOut])
def list_library(
    vertical_id: Optional[str] = Query(None),
    content_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(LibraryItem)
    if vertical_id:
        q = q.filter(LibraryItem.vertical_id == vertical_id)
    if content_type:
        q = q.filter(LibraryItem.content_type == content_type)
    if search:
        term = f"%{search}%"
        q = q.filter(LibraryItem.title.ilike(term) | LibraryItem.description.ilike(term))
    return q.order_by(LibraryItem.created_at.desc()).all()


@router.get("/{item_id}", response_model=LibraryItemOut)
def get_library_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(LibraryItem).filter(LibraryItem.id == item_id).first()
    if not item:
        from fastapi import HTTPException
        raise HTTPException(404, "Item not found")
    return item
