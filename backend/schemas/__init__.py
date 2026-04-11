from .schemas import (
    # Auth
    LoginRequest, TokenResponse,
    # Doctor
    DoctorOut,
    # Patient
    PatientCreate, PatientOut,
    # Slot
    SlotOut,
    # Appointment
    AppointmentCreate, AppointmentOut, AppointmentListItem,
    # Symptoms
    SymptomMessageIn, SymptomMessageOut, SymptomBatchIn,
    # AI Report
    AIReportOut, AIReportTrigger,
)
