from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from auth_utils import get_current_user
import models, schemas
from typing import List

router = APIRouter(prefix="/trainers", tags=["Trainers"])

@router.get("/", response_model=List[schemas.TrainerOut])
def list_trainers(gym_id: int = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = db.query(models.Trainer)
    if gym_id:
        q = q.filter(models.Trainer.gym_id == gym_id)
    return q.all()

@router.post("/", response_model=schemas.TrainerOut)
def create_trainer(data: schemas.TrainerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    trainer = models.Trainer(**data.model_dump())
    db.add(trainer)
    db.commit()
    db.refresh(trainer)
    return trainer

@router.get("/{trainer_id}", response_model=schemas.TrainerOut)
def get_trainer(trainer_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    trainer = db.query(models.Trainer).filter(models.Trainer.id == trainer_id).first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return trainer

@router.patch("/{trainer_id}", response_model=schemas.TrainerOut)
def update_trainer(trainer_id: int, data: schemas.TrainerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    trainer = db.query(models.Trainer).filter(models.Trainer.id == trainer_id).first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(trainer, k, v)
    db.commit()
    db.refresh(trainer)
    return trainer
