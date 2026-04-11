# PatientBridge 🏥✨

PatientBridge is a comprehensive, modern clinic management and pre-consultation platform custom-built for the **Sambhavna Trust Clinic (Bhopal)**. It seeks to redefine the digital healthcare experience by blending high-end web aesthetics with a completely digital workflow spanning from patient intake down to doctor examination.

### 🌟 What makes it useful?
In busy clinics, doctors often spend precious consultation time simply figuring out the patient's baseline symptoms. PatientBridge solves this with its heavily streamlined ecosystem:
1. **Premium Patient Experience:** The platform portrays trust and capability through a "Clinical Pearl" design logic, utilizing beautiful 3D WebGL interfaces, buttery smooth transitions, and distinct typography.
2. **Seamless Booking:** Patients can effortlessly pick their specialist, view available date blocks dynamically, and select timeslots in an elegant 4-step wizard.
3. **AI Pre-Consultation:** Instead of standard boring forms, patients chat with an automated AI assistant. This creates a deeply humanized "intake" phase that builds a clinical summary report for the doctor behind the scenes.
4. **Physician Dashboard:** Doctors receive their own secure portal that tracks their daily queue. When a patient sits down in the office, the doctor expands the AI report tab to see a concise synthesis of symptoms, duration, and focus areas—allowing them to *immediately* start diagnosing rather than interviewing.

---

### 🛠 Tech Stack

**Frontend Framework & Core**
*   **Next.js 15 (App Router)** - SSR, Routing, Framework
*   **React 19** - Component Architecture
*   **TypeScript** - Type safety and structured data modeling
*   **Tailwind CSS** - Fluid utilitarian styling & "glassmorphism" UI

**Animations & 3D WebGL**
*   **Framer Motion** - Page transitions, micro-interactions, layout IDs, custom cursors
*   **GSAP** - Robust scroll-triggered animation logic
*   **React Three Fiber / Three.js** - Performing the real-time 3D medical particle Hero scene 
*   **Canvas-Confetti** - Particle celebrations

**Backend Engine**
*   **Python / FastAPI** - Hyper-fast microservice architecture (runs via Uvicorn)
*   **REST Architecture** - Serving endpoints seamlessly to the Next.js client

**Additional Utilities**
*   **Date-Fns** - Complex calendar math and matrix logic
*   **Lucide React** - Premium consistent SVG iconography

---

### 🚀 Getting Started

**Start the Frontend:**
```bash
npm install
npm run dev
```
Open `http://localhost:3000`

**Start the Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API runs explicitly on port `8000`.

*Built with ♥ for Bhopal, India.*
