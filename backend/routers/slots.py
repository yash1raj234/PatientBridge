from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Slot
from schemas import SlotOut

router = APIRouter(prefix="/api/slots", tags=["slots"])


@router.get("/", response_model=List[SlotOut])
def get_slots(
    doctor_id: UUID = Query(..., description="Doctor UUID"),
    date: str      = Query(..., description="Date in yyyy-MM-dd format"),
    db: Session    = Depends(get_db),
):
    slots = (
        db.query(Slot)
        .filter(Slot.doctor_id == doctor_id, Slot.date == date)
        .order_by(Slot.time)
        .all()
    )
    return slots
