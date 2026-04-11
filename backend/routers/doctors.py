from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Doctor
from schemas import DoctorOut

router = APIRouter(prefix="/api/doctors", tags=["doctors"])


@router.get("/", response_model=List[DoctorOut])
def list_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).filter(Doctor.available_today == True).all()
    return doctors


@router.get("/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: UUID, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor
