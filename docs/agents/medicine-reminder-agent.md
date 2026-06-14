# 💊 Medicine Reminder & Jan Aushadhi Agent

## Role

The Medicine Reminder & Jan Aushadhi Agent is the central agent for managing medications, ensuring patient adherence, validating drug safety, and improving healthcare affordability. It handles daily reminders, automatically syncs doctor prescriptions, checks for drug conflicts, and powers the Jan Aushadhi Generic Medicine Calculator.

---

## Process & Features

### 1. Reminders and Scheduling
- Patients can manually add medications and set alert times.
- The app schedules local notifications and logs adherence entries daily.
- When a doctor prescribes a new medication via the dashboard, it is automatically pushed to the patient's active reminders list.

### 2. Synchronous Drug Conflict Check (OpenFDA)
- Before saving any new medication (whether added by the patient or recommended by the doctor), the agent calls the OpenFDA drug interaction API.
- This is a blocking step. It runs a cross-reference matrix of the proposed medicine against all active medicines in the patient's profile.
- **Conflicts** are categorized by severity:
  - *Informational*: Mild warning, allows saving.
  - *Caution*: Warning prompt, requires confirmation.
  - *Do not take without doctor guidance*: Serious warning. Blocks saving on the patient side. A doctor must log a formal clinical override on the web dashboard to allow it.

### 3. Jan Aushadhi Affordability Engine
- When a patient's risk score crosses the Elevated threshold (or on-demand from the app), the agent audits their active medication list.
- **Generic Substitution Lookup**: It matches each branded medication against the Jan Aushadhi generic database.
- **Cost Calculation**: It extracts name, price, and packaging details, then calculates the monthly and annual cost savings when switching.
- **PDF Generation & Export**: Generates a clean, print-ready PDF mapping:
  `Branded Name + Price` ➔ `Generic Alternate + Price (Kendra Rate)`.
  The patient can print this PDF or show it on their phone at a Jan Aushadhi Kendra to buy low-cost generic equivalents.

---

## Affordability Mapping Examples

| Active Branded Med | Generic Equivalent | Jan Aushadhi Price | Branded Price | Est. Monthly Savings |
|---|---|---|---|---|
| **Lipitor (Atorvastatin 10mg)** | Atorvastatin 10mg | ₹12 (strip of 10) | ₹78 (strip of 10) | ₹198 |
| **Glucophage (Metformin 500mg)** | Metformin 500mg | ₹8 (strip of 10) | ₹32 (strip of 10) | ₹72 |
| **Amlopress (Amlodipine 5mg)** | Amlodipine 5mg | ₹6 (strip of 10) | ₹28 (strip of 10) | ₹66 |

---

## Safety Rules

- **Synchronous OpenFDA Call** — Cannot bypass drug checks. An offline queue is maintained if connectivity is lost, but the medication is marked as "Unverified" and warnings are shown until verified.
- **PDF Disclaimer** — The Jan Aushadhi PDF must prominently display: *"This document is a generic price reference only. Always confirm substitutions with your pharmacist or doctor."*
- **Auto-Sync** — New doctor prescriptions sync immediately. The user receives a push notification: *"Your doctor has added [Medicine] to your daily reminder. tap to confirm scheduling."*
