from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import SymptomMessage, Appointment
from models.models import MessageSender
from schemas import SymptomBatchIn, SymptomMessageOut

router = APIRouter(prefix="/api/symptoms", tags=["symptoms"])


@router.post("/", response_model=List[SymptomMessageOut])
def store_symptoms(payload: SymptomBatchIn, db: Session = Depends(get_db)):
    """
    Store the full symptom chat transcript after the patient completes
    the AI conversation. Called once at end of chat flow.
    """
    apt = db.query(Appointment).filter(Appointment.id == payload.appointment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    saved: List[SymptomMessage] = []
    for msg in payload.messages:
        try:
            sender_enum = MessageSender(msg.sender)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid sender: {msg.sender}")

        record = SymptomMessage(
            appointment_id=apt.id,
            sender=sender_enum,
            message=msg.message,
        )
        db.add(record)
        saved.append(record)

    db.commit()
    for r in saved:
        db.refresh(r)

    return [
        SymptomMessageOut(
            id=r.id,
            sender=r.sender.value,
            message=r.message,
            created_at=r.created_at,
        )
        for r in saved
    ]


@router.get("/{appointment_id}", response_model=List[SymptomMessageOut])
def get_symptoms(appointment_id: UUID, db: Session = Depends(get_db)):
    messages = (
        db.query(SymptomMessage)
        .filter(SymptomMessage.appointment_id == appointment_id)
        .order_by(SymptomMessage.created_at)
        .all()
    )
    return [
        SymptomMessageOut(
            id=m.id,
            sender=m.sender.value,
            message=m.message,
            created_at=m.created_at,
        )
        for m in messages
    ]
