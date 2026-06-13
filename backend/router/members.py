from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from auth_utils import get_current_user
import models, schemas
from typing import List

router = APIRouter(prefix="/members", tags=["Members"])

@router.get("/", response_model=List[schemas.MemberOut])
def list_members(gym_id: int = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = db.query(models.Member)
    if gym_id:
        q = q.filter(models.Member.gym_id == gym_id)
    elif current_user.role == "trainer":
        trainer = db.query(models.Trainer).filter(models.Trainer.user_id == current_user.id).first()
        if trainer:
            q = q.filter(models.Member.trainer_id == trainer.id)
    return q.all()

@router.post("/", response_model=schemas.MemberOut)
def create_member(data: schemas.MemberCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    member = models.Member(**data.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.get("/{member_id}", response_model=schemas.MemberOut)
def get_member(member_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@router.patch("/{member_id}", response_model=schemas.MemberOut)
def update_member(member_id: int, data: schemas.MemberCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(member, k, v)
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return {"message": "Member deleted"}
