from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import AIReport, Appointment, SymptomMessage
from schemas import AIReportOut, AIReportTrigger
from services.gemini_service import generate_report

router = APIRouter(prefix="/api/ai-reports", tags=["ai-reports"])


def _build_and_save_report(appointment_id: UUID, db: Session) -> AIReport:
    """Core logic: pull symptom messages → call Gemini → persist report."""
    # Get symptom messages
    messages = (
        db.query(SymptomMessage)
        .filter(SymptomMessage.appointment_id == appointment_id)
        .order_by(SymptomMessage.created_at)
        .all()
    )

    if not messages:
        raise HTTPException(
            status_code=422,
            detail="No symptom messages found. Patient must complete the chat first.",
        )

    msg_dicts = [{"sender": m.sender.value, "message": m.message} for m in messages]

    try:
        report_data = generate_report(msg_dicts)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {e}")

    report = AIReport(
        appointment_id=appointment_id,
        summary=report_data["summary"],
        key_symptoms=report_data["key_symptoms"],
        possible_conditions=report_data["possible_conditions"],
        risk_level=report_data["risk_level"],
        doctor_focus=report_data["doctor_focus"],
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.post("/generate", response_model=AIReportOut)
def generate_ai_report(payload: AIReportTrigger, db: Session = Depends(get_db)):
    """
    Generate and persist an AI pre-consultation report for an appointment.
    Called after patient completes symptom chat.
    Idempotent — returns existing report if already generated.
    """
    apt = db.query(Appointment).filter(Appointment.id == payload.appointment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Idempotency: return existing report if present
    existing = db.query(AIReport).filter(AIReport.appointment_id == payload.appointment_id).first()
    if existing:
        return existing

    report = _build_and_save_report(payload.appointment_id, db)
    return report


@router.get("/{appointment_id}", response_model=AIReportOut)
def get_ai_report(appointment_id: UUID, db: Session = Depends(get_db)):
    report = db.query(AIReport).filter(AIReport.appointment_id == appointment_id).first()
    if not report:
        raise HTTPException(
            status_code=404,
            detail="AI report not found. Use POST /api/ai-reports/generate to create one.",
        )
    return report
