from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from config.database import get_db
from auth_utils import get_current_user
import models, schemas
from typing import List

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/checkin", response_model=schemas.AttendanceOut)
def check_in(data: schemas.AttendanceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    record = models.Attendance(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/member/{member_id}", response_model=List[schemas.AttendanceOut])
def member_attendance(member_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Attendance).filter(models.Attendance.member_id == member_id).order_by(models.Attendance.checked_in_at.desc()).all()

@router.get("/gym/{gym_id}/today")
def today_attendance(gym_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    today = date.today()
    count = (
        db.query(func.count(models.Attendance.id))
        .join(models.Member, models.Attendance.member_id == models.Member.id)
        .filter(
            models.Member.gym_id == gym_id,
            func.date(models.Attendance.checked_in_at) == today,
        )
        .scalar()
    )
    return {"gym_id": gym_id, "date": str(today), "count": count}

@router.get("/gym/{gym_id}/weekly")
def weekly_attendance(gym_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    rows = (
        db.query(
            func.date(models.Attendance.checked_in_at).label("day"),
            func.count(models.Attendance.id).label("count"),
        )
        .join(models.Member, models.Attendance.member_id == models.Member.id)
        .filter(models.Member.gym_id == gym_id)
        .group_by(func.date(models.Attendance.checked_in_at))
        .order_by(func.date(models.Attendance.checked_in_at).desc())
        .limit(7)
        .all()
    )
    return [{"day": str(r.day), "count": r.count} for r in rows]
