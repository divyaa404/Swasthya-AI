# 🧭 Onboarding Agent

## Role

The Onboarding Agent is responsible for conducting a multi-turn, conversational health profile collection with new patients. It replaces traditional registration forms with a natural dialogue to gather structured medical and personal background data before the patient begins using the app.

---

## Process

1. **Initial Greeting & Language Choice** — Greets the user and establishes their preferred language (English, Hindi, etc.).
2. **Interactive Conversation Flow** — The agent collects profile details step-by-step. Rather than asking a long list of questions, it asks one thing at a time and creates logical follow-ups (e.g., if a user reports "diabetes", the agent asks if it is Type 1 or Type 2, whether they take insulin or oral pills, what the medication name is, and the dosage).
3. **Drafting the Profile** — Gathers information in the background and populates a temporary profile state.
4. **Mandatory Profile Confirmation Card** — At the end of the conversation, the agent renders a structured profile review card. The user must review, make any necessary manual corrections, and tap "Confirm" before any data is officially written to Supabase.

---

## Categories Covered

- **Chronic Conditions** — Hypertension, Diabetes (Type 1/2), Asthma, Thyroid, Kidney disease, etc.
- **Current Medications** — Active prescriptions, dosages, frequencies.
- **Allergies** — Drug allergies, food allergies, environmental allergies.
- **Past Medical History** — Surgeries, hospitalisations, significant past illnesses.
- **Family Medical History** — Hereditary conditions (diabetes, cardiac history, etc.).
- **Demographics & Lifestyle** — Age, state of residence, income category (crucial for Government scheme matching), sleep patterns, smoking/drinking status.
- **Language Preference** — Primary spoken and written language.

---

## Safety Rules

- **PII and Consent** — Consent must be explicitly logged at onboarding in compliance with the Digital Personal Data Protection Act (DPDPA) 2023.
- **Extraction Confidence Threshold** — If the conversational extraction confidence falls below **70%**, the agent does not save the slot. Instead, it generates a clarifying question (e.g., *"Did you mean Metformin 500mg or something else?"*).
- **Medication Verification** — Never saves ambiguous or unverified medication names.
- **Mandatory Confirmation** — The final profile confirmation step cannot be bypassed. No data is persistent until confirmed by the user.

---

## Input & Output Structure

### Input Context
- User raw chat messages
- Current category progress flag (e.g., `current_category: "medications"`)

### Output JSON
```json
{
  "extracted_slots": {
    "chronic_conditions": [
      {
        "condition": "Type 2 Diabetes",
        "duration": "2 years",
        "notes": "managed with oral medication"
      }
    ],
    "medications": [
      {
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "BD"
      }
    ]
  },
  "confidence": 0.88,
  "next_category_to_prompt": "allergies",
  "reply_text": "Thank you for confirming your medications. Do you have any known drug or food allergies?"
}
```
