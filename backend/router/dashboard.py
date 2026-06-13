from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from config.database import get_db
from auth_utils import get_current_user
import models, schemas

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/super-admin", response_model=schemas.SuperAdminStats)
def super_admin_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total_gyms = db.query(func.count(models.Gym.id)).scalar()
    active_users = db.query(func.count(models.User.id)).filter(models.User.is_active == True).scalar()
    monthly_revenue = db.query(func.coalesce(func.sum(models.Payment.amount), 0)).scalar()
    total_members = db.query(func.count(models.Member.id)).scalar() or 1
    inactive = db.query(func.count(models.Member.id)).filter(models.Member.status != "Active").scalar()
    churn_rate = round((inactive / total_members) * 100, 1)
    return schemas.SuperAdminStats(
        total_gyms=total_gyms,
        active_users=active_users,
        monthly_revenue=float(monthly_revenue),
        churn_rate=churn_rate,
    )

@router.get("/gym-owner/{gym_id}", response_model=schemas.GymOwnerStats)
def gym_owner_stats(gym_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total_members = db.query(func.count(models.Member.id)).filter(models.Member.gym_id == gym_id).scalar()
    active_members = db.query(func.count(models.Member.id)).filter(models.Member.gym_id == gym_id, models.Member.status == "Active").scalar()
    today = date.today()
    attendance_today = (
        db.query(func.count(models.Attendance.id))
        .join(models.Member, models.Attendance.member_id == models.Member.id)
        .filter(models.Member.gym_id == gym_id, func.date(models.Attendance.checked_in_at) == today)
        .scalar()
    )
    monthly_revenue = (
        db.query(func.coalesce(func.sum(models.Payment.amount), 0))
        .join(models.Member, models.Payment.member_id == models.Member.id)
        .filter(models.Member.gym_id == gym_id)
        .scalar()
    )
    return schemas.GymOwnerStats(
        total_members=total_members,
        monthly_revenue=float(monthly_revenue),
        active_members=active_members,
        attendance_today=attendance_today,
    )
