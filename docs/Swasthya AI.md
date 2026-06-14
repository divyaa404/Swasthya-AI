# 🏥 Swasthya AI — Complete Product Overview

> **स्वास्थ्य** *(Swasthya)* — the Sanskrit word for "health." A platform built around the belief that every patient, regardless of income or location, deserves continuous, intelligent, and dignified healthcare support.

---

## What Is Swasthya AI?

Swasthya AI is a **two-sided clinical intelligence platform** built specifically for the Indian healthcare context. It connects patients managing chronic and acute conditions with their doctors through a layer of continuous AI-powered monitoring, structured data capture, and actionable clinical intelligence — all designed around the real constraints of Indian healthcare: fragmented records, short consultations, connectivity gaps, and a massive burden of preventable chronic disease.

The platform has two primary surfaces:

- **A patient-facing mobile app** (React Native + Expo) where patients log symptoms, take daily AI check-ins, track medicines, manage family health, and understand their own risk in plain language.
- **A doctor-facing web dashboard** (React + TypeScript + Vite) where doctors receive morning briefings, scan patient QR codes to pull complete records, ask AI questions about their patients, view analytics, manage prescriptions, and track recovery outcomes.

Together, they are connected by a **FastAPI AI backend** running Groq LLaMA 3.3 70B, a RAG pipeline grounded in WHO/ICMR clinical guidelines, deterministic safety logic, and ML anomaly detection on wearable data.

Swasthya AI is **not** a diagnosis system. Every output is framed as a risk indicator or clinical decision support signal. The platform's explicit design principle is: *the AI flags patterns, the doctor makes decisions, the patient gets better.*

---

## The Problem

Healthcare in India is not broken — it is **fragmented, reactive, and disconnected between visits.**

| Problem | Reality |
|---|---|
| Scattered records | A patient's hypertension history, their mother's pre-diabetes, and a sibling's kidney condition live in three separate paper files across three different clinics. No system connects them. |
| 10-minute consultations | The first 5 minutes are spent gathering context that already exists somewhere but is never accessible when needed. |
| Invisible between-visit deterioration | No system watches for patterns between appointments. Signals build silently. |
| Unsafe OTC medication | Patients buy medicines over the counter without knowing what interactions exist with their current prescriptions. Nobody warns them. |
| Financial access gaps | Patients with serious chronic conditions often have no idea that government schemes — PM-JAY, Rashtriya Arogya Nidhi, PMJAP — could cover their treatment. |
| Language and literacy barriers | Most health apps assume English fluency and smartphone proficiency. Real patients don't. |

---

## The Five Pillars

### Pillar 1 — Continuous Patient Intelligence
The app monitors patients *between* visits, not just during them. Daily adaptive AI check-ins surface new symptoms. Wearable data (heart rate, SpO2, sleep, steps) is continuously processed through a Signal Quality Index filter and an Isolation Forest anomaly detector calibrated per patient. A body heatmap visualises symptom history with recency decay — zones fade back to green as the patient recovers. Every signal feeds a live risk score that updates throughout the day.

### Pillar 2 — Clinical Decision Support for Doctors
The doctor dashboard presents a **Morning Briefing Card** every day — generated at 11 PM the night before, listing only patients who need attention and exactly why. Doctors can scan a patient's QR code and have the complete clinical picture in under 3 seconds. An AI assistant on the dashboard answers free-text clinical questions about any patient — grounded entirely in that patient's own data, with RAG source citations visible for every answer.

### Pillar 3 — Safety Layer
Drug conflict detection blocks new medications from being saved until an OpenFDA interaction check completes. A deterministic escalation matrix with 8 Critical Single-Symptom Overrides triggers immediate doctor notification for stroke, cardiac, and respiratory emergencies — without waiting for a second signal. Missed check-ins are flagged proactively; the system cannot silently assume a non-reporting patient is fine.

### Pillar 4 — Financial Access Layer
When a patient's risk score crosses an elevated threshold, the affordability engine automatically triggers: it reads their active medications, fetches Jan Aushadhi generic prices, calculates monthly and annual savings, checks eligibility for central and state government schemes, and generates a **Jan Aushadhi Ready Prescription PDF** — a clean, printable document the patient can hand directly to a pharmacist at a Jan Aushadhi Kendra.

### Pillar 5 — Recovery and Trust System
When a patient's risk indicator drops significantly and stays low for 3 consecutive days, a Recovery Confirmation milestone fires: the patient receives a personalised recovery message, the episode is logged in their medical timeline, and the doctor's **Recovery Counter** increments — a visible, objective professional impact metric that patients see when choosing a doctor.

