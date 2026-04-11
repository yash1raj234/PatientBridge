import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime,
    ForeignKey, Enum, Text, JSON, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from database import Base


# ─── Enums ────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    doctor  = "doctor"
    patient = "patient"
    admin   = "admin"


class SlotStatus(str, enum.Enum):
    available = "available"
    booked    = "booked"


class AppointmentStatus(str, enum.Enum):
    waiting     = "waiting"
    in_progress = "in_progress"
    completed   = "completed"
    cancelled   = "cancelled"


class RiskLevel(str, enum.Enum):
    low    = "low"
    medium = "medium"
    high   = "high"


class MessageSender(str, enum.Enum):
    ai      = "ai"
    patient = "patient"


# ─── Models ───────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email          = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role           = Column(Enum(UserRole), nullable=False, default=UserRole.patient)
    is_active      = Column(Boolean, default=True)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    doctor = relationship("Doctor", back_populates="user", uselist=False)


class Doctor(Base):
    __tablename__ = "doctors"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name            = Column(String(255), nullable=False)
    specialty       = Column(String(255), nullable=False)
    qualifications  = Column(String(500), nullable=True)
    bio             = Column(Text, nullable=True)
    avatar_initials = Column(String(10), nullable=True)
    available_today = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    user         = relationship("User", back_populates="doctor")
    slots        = relationship("Slot", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")


class Patient(Base):
    __tablename__ = "patients"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name       = Column(String(255), nullable=False)
    age        = Column(Integer, nullable=False)
    phone      = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    appointments = relationship("Appointment", back_populates="patient")


class Slot(Base):
    __tablename__ = "slots"
    __table_args__ = (
        UniqueConstraint("doctor_id", "date", "time", name="uq_slot_doctor_date_time"),
    )

    id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False)
    date      = Column(String(10), nullable=False)   # yyyy-MM-dd
    time      = Column(String(5),  nullable=False)   # HH:mm (24hr)
    label     = Column(String(20), nullable=False)   # "9:00 AM"
    status    = Column(Enum(SlotStatus), nullable=False, default=SlotStatus.available)

    doctor      = relationship("Doctor", back_populates="slots")
    appointment = relationship("Appointment", back_populates="slot", uselist=False)


class Appointment(Base):
    __tablename__ = "appointments"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id      = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id       = Column(UUID(as_uuid=True), ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False)
    slot_id         = Column(UUID(as_uuid=True), ForeignKey("slots.id", ondelete="SET NULL"), nullable=True)
    date            = Column(String(10), nullable=False)
    time            = Column(String(10), nullable=False)  # "9:00 AM"
    chief_complaint = Column(Text, nullable=True)
    status          = Column(Enum(AppointmentStatus), nullable=False, default=AppointmentStatus.waiting)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    patient          = relationship("Patient", back_populates="appointments")
    doctor           = relationship("Doctor", back_populates="appointments")
    slot             = relationship("Slot", back_populates="appointment")
    symptom_messages = relationship("SymptomMessage", back_populates="appointment", order_by="SymptomMessage.created_at")
    ai_report        = relationship("AIReport", back_populates="appointment", uselist=False)


class SymptomMessage(Base):
    __tablename__ = "symptom_messages"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False)
    sender         = Column(Enum(MessageSender), nullable=False)
    message        = Column(Text, nullable=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    appointment = relationship("Appointment", back_populates="symptom_messages")


class AIReport(Base):
    __tablename__ = "ai_reports"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id      = Column(UUID(as_uuid=True), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False, unique=True)
    summary             = Column(Text, nullable=False)
    key_symptoms        = Column(JSON, nullable=False, default=list)   # ["...", "..."]
    possible_conditions = Column(JSON, nullable=False, default=list)
    risk_level          = Column(Enum(RiskLevel), nullable=False, default=RiskLevel.low)
    doctor_focus        = Column(JSON, nullable=False, default=list)
    generated_at        = Column(DateTime(timezone=True), server_default=func.now())

    appointment = relationship("Appointment", back_populates="ai_report")
