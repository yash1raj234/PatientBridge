from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


# ─── Auth ─────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    doctor_id: UUID
    doctor_name: str
    specialty: str


# ─── Doctor ───────────────────────────────────────────────────────────────

class DoctorOut(BaseModel):
    id: UUID
    name: str
    specialty: str
    qualifications: Optional[str]
    bio: Optional[str]
    avatar_initials: Optional[str]
    available_today: bool

    model_config = {"from_attributes": True}


# ─── Patient ──────────────────────────────────────────────────────────────

class PatientCreate(BaseModel):
    name: str
    age: int
    phone: Optional[str] = None


class PatientOut(BaseModel):
    id: UUID
    name: str
    age: int
    phone: Optional[str]

    model_config = {"from_attributes": True}


# ─── Slot ─────────────────────────────────────────────────────────────────

class SlotOut(BaseModel):
    id: UUID
    doctor_id: UUID
    date: str
    time: str
    label: str
    status: str

    model_config = {"from_attributes": True}


# ─── Appointment ──────────────────────────────────────────────────────────

class AppointmentCreate(BaseModel):
    patient_name: str
    patient_age: int
    patient_phone: Optional[str] = None
    doctor_id: UUID
    slot_id: UUID
    chief_complaint: Optional[str] = None


class AppointmentOut(BaseModel):
    id: UUID
    patient: PatientOut
    doctor: DoctorOut
    date: str
    time: str
    chief_complaint: Optional[str]
    status: str
    has_ai_report: bool
    created_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_ext(cls, apt) -> "AppointmentOut":
        return cls(
            id=apt.id,
            patient=PatientOut.model_validate(apt.patient),
            doctor=DoctorOut.model_validate(apt.doctor),
            date=apt.date,
            time=apt.time,
            chief_complaint=apt.chief_complaint,
            status=apt.status.value if hasattr(apt.status, "value") else apt.status,
            has_ai_report=apt.ai_report is not None,
            created_at=apt.created_at,
        )


class AppointmentListItem(BaseModel):
    id: UUID
    patient_name: str
    patient_age: int
    time: str
    date: str
    status: str
    chief_complaint: Optional[str]
    has_ai_report: bool

    model_config = {"from_attributes": True}


# ─── Symptoms ─────────────────────────────────────────────────────────────

class SymptomMessageIn(BaseModel):
    sender: str   # "ai" or "patient"
    message: str


class SymptomBatchIn(BaseModel):
    appointment_id: UUID
    messages: List[SymptomMessageIn]


class SymptomMessageOut(BaseModel):
    id: UUID
    sender: str
    message: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── AI Report ────────────────────────────────────────────────────────────

class AIReportTrigger(BaseModel):
    appointment_id: UUID


class AIReportOut(BaseModel):
    id: UUID
    appointment_id: UUID
    summary: str
    key_symptoms: List[str]
    possible_conditions: List[str]
    risk_level: str
    doctor_focus: List[str]
    generated_at: datetime

    # Aliases matching the frontend's mockData shape
    @property
    def keySymptoms(self) -> List[str]:
        return self.key_symptoms

    @property
    def riskLevel(self) -> str:
        return self.risk_level.upper()

    @property
    def focusPoints(self) -> List[str]:
        return self.doctor_focus

    model_config = {"from_attributes": True}