---

## Patient Mobile App — Full Overview

The patient app is built in React Native 0.81 with Expo 54, using TypeScript throughout. It connects to Supabase for auth and data, the FastAPI backend for all AI operations, and Apple HealthKit / Google Health Connect for wearable data.

### Onboarding
There are no forms. A multi-turn AI conversation collects the patient's complete health profile: chronic conditions (with follow-up — diabetes → insulin or oral? what dosage?), current medications, allergies, past surgeries, family history, and income category for scheme eligibility matching. The conversation ends with a structured Profile Confirmation Card the patient reviews before anything is saved.

### Home Dashboard
The home screen shows: current risk score as a range with confidence band (never a single precise number), trend indicator (improving / stable / worsening), body heatmap, recent wearable readings, and any pending alerts. If a drug conflict was detected or an escalation was triggered, it appears here first.

### Daily Check-In
Every day, 2–3 personalised questions are generated from the patient's conditions, recent symptoms, active medications, and the last 24 hours of wearable data. If the smartwatch detected elevated resting heart rate overnight, one question asks about chest comfort — without the patient mentioning it. Event-triggered check-ins also fire after wearable anomalies, missed medicine streaks, or risk score changes.

### AI Health Chatbot
A conversational interface where patients can ask health questions and report symptoms in natural language. Every message passes through a parallel extraction pipeline: one call generates the conversational reply, a second extracts structured symptom data. Confidence below 70% triggers a clarifying question. Severity 7 or above requires explicit patient confirmation before saving.

### Body Heatmap
An SVG human figure (front and back views) divided into anatomical zones. Zone colour is computed from symptom frequency, severity, and a recency decay function — zones fade gradually as symptoms resolve. Smartwatch anomalies contribute to zone scores even when the patient hasn't reported symptoms. Tapping any zone reveals contributing symptoms, timeline, severity trend, and zone Health Index.

### Medicine Tracker
Every new medicine added triggers a synchronous OpenFDA interaction check against all active medications before it can be saved. If a conflict is found, the system shows: which medicines interact, the severity level (Informational / Caution / Do not take without doctor guidance), and a plain-language warning in both the app and the doctor dashboard. A doctor can override with a clinical note; the flag is permanently recorded.

### Medicine Affordability Engine + Jan Aushadhi PDF
Automatically triggered when risk crosses elevated threshold. Fetches Jan Aushadhi generic prices for active medications, calculates monthly and annual savings, shows nearest Jan Aushadhi Kendra, and generates a clean printable PDF the patient can use at the pharmacy. Not a medical prescription; clearly labelled as a generic reference document.

### Government Scheme Eligibility
A condition-specific panel showing PM-JAY, Rashtriya Arogya Nidhi, PMJAP, and applicable state schemes with: conditions covered, age and income requirements, coverage amount, documents required, and nearby empanelled hospitals.

### Family Health System
One QR code per family unit. Individual health records remain fully private. A **sensitive condition filter** operates at the data layer — HIV, mental health diagnoses, STDs, and cancer never appear in any family summary view. Family members see only: non-sensitive risk levels, general condition tags, and shared symptom patterns. Each member controls per-category sharing, defaulting to OFF for all sensitive categories.

### Recovery Confirmation
When risk drops significantly and holds for 3 days, the patient receives a personalised milestone message and their episode is marked "Recovered" in their timeline.

---

## Doctor Web Dashboard — Full Overview

The doctor dashboard is built in React 19 with TypeScript, Vite 6, and Tailwind CSS v4. It connects to the same Supabase database (with row-level security scoped to assigned patients) and the FastAPI backend for all AI operations.

### Morning Briefing
Generated every night at 11 PM. Lists only patients needing attention, why, and what was flagged overnight — sorted by urgency. Low-risk, no-alert patients are not shown. A doctor understands exactly who needs attention within 5 seconds of opening the dashboard. This is the **One-Look Rule** — the most important design constraint on the dashboard.

### QR Code Patient Entry
Doctors scan a patient's QR code (or family group QR) and the full patient profile loads instantly. Individual QR → full patient record. Family QR → family health overview with sensitive conditions filtered. Complete clinical context in under 3 seconds.

