from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import auth, doctors, slots, appointments, symptoms, ai_reports

app = FastAPI(
    title="PatientBridge API",
    description="Backend API for Sambhavna Trust Clinic — PatientBridge System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ─────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(slots.router)
app.include_router(appointments.router)
app.include_router(symptoms.router)
app.include_router(ai_reports.router)

# ─── Health ───────────────────────────────────────────────────────────────

@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "service": "PatientBridge API"}


@app.get("/", tags=["health"])
def root():
    return {
        "service": "PatientBridge API",
        "docs":    "/docs",
        "health":  "/health",
    }
