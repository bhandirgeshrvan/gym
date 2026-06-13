from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from auth_utils import get_current_user
import models, schemas
from typing import List

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/", response_model=List[schemas.PaymentOut])
def list_payments(member_id: int = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = db.query(models.Payment)
    if member_id:
        q = q.filter(models.Payment.member_id == member_id)
    return q.order_by(models.Payment.paid_at.desc()).all()

@router.post("/", response_model=schemas.PaymentOut)
def create_payment(data: schemas.PaymentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    payment = models.Payment(**data.model_dump())
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

@router.get("/{payment_id}", response_model=schemas.PaymentOut)
def get_payment(payment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment
