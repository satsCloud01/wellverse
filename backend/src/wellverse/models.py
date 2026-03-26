from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from .database import Base


def utcnow():
    return datetime.now(timezone.utc)


# ─── AUTH ─────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="seeker")  # seeker | guide | admin
    tier = Column(String, nullable=False, default="free")  # free | seeker | committed
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    bookings = relationship("Booking", back_populates="user_rel", foreign_keys="Booking.user_id")
    sent_messages = relationship("Message", back_populates="sender_rel", foreign_keys="Message.sender_id")
    notes = relationship("SessionNote", back_populates="user_rel")
    progress_entries = relationship("ProgressEntry", back_populates="user_rel")
    circle_memberships = relationship("CircleMembership", back_populates="user_rel")


# ─── VERTICALS ────────────────────────────────────────────
class Vertical(Base):
    __tablename__ = "verticals"

    id = Column(String, primary_key=True)
    label = Column(String, nullable=False)
    emoji = Column(String, nullable=False)
    color = Column(String, nullable=False)
    accent = Column(String, nullable=False)
    status = Column(String, nullable=False, default="early")
    eta = Column(String, nullable=True)
    tagline = Column(String, nullable=False)
    manifesto = Column(Text, nullable=False)
    why = Column(Text, nullable=False)
    stat = Column(String, nullable=False)
    guide_types = Column(JSON, nullable=False, default=list)
    sub_pillars = Column(JSON, nullable=True)

    guides = relationship("Guide", back_populates="vertical_rel")


# ─── GUIDES ───────────────────────────────────────────────
class Guide(Base):
    __tablename__ = "guides"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    emoji = Column(String, nullable=False)
    vertical_id = Column(String, ForeignKey("verticals.id"), nullable=False)
    color = Column(String, nullable=False)
    quote = Column(Text, nullable=False)
    bio = Column(Text, nullable=False)
    methods = Column(JSON, nullable=False, default=list)
    price = Column(String, nullable=False)
    rating = Column(Float, nullable=False, default=5.0)
    review_count = Column(Integer, nullable=False, default=0)
    location = Column(String, nullable=False)
    is_preview = Column(Boolean, nullable=False, default=False)
    is_verified = Column(Boolean, nullable=False, default=True)
    photo_url = Column(String, nullable=True)
    availability = Column(JSON, nullable=True)  # [{day: "Monday", slots: ["09:00","10:00",...]}]
    created_at = Column(DateTime, default=utcnow)

    vertical_rel = relationship("Vertical", back_populates="guides")
    reviews = relationship("Review", back_populates="guide_rel")
    bookings = relationship("Booking", back_populates="guide_rel")
    received_messages = relationship("Message", back_populates="guide_rel", foreign_keys="Message.guide_id")


# ─── REVIEWS ──────────────────────────────────────────────
class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)

    guide_rel = relationship("Guide", back_populates="reviews")


# ─── BOOKINGS ─────────────────────────────────────────────
class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    seeker_name = Column(String, nullable=False)
    seeker_email = Column(String, nullable=False)
    booking_type = Column(String, nullable=False, default="intro")  # intro | session
    date_time = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=30)
    notes = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="pending")  # pending | confirmed | completed | cancelled
    payment_intent_id = Column(String, nullable=True)
    amount_cents = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    guide_rel = relationship("Guide", back_populates="bookings")
    user_rel = relationship("User", back_populates="bookings", foreign_keys=[user_id])
    session_notes = relationship("SessionNote", back_populates="booking_rel")


# ─── WAITLIST ─────────────────────────────────────────────
class WaitlistEntry(Base):
    __tablename__ = "waitlist"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, nullable=False)
    vertical_id = Column(String, ForeignKey("verticals.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow)


# ─── GUIDE APPLICATIONS ──────────────────────────────────
class GuideApplication(Base):
    __tablename__ = "guide_applications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    city_country = Column(String, nullable=True)
    role_specialty = Column(String, nullable=False)
    qualifications = Column(Text, nullable=True)
    years_practice = Column(String, nullable=True)
    website = Column(String, nullable=True)
    why_wellverse = Column(Text, nullable=True)
    approach = Column(Text, nullable=True)
    first_session = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="pending")  # pending | approved | declined
    admin_notes = Column(Text, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)


# ─── MESSAGING ────────────────────────────────────────────
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=False)
    last_message_at = Column(DateTime, default=utcnow)
    created_at = Column(DateTime, default=utcnow)

    messages = relationship("Message", back_populates="conversation_rel", order_by="Message.created_at")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=True)
    content = Column(Text, nullable=False)
    read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=utcnow)

    conversation_rel = relationship("Conversation", back_populates="messages")
    sender_rel = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
    guide_rel = relationship("Guide", back_populates="received_messages", foreign_keys=[guide_id])


# ─── SESSION NOTES ────────────────────────────────────────
class SessionNote(Base):
    __tablename__ = "session_notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    mood_before = Column(Integer, nullable=True)  # 1-5
    mood_after = Column(Integer, nullable=True)  # 1-5
    key_takeaways = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    booking_rel = relationship("Booking", back_populates="session_notes")
    user_rel = relationship("User", back_populates="notes")


# ─── PROGRESS TRACKING ───────────────────────────────────
class ProgressEntry(Base):
    __tablename__ = "progress_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vertical_id = Column(String, ForeignKey("verticals.id"), nullable=True)
    entry_type = Column(String, nullable=False)  # goal | milestone | reflection | metric
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    value = Column(Float, nullable=True)  # for metrics
    created_at = Column(DateTime, default=utcnow)

    user_rel = relationship("User", back_populates="progress_entries")


# ─── LIBRARY ─────────────────────────────────────────────
class LibraryItem(Base):
    __tablename__ = "library_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    content_type = Column(String, nullable=False)  # article | video | exercise | meditation
    vertical_id = Column(String, ForeignKey("verticals.id"), nullable=True)
    body = Column(Text, nullable=True)  # markdown content
    media_url = Column(String, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    author = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    is_premium = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=utcnow)


# ─── COMMUNITY CIRCLES ───────────────────────────────────
class Circle(Base):
    __tablename__ = "circles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    vertical_id = Column(String, ForeignKey("verticals.id"), nullable=True)
    host_guide_id = Column(Integer, ForeignKey("guides.id"), nullable=True)
    max_members = Column(Integer, nullable=False, default=12)
    schedule = Column(String, nullable=True)  # e.g. "Every Thursday 7pm GMT"
    is_premium = Column(Boolean, nullable=False, default=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    memberships = relationship("CircleMembership", back_populates="circle_rel")


class CircleMembership(Base):
    __tablename__ = "circle_memberships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    circle_id = Column(Integer, ForeignKey("circles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=utcnow)

    circle_rel = relationship("Circle", back_populates="memberships")
    user_rel = relationship("User", back_populates="circle_memberships")


# ─── PAYMENTS ─────────────────────────────────────────────
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    stripe_payment_intent_id = Column(String, nullable=True)
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String, nullable=False, default="usd")
    status = Column(String, nullable=False, default="pending")  # pending | succeeded | failed | refunded
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)


# ─── BLOG ─────────────────────────────────────────────────
class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    excerpt = Column(Text, nullable=True)
    body = Column(Text, nullable=False)
    author = Column(String, nullable=False)
    cover_image_url = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    published = Column(Boolean, nullable=False, default=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)
