from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from config.database import Base
import enum

class RoleEnum(str, enum.Enum):
    super_admin = "super_admin"
    gym_owner = "gym_owner"
    trainer = "trainer"
    member = "member"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    gym = relationship("Gym", back_populates="owner", uselist=False)
    trainer_profile = relationship("Trainer", back_populates="user", uselist=False)
    member_profile = relationship("Member", back_populates="user", uselist=False)

class Gym(Base):
    __tablename__ = "gyms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    plan = Column(String, default="Starter")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="gym")
    members = relationship("Member", back_populates="gym")
    trainers = relationship("Trainer", back_populates="gym")

class Member(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    trainer_id = Column(Integer, ForeignKey("trainers.id"), nullable=True)
    membership_plan = Column(String, default="Monthly")
    status = Column(String, default="Active")
    join_date = Column(DateTime(timezone=True), server_default=func.now())
    expiry_date = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="member_profile")
    gym = relationship("Gym", back_populates="members")
    trainer = relationship("Trainer", back_populates="members")
    attendance = relationship("Attendance", back_populates="member")
    payments = relationship("Payment", back_populates="member")
    workouts = relationship("WorkoutPlan", back_populates="member")

class Trainer(Base):
    __tablename__ = "trainers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    specialty = Column(String)
    experience_years = Column(Integer, default=0)
    rating = Column(Float, default=0.0)

    user = relationship("User", back_populates="trainer_profile")
    gym = relationship("Gym", back_populates="trainers")
    members = relationship("Member", back_populates="trainer")
    workout_plans = relationship("WorkoutPlan", back_populates="trainer")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    checked_in_at = Column(DateTime(timezone=True), server_default=func.now())
    method = Column(String, default="manual")

    member = relationship("Member", back_populates="attendance")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    amount = Column(Float, nullable=False)
    description = Column(String)
    method = Column(String, default="Stripe")
    status = Column(String, default="Paid")
    invoice_number = Column(String)
    paid_at = Column(DateTime(timezone=True), server_default=func.now())

    member = relationship("Member", back_populates="payments")

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    member_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    duration_minutes = Column(Integer)
    level = Column(String, default="Beginner")
    exercises = Column(Text)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    trainer = relationship("Trainer", back_populates="workout_plans")
    member = relationship("Member", back_populates="workouts")
