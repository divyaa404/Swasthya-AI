# 🩻 Medical Scan & Record Analyzer Agent

## Role

The Medical Scan & Record Analyzer Agent processes patient-uploaded medical records, such as blood test reports, lab results, and prescription images. It performs optical character recognition (OCR) and text analysis to structure findings, automatically populating missing metrics in the patient's profile, and populating their digital vaccine report card.

---

## Process & Document Flow

```
   Patient Uploads Document (Image/PDF)
                    │
                    ▼
       FastAPI OCR Parsing Layer
 (Extracts text from blood tests/prescriptions)
                    │
                    ▼
       Groq Extraction Engine
(Extracts structured values, dates, and markers)
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
 Profile Update Logic    Vaccine Report Logic
 (Checks for missing     (Extracts immunisation
  fields: weight,         records and dates)
  blood type, etc.)            │
         │                     ▼
         │             Auto-add to Vaccine Card
         │             (Marked as 'Extracted')
         ▼                     │
Auto-update Profile            ▼
(Saves to Supabase)     Patient Reviews/Edits
```

---

## Key Capabilities

### 1. Auto-Populating Missing Profile Data
- If the patient's profile has empty or uncompleted fields (e.g., weight, blood group, height, age):
- The agent scans uploaded documents for this data (e.g., a blood group card, recent lab test showing weight).
- Upon detection, the agent automatically updates the database fields and marks them as `source: "medical_scan"`.
- It logs a notification on the app dashboard: *"We've updated your blood type to O+ and weight to 72 kg based on your uploaded report."*

### 2. Vaccine Report Extraction
- Scans diagnostic and immunization reports for vaccine history (e.g., COVID-19, Hepatitis B, Influenza, BCG).
- Extracts vaccine name, batch, dosage, and date administered.
- Automatically creates entries in the patient's **Vaccine Report Card** database table.
- **Editable Safeguard**: All parsed vaccine records are marked as "AI-Extracted." The patient can view, edit, delete, or manually add missing vaccines at any time.

---

## Safety Rules

- **Conflicting Values** — If a scanned report lists a profile value (e.g., weight) that is different from an existing value, the agent does not overwrite it silently. It prompts the user: *"We detected a new weight of 68 kg in your report. Would you like to update your current profile weight (70 kg)?"*
- **Privacy Controls** — Scans are processed in memory, and the uploaded file is securely stored in a private Supabase bucket using Row-Level Security (RLS). 
- **Doctor Verification** — Scans containing critical anomalies (e.g., highly elevated liver enzymes) are flagged directly in the doctor's morning briefing.
