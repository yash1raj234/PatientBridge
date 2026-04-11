"""
Seed script: creates all tables and populates initial data.
Run once: python seed.py
"""
import uuid
from datetime import date, timedelta

from database import engine, SessionLocal
from models.models import Base, User, Doctor, Slot, UserRole, SlotStatus
from services.auth_service import hash_password

SLOT_TIMES = [
    ("09:00", "9:00 AM"),
    ("09:30", "9:30 AM"),
    ("10:00", "10:00 AM"),
    ("10:30", "10:30 AM"),
    ("11:00", "11:00 AM"),
    ("11:30", "11:30 AM"),
    ("12:00", "12:00 PM"),
    ("12:30", "12:30 PM"),
    ("14:00", "2:00 PM"),
    ("14:30", "2:30 PM"),
    ("15:00", "3:00 PM"),
    ("15:30", "3:30 PM"),
    ("16:00", "4:00 PM"),
    ("16:30", "4:30 PM"),
]

DOCTORS_DATA = [
    {
        "email":    "dr.ananya@sambhavna.org",
        "password": "doctor123",
        "name":     "Dr. Ananya Sharma",
        "specialty":      "General Physician",
        "qualifications": "MBBS, MD — 12 years experience",
        "bio":            "Compassionate general physician specializing in holistic care and chronic disease management.",
        "avatar_initials": "AS",
    },
    {
        "email":    "dr.rakesh@sambhavna.org",
        "password": "doctor123",
        "name":     "Dr. Rakesh Verma",
        "specialty":      "Pulmonologist",
        "qualifications": "MBBS, MD (Pulmonary Medicine) — 20 years experience",
        "bio":            "Expert in respiratory conditions with extensive experience treating Bhopal Gas Tragedy survivors.",
        "avatar_initials": "RV",
    },
    {
        "email":    "dr.sunita@sambhavna.org",
        "password": "doctor123",
        "name":     "Dr. Sunita Rao",
        "specialty":      "Ayurvedic Specialist",
        "qualifications": "BAMS, MD (Ayu) — 15 years experience",
        "bio":            "Dedicated practitioner of traditional Ayurvedic medicine focusing on natural remedies.",
        "avatar_initials": "SR",
    },
]

# Randomly pre-booked slots to make the calendar realistic
BOOKED_COMBINATIONS = {
    (0, "09:00"),
    (0, "10:00"),
    (1, "09:30"),
    (2, "11:00"),
    (3, "14:00"),
}


def seed():
    print("Creating tables…")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding doctors…")
        today = date.today()

        for doc_data in DOCTORS_DATA:
            # Create user account
            user = User(
                email=doc_data["email"],
                hashed_password=hash_password(doc_data["password"]),
                role=UserRole.doctor,
            )
            db.add(user)
            db.flush()

            # Create doctor profile
            doctor = Doctor(
                user_id=user.id,
                name=doc_data["name"],
                specialty=doc_data["specialty"],
                qualifications=doc_data["qualifications"],
                bio=doc_data["bio"],
                avatar_initials=doc_data["avatar_initials"],
                available_today=True,
            )
            db.add(doctor)
            db.flush()

            print(f"  Created {doctor.name}")

            # Create slots for next 14 days (Mon–Sat)
            for day_offset in range(14):
                slot_date = today + timedelta(days=day_offset)
                if slot_date.weekday() == 6:  # skip Sunday
                    continue

                date_str = slot_date.strftime("%Y-%m-%d")

                for time_24, label in SLOT_TIMES:
                    status = SlotStatus.available
                    if (day_offset, time_24) in BOOKED_COMBINATIONS:
                        status = SlotStatus.booked

                    slot = Slot(
                        doctor_id=doctor.id,
                        date=date_str,
                        time=time_24,
                        label=label,
                        status=status,
                    )
                    db.add(slot)

        db.commit()
        print("\nSeed complete!")
        print("\nDoctor login credentials:")
        for d in DOCTORS_DATA:
            print(f"  {d['name']}: {d['email']} / {d['password']}")

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
