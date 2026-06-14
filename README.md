# Swasthya AI

A two-sided clinical intelligence platform for continuous patient monitoring and doctor decision support — built for the Indian healthcare context.

## What It Is

Swasthya AI bridges the gap between patients managing chronic conditions and the care they need between visits. Patients log symptoms, take daily AI check-ins, and track medications on a mobile app. Doctors receive AI-generated morning briefings, scan patient QR codes for instant clinical context, and query an AI assistant grounded in each patient's actual health data.

## Stack

**Mobile App** — React Native 0.81, Expo 54, TypeScript, Expo Router, Zustand, Supabase JS, Apple HealthKit / Google Health Connect

**Doctor Dashboard** — React 19, TypeScript, Vite 6, Tailwind CSS v4, Recharts, html5-qrcode, Supabase JS

**Backend** — FastAPI (Python 3.11), Groq LLaMA 3.3 70B, LangChain + FAISS (RAG over medical guidelines), scikit-learn (Isolation Forest + Linear Regression), OpenFDA API, Supabase, N8N automation, Docker

## Core Features

- **AI conversational onboarding** — no forms; multi-turn dialogue collects full health profile
- **Daily adaptive check-ins** — 2–3 personalised questions generated from conditions, symptoms, and last 24h of wearable data
- **Body heatmap** — symptom history mapped to anatomical zones with recency decay
- **Risk score** — deterministic base score + RAG-adjusted by LLM (±15 max, guideline citation required); always shown as a range with confidence band
- **Drug conflict detection** — synchronous OpenFDA check blocks medicine save until complete
- **Wearable anomaly detection** — SQI filter → per-patient Isolation Forest + statistical threshold
- **Deterministic escalation matrix** — 8 critical single-symptom overrides + two-signal combinations; LLM writes the message, never makes the trigger decision
- **Jan Aushadhi PDF** — printable generic medicine reference mapped from branded prescription
- **Government scheme matching** — PM-JAY, RAN, PMJAP, and state schemes matched to patient profile
- **Family health system** — privacy-filtered shared view; sensitive conditions excluded at database query level
- **Morning briefing** — AI-generated nightly; only flagged patients shown, sorted by urgency
- **QR scan entry** — individual or family QR → full clinical context in under 3 seconds
- **Doctor AI assistant** — free-text clinical questions answered from patient data only, with RAG source visibility
- **Async Q&A loop** — doctor queues questions → patient answers in next check-in → doctor notified
- **Appointments section** — clinical priority queue based on health flags, not a calendar
- **Recovery Counter** — objective professional metric; patients recovered under a doctor's care

## Setup

```bash
# Backend
cd backend && pip install -r requirements.txt
# Add backend/.env (GROQ_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
uvicorn main:app --reload

# Mobile App
cd app && npm install
# Add app/.env (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_API_BASE_URL)
npx expo start

# Doctor Dashboard
cd web && npm install
# Add web/.env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL)
npm run dev
```

Place medical guideline PDFs in `backend/rag/guidelines/` — FAISS index builds automatically on first startup.

## Safety Design

All AI outputs are risk indicators, not diagnoses. Escalation logic is a deterministic Python matrix — the LLM cannot override it. Drug conflict detection is a blocking gate. RAG adjustments to risk scores are bounded and require guideline citation. Sensitive conditions (HIV, mental health, cancer, STDs) are filtered at the database query level.

## License

MIT
