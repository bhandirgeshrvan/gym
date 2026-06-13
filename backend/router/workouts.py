from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from auth_utils import get_current_user
import models, schemas
from typing import List

router = APIRouter(prefix="/workouts", tags=["Workouts"])

@router.get("/", response_model=List[schemas.WorkoutOut])
def list_workouts(trainer_id: int = None, member_id: int = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = db.query(models.WorkoutPlan)
    if trainer_id:
        q = q.filter(models.WorkoutPlan.trainer_id == trainer_id)
    if member_id:
        q = q.filter(models.WorkoutPlan.member_id == member_id)
    return q.all()

@router.post("/", response_model=schemas.WorkoutOut)
def create_workout(data: schemas.WorkoutCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    workout = models.WorkoutPlan(**data.model_dump())
    db.add(workout)
    db.commit()
    db.refresh(workout)
    return workout

@router.get("/{workout_id}", response_model=schemas.WorkoutOut)
def get_workout(workout_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    workout = db.query(models.WorkoutPlan).filter(models.WorkoutPlan.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.patch("/{workout_id}", response_model=schemas.WorkoutOut)
def update_workout(workout_id: int, data: schemas.WorkoutCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    workout = db.query(models.WorkoutPlan).filter(models.WorkoutPlan.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(workout, k, v)
    db.commit()
    db.refresh(workout)
    return workout

@router.delete("/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    workout = db.query(models.WorkoutPlan).filter(models.WorkoutPlan.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted"}
