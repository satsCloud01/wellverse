from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database import get_db
from ..models import User, Conversation, Message, Guide
from ..auth import require_user

router = APIRouter(prefix="/api/messages", tags=["messaging"])


class MessageCreate(BaseModel):
    guide_id: int
    content: str


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationOut(BaseModel):
    id: int
    guide_id: int
    guide_name: str | None = None
    guide_emoji: str | None = None
    last_message: str | None = None
    last_message_at: datetime | None = None
    unread_count: int = 0

    model_config = {"from_attributes": True}


@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(user: User = Depends(require_user), db: Session = Depends(get_db)):
    convos = db.query(Conversation).filter(Conversation.user_id == user.id).order_by(Conversation.last_message_at.desc()).all()
    result = []
    for c in convos:
        guide = db.query(Guide).filter(Guide.id == c.guide_id).first()
        last_msg = db.query(Message).filter(Message.conversation_id == c.id).order_by(Message.created_at.desc()).first()
        unread = db.query(Message).filter(
            Message.conversation_id == c.id,
            Message.sender_id != user.id,
            Message.read == False,
        ).count()
        result.append(ConversationOut(
            id=c.id,
            guide_id=c.guide_id,
            guide_name=guide.name if guide else None,
            guide_emoji=guide.emoji if guide else None,
            last_message=last_msg.content[:80] if last_msg else None,
            last_message_at=c.last_message_at,
            unread_count=unread,
        ))
    return result


@router.post("", response_model=MessageOut, status_code=201)
def send_message(data: MessageCreate, user: User = Depends(require_user), db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == data.guide_id).first()
    if not guide:
        raise HTTPException(404, "Guide not found")

    convo = db.query(Conversation).filter(
        Conversation.user_id == user.id,
        Conversation.guide_id == data.guide_id,
    ).first()
    if not convo:
        convo = Conversation(user_id=user.id, guide_id=data.guide_id)
        db.add(convo)
        db.flush()

    msg = Message(
        conversation_id=convo.id,
        sender_id=user.id,
        guide_id=data.guide_id,
        content=data.content,
    )
    db.add(msg)
    convo.last_message_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("/conversation/{guide_id}", response_model=list[MessageOut])
def get_messages(guide_id: int, user: User = Depends(require_user), db: Session = Depends(get_db)):
    convo = db.query(Conversation).filter(
        Conversation.user_id == user.id,
        Conversation.guide_id == guide_id,
    ).first()
    if not convo:
        return []

    # Mark as read
    db.query(Message).filter(
        Message.conversation_id == convo.id,
        Message.sender_id != user.id,
        Message.read == False,
    ).update({"read": True})
    db.commit()

    return db.query(Message).filter(Message.conversation_id == convo.id).order_by(Message.created_at.asc()).all()
