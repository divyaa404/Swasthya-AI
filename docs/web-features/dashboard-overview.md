# 🖥️ Doctor Dashboard — Web Feature Overview

## What It Is

The doctor-facing web dashboard is built in React 19 with TypeScript, Vite 6, and Tailwind CSS v4. It is the primary tool doctors use to monitor their patients between visits, review AI-generated insights, interact with patient data, and manage their practice.

The dashboard connects to the same Supabase database as the patient app, with row-level security (RLS) that ensures doctors can only access records of their assigned patients. All AI features are powered by the FastAPI backend.

---

## Design Philosophy: The One-Look Rule

The most important design constraint on the dashboard is the **One-Look Rule**: a doctor opening the dashboard should understand who needs attention and why within **5 seconds** — without reading a paragraph, clicking into a patient, or parsing a complex interface.

This means:
- The Morning Briefing is the first thing visible on login
- Patients without alerts are not shown in the briefing
- Urgency is communicated visually (colour, icon) before text
- Every piece of information on the briefing card answers "so what?" not just "what"

---

## Pages and Sections

### Main Dashboard Page
- Morning Briefing Card (centre, full width)
- Patient list (below briefing, filterable and searchable)
- Recovery Counter (sidebar — live count of Recovery Confirmation milestones)
- Low Engagement flags (patients with 2+ missed check-ins, shown in amber)

### Patient Detail Page
- Full patient profile loaded after QR scan or list click
- AI 7-day summary (prominent, top of page)
- Body heatmap (same visual as patient app, with clinical labels)
- RAG risk score panel (base score + adjustment + guideline source, shown as separate fields)
- Analytics charts (risk trend, symptom frequency, adherence, wearable data)
- Medication list with conflict flags and override history
- Async Q&A panel (send questions, see queued and answered questions)
- Recovery timeline

### QR Scanner Page
- Camera view for scanning patient or family QR codes
- Individual QR → Patient Detail Page
- Family QR → Family Overview (anonymised, filtered)

### Medicine Section
- Full list of all active medications across all assigned patients
- Filterable by: patient, drug name, conflict flag status, adherence rate
- Conflict flags shown with severity badge
- Doctor override input (add clinical note to override a conflict flag)
- Jan Aushadhi affordability summary per patient

### Appointments Section
- List of all patients flagged for follow-up, sorted by urgency
- Each entry: patient name, urgency level, reason for flag, last check-in date
- Actions: Mark completed, Add note, Notify patient to come in
- Filter by: urgency level, condition type, date range

---

## Navigation

Left sidebar navigation:
- 🏠 Dashboard (Morning Briefing + Patient List)
- 📷 Scan QR
- 💊 Medicines
- 📅 Appointments
- 🤖 AI Assistant (Doctor Q&A Agent — patient-specific once a patient is selected)
- ⚙️ Settings

---

## Tech Stack Details

| Component | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| QR Scanning | html5-qrcode |
| Animations | Motion (Framer Motion) |
| Auth | Supabase Auth |
| Data | Supabase JS client (RLS-enforced) |
| Hosting | Vercel |
