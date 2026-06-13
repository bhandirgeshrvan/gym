from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from auth_utils import get_current_user
import models, schemas
from typing import List

router = APIRouter(prefix="/gyms", tags=["Gyms"])

@router.get("/", response_model=List[schemas.GymOut])
def list_gyms(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == "super_admin":
        return db.query(models.Gym).all()
    return db.query(models.Gym).filter(models.Gym.owner_id == current_user.id).all()

@router.post("/", response_model=schemas.GymOut)
def create_gym(data: schemas.GymCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    gym = models.Gym(**data.model_dump(), owner_id=current_user.id)
    db.add(gym)
    db.commit()
    db.refresh(gym)
    return gym

@router.get("/{gym_id}", response_model=schemas.GymOut)
def get_gym(gym_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    gym = db.query(models.Gym).filter(models.Gym.id == gym_id).first()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    return gym

@router.patch("/{gym_id}", response_model=schemas.GymOut)
def update_gym(gym_id: int, data: schemas.GymCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    gym = db.query(models.Gym).filter(models.Gym.id == gym_id, models.Gym.owner_id == current_user.id).first()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    for k, v in data.model_dump().items():
        setattr(gym, k, v)
    db.commit()
    db.refresh(gym)
    return gym

@router.delete("/{gym_id}")
def delete_gym(gym_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    gym = db.query(models.Gym).filter(models.Gym.id == gym_id).first()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    db.delete(gym)
    db.commit()
    return {"message": "Gym deleted"}
