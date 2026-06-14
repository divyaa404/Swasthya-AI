# 👨‍👩‍👧‍👦 Family Health System — Patient App Feature

## What It Is

The Family Health System allows multiple patients to form a connected family unit within Swasthya AI. Members of the same family can see a shared, privacy-filtered health overview — giving caregivers and family members situational awareness of each other's health without exposing sensitive personal medical data.

It is designed around a single core tension: **families want to look out for each other, but individuals have an absolute right to medical privacy.** Every design decision in this feature resolves that tension in favour of privacy-first, with sharing only possible through explicit individual consent.

---

## How a Family Group Works

### Creating a Group
Any patient can create a family group. On creation, the backend generates:
- A **unique family QR code** representing the group
- A **short join code** (alphanumeric) for manual entry
- A family group record in Supabase with the creator as admin

### Joining a Group
Other patients join by scanning the family QR or entering the join code. Each new member is added to `family_memberships` with default sharing settings (all sensitive categories OFF).

### Family QR on the Doctor Dashboard
When a doctor scans a **family QR code** (as opposed to an individual patient QR), the dashboard loads the family overview view — showing a privacy-filtered summary of all members. This allows a doctor treating one family member to quickly understand the broader family health context without needing separate logins for each member.

---

## Privacy Architecture

### Sensitive Condition Filter
The filter operates at the **database query level**, not in application logic. This means it cannot be bypassed by a UI change, a frontend bug, or an API call made without going through the app. The following categories are permanently excluded from all family summary views:

- HIV and HIV-related conditions
- Mental health diagnoses (depression, anxiety, bipolar, schizophrenia, etc.)
- Sexually transmitted infections
- Cancer diagnoses

These conditions are tagged at the time they are saved to the patient profile. The `family_summary` query explicitly excludes any record tagged with these categories before data is returned.

### Per-Category Sharing Toggles
Each member has a sharing settings panel with per-category toggles:

| Category | Default |
|---|---|
| Cardiovascular conditions | OFF |
| Diabetes / metabolic conditions | OFF |
| Respiratory conditions | OFF |
| Musculoskeletal conditions | OFF |
| General symptoms | OFF |
| Risk level (anonymised) | OFF |

Every toggle defaults to OFF. The patient must explicitly enable sharing for each category. Changing a toggle immediately updates what is visible to other family members in real time (via Supabase Realtime).

### No PII in Family Summaries
Family summaries never include:
- Names (referred to as "adult member" or "child member")
- Patient IDs
- Specific diagnoses in sensitive categories
- Medication names
- Doctor names or appointment details

What family members can see (if shared):
- Anonymised risk level (Low / Elevated / High) for each member
- Non-sensitive condition tags (e.g. "hypertension", "Type 2 Diabetes")
- Shared symptom patterns (e.g. "two members reported fatigue this week")
- Recovery milestone flags (e.g. "one adult member recently recovered from a flagged episode")

---

## Shared Symptom Pattern Detection

When multiple family members report similar symptoms within the same time window, the system surfaces a **shared pattern alert**:

*"Two members of this family reported fever and body aches in the last 48 hours. This may indicate a common household illness. Consider consulting a doctor if symptoms persist."*

This detection runs server-side and is triggered by the check-in processing pipeline. It is advisory only and follows the same physician-decision framing as all other system outputs.

---

## Family Health Overview Screen (App)

The family screen in the app shows:
- Each family member as a card (anonymous or named, per their sharing settings)
- Their current shared risk level (colour-coded: green / amber / red)
- Shared symptom tag cloud for the past 7 days
- Any active shared pattern alerts
- A "Request to join" card for family members who haven't joined yet (sends an app notification)

---

## Caregiver Mode

A family member can designate another member as a **caregiver**. Caregivers get elevated read permissions — they can see more details (still filtered) and receive a copy of any escalation alert triggered for the patient they are caring for. This is designed for scenarios like: elderly patient living with an adult child who manages their healthcare.

Caregiver status requires:
- Explicit consent from the patient
- A confirmation step in the app
- Can be revoked by the patient at any time

---

## Data Deletion and Family Membership

If a patient deletes their account (DPDPA 2023 compliance), their record is immediately removed from all family summaries. Other family members see their card disappear — no residual data remains. The patient can also leave a family group without deleting their account; their data is immediately removed from the family view but their personal health record is preserved.
