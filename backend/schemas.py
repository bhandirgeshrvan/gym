from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import RoleEnum

# ── Auth ──────────────────────────────────────────────
class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: RoleEnum

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: RoleEnum

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: RoleEnum
    user_id: int
    name: str

# ── User ──────────────────────────────────────────────
class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role: RoleEnum
    is_active: bool
    created_at: datetime
    model_config = {"from_attributes": True}

# ── Gym ──────────────────────────────────────────────
class GymCreate(BaseModel):
    name: str
    location: str
    plan: str = "Starter"

class GymOut(BaseModel):
    id: int
    name: str
    location: Optional[str]
    plan: str
    is_active: bool
    owner_id: int
    created_at: datetime
    model_config = {"from_attributes": True}

# ── Member ────────────────────────────────────────────
class MemberCreate(BaseModel):
    user_id: int
    gym_id: int
    trainer_id: Optional[int] = None
    membership_plan: str = "Monthly"
    expiry_date: Optional[datetime] = None

class MemberOut(BaseModel):
    id: int
    user_id: int
    gym_id: int
    trainer_id: Optional[int]
    membership_plan: str
    status: str
    join_date: datetime
    expiry_date: Optional[datetime]
    model_config = {"from_attributes": True}

# ── Trainer ───────────────────────────────────────────
class TrainerCreate(BaseModel):
    user_id: int
    gym_id: int
    specialty: str
    experience_years: int = 0

class TrainerOut(BaseModel):
    id: int
    user_id: int
    gym_id: int
    specialty: Optional[str]
    experience_years: int
    rating: float
    model_config = {"from_attributes": True}

# ── Attendance ────────────────────────────────────────
class AttendanceCreate(BaseModel):
    member_id: int
    method: str = "manual"

class AttendanceOut(BaseModel):
    id: int
    member_id: int
    checked_in_at: datetime
    method: str
    model_config = {"from_attributes": True}

# ── Payment ───────────────────────────────────────────
class PaymentCreate(BaseModel):
    member_id: int
    amount: float
    description: str
    method: str = "Stripe"
    invoice_number: Optional[str] = None

class PaymentOut(BaseModel):
    id: int
    member_id: int
    amount: float
    description: str
    method: str
    status: str
    invoice_number: Optional[str]
    paid_at: datetime
    model_config = {"from_attributes": True}

# ── Workout ───────────────────────────────────────────
class WorkoutCreate(BaseModel):
    name: str
    trainer_id: int
    member_id: Optional[int] = None
    duration_minutes: int
    level: str = "Beginner"
    exercises: str  # JSON string

class WorkoutOut(BaseModel):
    id: int
    name: str
    trainer_id: int
    member_id: Optional[int]
    duration_minutes: int
    level: str
    exercises: str
    created_at: datetime
    model_config = {"from_attributes": True}

# ── Dashboard ─────────────────────────────────────────
class SuperAdminStats(BaseModel):
    total_gyms: int
    active_users: int
    monthly_revenue: float
    churn_rate: float

class GymOwnerStats(BaseModel):
    total_members: int
    monthly_revenue: float
    active_members: int
    attendance_today: int
