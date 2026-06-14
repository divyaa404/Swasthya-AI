# 🏥 Swasthya AI — Complete Product Overview

> **स्वास्थ्य** *(Swasthya)* — the Sanskrit word for "health." A platform built around the belief that every patient, regardless of income or location, deserves continuous, intelligent, and dignified healthcare support.

---

## What Is Swasthya AI?

Swasthya AI is a **two-sided clinical intelligence platform** built specifically for the Indian healthcare context. It connects patients managing chronic and acute conditions with their doctors through a layer of continuous AI-powered monitoring, structured data capture, and actionable clinical intelligence — all designed around the real constraints of Indian healthcare: fragmented records, short consultations, connectivity gaps, and a massive burden of preventable chronic disease.

The platform has two primary surfaces:

- **A patient-facing mobile app** (React Native + Expo) where patients log symptoms, take daily AI check-ins, track medicines, manage family health, scan medical records, and understand their own risk in plain language.
- **A doctor-facing web dashboard** (React + TypeScript + Vite) where doctors receive morning briefings, scan patient QR codes to pull complete records, ask AI questions about their patients, view analytics, manage prescriptions, and track recovery outcomes.

Together, they are connected by a **FastAPI AI backend** running Groq LLaMA 3.3 70B and Sarvam AI, a RAG pipeline grounded in WHO/ICMR clinical guidelines, deterministic safety logic, ML anomaly detection on wearable data, and automated appointment scheduling.

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
The home screen shows: current risk score as a range with confidence band (never a single precise number) calculated out of 100 via a RAG pipeline, trend indicator (improving / stable / worsening), body heatmap, recent wearable readings, and any pending alerts. If a drug conflict was detected or an escalation was triggered, it appears here first.

### Daily Check-In
Every day, the Check-In Agent generates personalized, conversational questions based on unresolved symptoms and daily orchestrator findings. For example, if a headache has been flagged, it asks: *"Are you still getting headaches? How long has it been? How severe is the pain?"* It compiles answers directly back into the symptom logs.

### Multilingual AI Health Chatbot (Sarvam AI)
A conversational interface powered by **Sarvam AI** where patients can ask health questions and report symptoms in their native language (Hindi, Tamil, Bengali, etc.). The chatbot responds only in the user's language. A parallel pipeline extracts structured symptom data, prompting for confirmation if severity is 7 or above, or if extraction confidence falls below 70%. At the end of the day, an agent summarizes the entire conversation and logs it in the database.

### Body Heatmap
An SVG human figure (front and back views) divided into anatomical zones. Zone colour is computed from symptom frequency, severity, and a recency decay function — zones fade gradually as symptoms resolve. Smartwatch anomalies contribute to zone scores even when the patient hasn't reported symptoms. Tapping any zone reveals contributing symptoms, timeline, severity trend, and zone Health Index.

### Medicine Tracker & Reminders
Tracks active medications, logs daily adherence, and sends push alerts. If a doctor recommends a medication, it is synced automatically to the patient's reminders. Every added medicine triggers a synchronous OpenFDA interaction check against active medications before saving.

### Jan Aushadhi Calculator
Allows patients to find cheaper generic alternatives for branded prescriptions. It displays generic names, Kendra prices, and calculates monthly/annual savings. The patient can print a **Jan Aushadhi Ready Prescription PDF** to show directly to generic pharmacists.

### Smartwatch Integration & Risk Scoring
Smartwatch data (heart rate, SpO2, sleep, steps) is constantly tracked. The risk agent checks these vitals daily, combining them with symptom histories to run a RAG analysis over clinical guidelines, outputting a risk score out of 100.

### Medical Scan Parser
Allows patients to upload blood test reports or prescription images. The agent extracts data (e.g., lipid profile, glucose), automatically updates missing profile fields (such as weight or blood type), and updates their **Vaccine Report Card** (fully user-editable).

### Family Health & Genetics Tracker
Family members link using QR codes. The agent maintains a genetics track and a similarity checker. If one family member logs a symptom (e.g., loss of taste/smell for COVID) and another reports the same, the agent alerts and posts a family summary: *"2 members have similar issues."* Sensitive conditions (HIV, mental health, STDs, cancer) are strictly filtered at the data layer.

### Appointment Automation
Patients can book appointments with their treating doctor. The agent queries available schedule slots in the doctor's calendar and automatically assigns an open slot based on clinical urgency and risk priority.

---

## Doctor Web Dashboard — Full Overview

The doctor dashboard is built in React 19 with TypeScript, Vite 6, and Tailwind CSS v4. It connects to the same Supabase database and the FastAPI backend for all AI operations.

### Morning Briefing
Generated every night at 11 PM. Lists only patients needing attention, why, and what was flagged overnight — sorted by urgency. Low-risk, no-alert patients are not shown. A doctor understands exactly who needs attention within 5 seconds of opening the dashboard. This is the **One-Look Rule** — the most important design constraint on the dashboard.

### QR Code Patient Entry
Doctors scan a patient's QR code (or family group QR) and the full patient profile loads instantly. Individual QR → full patient record. Family QR → family health overview with sensitive conditions filtered. Complete clinical context in under 3 seconds.

### Patient Analytics Dashboard
Per-patient view showing: 7-day AI summary (symptoms, adherence, wearable anomalies, concerning patterns, AI guidance given), body heatmap with zone flags, risk score trend charts (Recharts), symptom frequency and severity graphs, adherence timeline, wearable data visualisations (heart rate, SpO2, sleep stages, step counts), and the RAG source panel — showing exactly which WHO/ICMR guideline contributed to each risk score adjustment, with the source name, page reference, and adjustment value shown as separate data points, not buried in a final number.

### AI Clinical Assistant
A free-text AI chatbot on the dashboard where doctors ask clinical questions about a specific patient. Every answer is grounded in that patient's actual data only. The response always shows the source data used, the date, and the RAG guideline cited.

### Async Doctor–Patient Q&A Loop
The doctor types a question. The system searches all patient data. If the answer exists → returned immediately. If not → the question is rewritten in conversational language and queued for the patient's next check-in.

### Medicine Management
Full list of all active medications per patient, adherence logs, drug conflict flags with override history, and the affordability engine output. Doctors can add, modify, or flag medications with clinical notes.

### Appointments Section
List of all patients scheduled or flagged for follow-up. The automated appointment agent schedules bookings directly into these slots.

---

## AI Backend — How It Works

The backend runs on FastAPI (Python 3.11) with Groq LLaMA 3.3 70B as the LLM, Sarvam AI for multilingual translation, a LangChain + FAISS RAG pipeline over medical guideline PDFs, Isolation Forest anomaly detection per patient, and Linear Regression trend indicators.

### Daily Agent Workflow (11 PM Scheduled)
Every night, an orchestrator launches a sequence of agents:
1. **Chat Summary Analyzer Agent** reviews daily conversational transcripts.
2. **Medicine Adherence Tracker Agent** checks compliance logs.
3. **Medical Info Change Agent** monitors vitals trends and scanned document updates.
4. **Profile Summarizer Agent** compiles findings into the patient's profile page summary: *"User experiencing headache for three days. Weight is also lost."*

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Patient App | React Native 0.81, Expo 54, TypeScript, Zustand, Expo Router |
| Doctor Dashboard | React 19, TypeScript, Vite 6, Tailwind CSS v4, Recharts |
| AI Backend | FastAPI, Python 3.11, Groq LLaMA 3.3 70B, Sarvam AI |
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