### Patient Analytics Dashboard
Per-patient view showing: 7-day AI summary (symptoms, adherence, wearable anomalies, concerning patterns, AI guidance given), body heatmap with zone flags, risk score trend charts (Recharts), symptom frequency and severity graphs, adherence timeline, wearable data visualisations (heart rate, SpO2, sleep stages, step counts), and the RAG source panel — showing exactly which WHO/ICMR guideline contributed to each risk score adjustment, with the source name, page reference, and adjustment value shown as separate data points, not buried in a final number.

### AI Clinical Assistant
A free-text AI chatbot on the dashboard where doctors ask clinical questions about a specific patient. Examples:
- *"Does this patient show signs of liver stress based on their reported symptoms?"*
- *"Can I prescribe paracetamol given their current medication list?"*
- *"What's the risk of adding metformin given their recent kidney function flags?"*

Every answer is grounded in that patient's actual data only — never general medical knowledge used in isolation. The response always shows: the source data used (symptom logs, wearable readings, medication records), the date of that data, the RAG guideline cited if applicable, and the explicit disclaimer: *"Answer grounded in patient data on record. Clinical decisions rest with the treating physician."*

### Async Doctor–Patient Q&A Loop
The doctor types a question. The system searches all patient data. If the answer exists → returned immediately with source and date. If not → the question is rewritten in conversational language and queued for the patient's next check-in. When the patient answers, the doctor is notified. Questions expire after 7 days, are prioritised by patient risk level, and can be cancelled any time.

### Medicine Management
Full list of all active medications per patient, adherence logs, drug conflict flags with override history, and the affordability engine output. Doctors can add, modify, or flag medications with clinical notes.

### Appointments Section
List of all patients who have been flagged for follow-up, with urgency level, last check-in date, and the specific reason they need to be seen. Doctors can mark appointments as completed, add notes, and trigger a patient notification to come in.

### Recovery Counter
A live count of patients who reached Recovery Confirmation milestones under this doctor's care. Visible to patients browsing doctors. Objective, data-driven professional impact metric.

---

## AI Backend — How It Works

The backend runs on FastAPI (Python 3.11) with Groq LLaMA 3.3 70B as the LLM, a LangChain + FAISS RAG pipeline over medical guideline PDFs, Isolation Forest anomaly detection per patient, and Linear Regression trend indicators.

### Key Safety Rules (Hardcoded, Cannot Be Overridden)
- Symptom not saved if extraction confidence < 70%
- Severity ≥ 7 requires explicit patient confirmation
- Escalation requires 2 independent danger signals (except 8 Critical Overrides)
- Doctor AI answers must cite exact data source and date
- Risk score AI adjustment capped at ±15; must cite specific RAG guideline
- New medicine cannot be saved until drug interaction check completes
- No names, IDs, or sensitive diagnoses ever appear in family summaries

### RAG Source Visibility
Every risk score is stored as: base score (deterministic Python rules) + adjustment value + guideline name + guideline section. The doctor dashboard displays these as separate fields — not a collapsed final number. This is a deliberate trust-building design decision: doctors can see exactly why the score changed.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Patient App | React Native 0.81, Expo 54, TypeScript, Zustand, Expo Router |
| Doctor Dashboard | React 19, TypeScript, Vite 6, Tailwind CSS v4, Recharts |
| AI Backend | FastAPI, Python 3.11, Groq LLaMA 3.3 70B |
| RAG | LangChain, FAISS, sentence-transformers MiniLM-L6-v2 |
| Anomaly Detection | Isolation Forest, Linear Regression (scikit-learn) |
| Drug Safety | OpenFDA API |
| Database | Supabase (PostgreSQL + RLS + Realtime + Auth) |
| Automation | N8N |
| Wearables | Apple HealthKit, Google Health Connect |
| Hosting | Render (backend), Vercel (dashboard), Expo EAS (mobile) |

---

## Regulatory and Ethics Position

- All outputs labelled as risk indicators, never diagnoses. The word "diagnosis" does not appear in any user-facing string.
- Every risk output and escalation carries explicit physician-decision disclaimer.
- Escalation triggers are a deterministic Python matrix — the LLM writes the language, never makes the trigger decision.
- DPDPA 2023 compliant: consent logged at onboarding, sensitive conditions filtered at data layer, all data deletable on request.
- Designed with awareness of CDSCO Medical Devices Rules 2017 (Class A/B voluntary registration path).
- Sensitive condition filter (HIV, mental health, cancer, STDs) operates at database query level — not in application logic — so it cannot be bypassed by a UI change.
