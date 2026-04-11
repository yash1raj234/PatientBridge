from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import Appointment, Patient, Slot, Doctor
from models.models import AppointmentStatus, SlotStatus
from schemas import AppointmentCreate, AppointmentOut, AppointmentListItem

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


@router.post("/", response_model=dict)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    # 1 – Validate slot exists and is available
    slot = db.query(Slot).filter(Slot.id == payload.slot_id).with_for_update().first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    if slot.status != SlotStatus.available:
        raise HTTPException(status_code=409, detail="Slot is already booked")

    # 2 – Validate doctor matches slot
    if slot.doctor_id != payload.doctor_id:
        raise HTTPException(status_code=400, detail="Slot does not belong to the specified doctor")

    # 3 – Create or reuse patient record (match by name + phone)
    patient = None
    if payload.patient_phone:
        patient = db.query(Patient).filter(Patient.phone == payload.patient_phone).first()

    if not patient:
        patient = Patient(
            name=payload.patient_name,
            age=payload.patient_age,
            phone=payload.patient_phone,
        )
        db.add(patient)
        db.flush()

    # 4 – Create appointment
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=payload.doctor_id,
        slot_id=slot.id,
        date=slot.date,
        time=slot.label,
        chief_complaint=payload.chief_complaint,
        status=AppointmentStatus.waiting,
    )
    db.add(appointment)

    # 5 – Mark slot as booked
    slot.status = SlotStatus.booked

    db.commit()
    db.refresh(appointment)

    return {
        "appointment_id": str(appointment.id),
        "patient_id": str(patient.id),
        "date": appointment.date,
        "time": appointment.time,
        "status": appointment.status.value,
    }


@router.get("/", response_model=List[AppointmentListItem])
def list_appointments(
    doctor_id: Optional[UUID] = Query(None),
    date: Optional[str]       = Query(None, description="yyyy-MM-dd"),
    status: Optional[str]     = Query(None),
    db: Session                = Depends(get_db),
):
    q = (
        db.query(Appointment)
        .options(joinedload(Appointment.patient), joinedload(Appointment.ai_report))
    )
    if doctor_id:
        q = q.filter(Appointment.doctor_id == doctor_id)
    if date:
        q = q.filter(Appointment.date == date)
    if status:
        q = q.filter(Appointment.status == status)

    apts = q.order_by(Appointment.time).all()

    return [
        AppointmentListItem(
            id=a.id,
            patient_name=a.patient.name,
            patient_age=a.patient.age,
            time=a.time,
            date=a.date,
            status=a.status.value,
            chief_complaint=a.chief_complaint,
            has_ai_report=a.ai_report is not None,
        )
        for a in apts
    ]


@router.get("/{appointment_id}", response_model=AppointmentOut)
def get_appointment(appointment_id: UUID, db: Session = Depends(get_db)):
    apt = (
        db.query(Appointment)
        .options(
            joinedload(Appointment.patient),
            joinedload(Appointment.doctor),
            joinedload(Appointment.ai_report),
        )
        .filter(Appointment.id == appointment_id)
        .first()
    )
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return AppointmentOut.from_orm_ext(apt)


@router.patch("/{appointment_id}/status")
def update_status(appointment_id: UUID, status: str, db: Session = Depends(get_db)):
    valid = {s.value for s in AppointmentStatus}
    if status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid}")

    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    apt.status = AppointmentStatus(status)
    db.commit()
    return {"appointment_id": str(apt.id), "status": apt.status.value}
