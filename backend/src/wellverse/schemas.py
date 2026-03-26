from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class VerticalOut(BaseModel):
    id: str
    label: str
    emoji: str
    color: str
    accent: str
    status: str
    eta: Optional[str] = None
    tagline: str
    manifesto: str
    why: str
    stat: str
    guide_types: list[str]
    sub_pillars: Optional[list[dict]] = None

    model_config = {"from_attributes": True}


class GuideOut(BaseModel):
    id: int
    name: str
    role: str
    emoji: str
    vertical_id: str
    color: str
    quote: str
    bio: str
    methods: list[str]
    price: str
    rating: float
    review_count: int
    location: str
    is_preview: bool
    is_verified: bool

    model_config = {"from_attributes": True}


class ReviewOut(BaseModel):
    id: int
    guide_id: int
    author: str
    rating: float
    comment: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    author: str
    rating: float
    comment: str


class WaitlistCreate(BaseModel):
    email: str
    vertical_id: str


class WaitlistOut(BaseModel):
    id: int
    email: str
    vertical_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ApplicationCreate(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    city_country: Optional[str] = None
    role_specialty: str
    qualifications: Optional[str] = None
    years_practice: Optional[str] = None
    website: Optional[str] = None
    why_wellverse: Optional[str] = None
    approach: Optional[str] = None
    first_session: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    full_name: str
    email: str
    role_specialty: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class BookingCreate(BaseModel):
    guide_id: int
    seeker_name: str
    seeker_email: str
    booking_type: str = "intro"
    date_time: str
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    guide_id: int
    seeker_name: str
    seeker_email: str
    booking_type: str
    date_time: str
    notes: Optional[str] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class StatsOut(BaseModel):
    founding_members: int
    vetted_guides: int
    intro_sessions: str
    avg_rating: str
    total_verticals: int
    live_verticals: int
