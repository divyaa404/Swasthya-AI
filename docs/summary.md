# Swasthya AI — Summary

**Swasthya AI** is a two-sided clinical intelligence platform connecting patients with their doctors through continuous AI-powered monitoring. It is built specifically for Indian healthcare — designed around the real constraints of short consultations, fragmented records, OTC medication risk, and the financial burden of chronic disease.

---

## What It Does

**For patients (mobile app):** Conversational onboarding; multilingual health chat powered by **Sarvam AI** (with daily transcript summarization); daily adaptive check-ins targeting unresolved symptoms; smartwatch tracking with RAG-based risk scoring (0-100); medicine reminders syncing doctor recommendations; Jan Aushadhi generic calculator with printable PDF exports; family QR connection with genetics tracker and household similarity checking; medical scan parsing (image OCR) to auto-populate missing profile slots (weight, blood type) and vaccine cards.

**For doctors (web dashboard):** Nightly morning briefing showing only flagged patients sorted by urgency; QR scan to full patient/family profile in 3 seconds; AI clinical assistant answering clinical questions grounded in patient data; patient analytics with charts and RAG source visibility; medicine management; and automated appointment scheduling queue.

---

## Key Features at a Glance

### Patient App
| Feature | What It Does |
|---|---|
| **Conversational Onboarding** | Replaces forms with natural dialogue to collect chronic conditions, meds, and history |
| **Check-In Agent** | Builds personalized check-ins asking about unresolved symptoms (are you still getting headaches? severity?) |
| **Multilingual Chatbot (Sarvam AI)** | User talks in native language; system translations build structured logs; daily chat summaries are stored |
| **Body Heatmap** | Symptom history mapped to anatomical zones with recency decay |
| **Smartwatch Risk Score** | Constant wearable monitoring + RAG over WHO/ICMR rules to compute risk range out of 100 |
| **Medicine Tracker & Reminders** | Set notifications, sync doctor recommendations; OpenFDA drug conflict checks block unsafe saves |
| **Jan Aushadhi Calculator** | Maps branded meds to generic equivalents; displays price lists, Kendra locations, and exports printable PDFs |
| **Family Genetics Tracker** | Connects family via QR; tracks symptom similarities (e.g. COVID taste/smell loss) and generates alerts |
| **Medical Scan Parser** | Analyzes blood tests or prescription images; auto-completes profile (weight, blood type) & vaccine records |
| **Appointment Automation** | Patient books doctor; agent checks available slots and automatically assigns the user |

### Doctor Dashboard
| Feature | What It Does |
|---|---|
| **Morning Briefing** | AI-generated nightly (11 PM) — only flagged patients shown, sorted by clinical urgency |
| **QR Scanner** | Individual or family QR → full clinical context in under 3 seconds |
| **Patient Analytics** | AI 7-day summary, risk trend charts, adherence, wearable data, body heatmap |
| **RAG Source Visibility** | Risk score shown as: base score + guideline name + section + adjustment value |
| **AI Clinical Assistant** | Free-text questions about any patient, answered from their actual data only |
| **Async Q&A Loop** | Doctor queues questions → patient answers in check-in → doctor notified |
| **Medicine Section** | All patient medications, conflict flags, override management, affordability panel |
| **Appointments Section** | Automated calendar slot assignment and priority scheduling |

---

## How the AI Works (Daily Pipeline & Agents)

- **Daily Workflow Orchestrator (11 PM)**: Runs Chat summary analyzer, Medicine compliance auditor, Vitals/Medical info tracker, and Profile Summarizer to write: *"User experiencing headache for three days. Weight is also lost."*
- **Symptom Extraction Pipeline**: Extracts structured symptom data. Confidence < 70% = clarifying question. Severity ≥ 7 = patient confirmation required before saving.
- **RAG Risk Scoring**: Risk score = deterministic Python base + LLM adjustment (±15 max, WHO/ICMR guideline citation required).
- **Escalation**: Hardcoded Python matrix — LLM only writes the message, never decides the trigger. 8 critical overrides (e.g., sudden unilateral weakness) bypass standard matrix.
- **OpenFDA drug conflicts**: Synchronous API check — blocks save until conflict check completes.
- **Wearable anomalies**: SQI filter → Isolation Forest (per patient) + statistical threshold.
- **Medical Scan OCR**: Extracts text from diagnostic images to populate patient profile gaps (blood type, weight, etc.) and vaccine card tables (user-editable).

---

## Tech Stack

| Layer | Stack |
|---|---|
| Patient App | React Native + Expo + TypeScript |
| Doctor Dashboard | React + TypeScript + Vite + Tailwind CSS |
| AI Backend | FastAPI + Python + Groq LLaMA 3.3 + Sarvam AI |
| RAG | LangChain + FAISS + sentence-transformers |
| Database | Supabase (PostgreSQL + RLS + Realtime) |
| Automation | N8N |
| Wearables | Apple HealthKit + Google Health Connect |

---

## The One-Line Version

**Swasthya AI coordinates continuous patient monitoring, local language interaction, and affordability calculations to make Indian health management proactive and seamless.**
