# 🤖 AI Clinical Assistant — Doctor Web Feature

## What It Is

A free-text AI assistant embedded in the doctor dashboard, powered by the Doctor Q&A Agent. Doctors type clinical questions about the currently-open patient and receive answers grounded in that patient's actual health data.

## Access

Available from any patient detail page via the **"Ask AI"** button. Opens a side panel that stays open while the doctor views the rest of the patient's data — allowing cross-reference between the charts and the AI answer.

## How to Use

Type any clinical question in plain language. The assistant has full access to the open patient's:
- Symptom history (90 days)
- Medication list and adherence logs
- Risk score history with RAG breakdowns
- Wearable anomaly flags
- Drug conflict history
- Check-in responses
- Previous doctor questions and patient answers

**Example questions:**
- *"Can I give this patient paracetamol?"* → Checks active medications via OpenFDA, returns interaction result with context
- *"Does this patient show signs of early kidney stress?"* → Reviews symptoms, wearable flags, medication history for relevant patterns
- *"Why did the risk score jump 3 days ago?"* → Traces risk score components for that date

## Response Format

Each response shows:
- **Answer** in clear clinical language
- **Data sources used** — listed with type and date
- **Guideline cited** — if RAG retrieval was used (guideline name + section)
- **Confidence level** — High / Moderate / Low / Not found in data
- **Disclaimer** — *"Grounded in patient data on record. Clinical decisions rest with the treating physician."*

## Queue for Check-In

If the answer is not in the data, a **"Queue for next check-in"** button appears. One click adds the question (rephrased conversationally) to the patient's next check-in. The doctor is notified when answered.

---

# 📷 QR Scanner — Doctor Web Feature

## What It Is

A camera-based QR code scanner built into the dashboard using html5-qrcode. Allows a doctor to scan a patient or family QR code and immediately load the relevant clinical view.

## Two QR Types

### Individual Patient QR
- Generated for each patient at registration
- Scanning loads the full patient detail page with analytics
- Complete clinical context in under 3 seconds

### Family Group QR
- One QR per family unit
- Scanning loads an anonymised family health overview
- All sensitive conditions filtered
- Members shown as "adult member" / "child member"
- Useful when treating one family member and wanting family context

## Usage Flow

1. Doctor opens Scanner page from left sidebar
2. Camera activates, QR reader initialises
3. Doctor holds QR code (from patient's phone or printed card) in front of camera
4. System decodes QR → fetches patient or family data
5. Redirect to appropriate view

## Fallback

If camera is unavailable or permission denied, the doctor can enter the patient ID manually. A search bar is also available to find patients by name or phone number.

---

# 💊 Medicine Section — Doctor Web Feature

## What It Is

A centralised view of all medications across all assigned patients. Designed for a doctor who wants to review medication safety, manage drug conflict overrides, and check affordability options — across their entire patient list, not just one patient at a time.

## Views

### All Medications Table
Columns: Patient name, Medicine name, Dosage, Frequency, Start date, Adherence rate (14-day), Conflict flag status.

Filterable by:
- Patient name
- Medicine name (search)
- Conflict severity (Informational / Caution / Critical)
- Adherence rate below threshold
- Affordability flag (medicines with high Jan Aushadhi savings)

### Conflict Flag Management

All active drug conflict flags across all patients shown in a dedicated section:

| Patient | Drug A | Drug B | Severity | Status | Action |
|---|---|---|---|---|---|
| Arjun S. | Warfarin | Aspirin | Caution | Unreviewed | Override / Dismiss |
| Priya M. | Metformin | Ibuprofen | Informational | Reviewed | View note |

Clicking **Override** opens an inline text field for the clinical note. The note is mandatory for Severity 3 (Do not take without doctor guidance) conflicts. Once submitted, the conflict is marked "Overridden by Dr. [Name] on [Date]" and this is visible in the patient's app.

### Jan Aushadhi Affordability Panel

For any patient whose active medicines have Jan Aushadhi equivalents:
- Shows branded vs generic monthly cost comparison
- Monthly and annual savings per patient
- Option to trigger the Jan Aushadhi PDF generation for the patient
- Downloadable from the dashboard (doctor can print and hand over during consultation)

---

# 📅 Appointments Section — Doctor Web Feature

## What It Is

A structured list of all patients who have been flagged for a follow-up visit, sorted by urgency. It is not a traditional appointment booking calendar — it is a **clinical priority queue** that tells the doctor who needs to come in and why, based on health data rather than a schedule.

## How Patients Appear Here

A patient is added to the appointments list when:
- A Tier 2 escalation recommends a visit within 24–48 hours
- Risk score crosses the High threshold (76+) for 2+ consecutive days
- Doctor manually flags a patient for follow-up from the patient detail page
- A Recovery Confirmation fires (scheduled for a confirmation visit)
- Patient's adherence drops below 60% for 7 consecutive days

## Appointment Card

Each card shows:
- Patient name, age, primary condition
- Urgency level (Immediate / Within 24h / Within 48h / This week)
- Reason for the flag (in plain clinical language, AI-generated)
- Last check-in date and last visit date
- Risk score current range

**Actions:**
- **Notify Patient** — Sends push notification: *"Dr. [Name] would like you to come in. Please call the clinic to book an appointment."*
- **Mark Completed** — Records the visit, prompts for brief note
- **Add Note** — Internal note about the appointment plan
- **Defer** — Snooze the flag for a specified number of days (with reason required)
- **Dismiss** — Remove from list with reason (e.g. "Patient called, condition resolved")

## Priority Sorting

1. Immediate (active escalation)
2. Within 24 hours (Tier 2 Immediate from last 24h)
3. Within 48 hours (Tier 2 Urgent)
4. This week (chronic risk elevation, adherence flag)
5. Recovery confirmation visits

## Integration with Recovery Counter

When a patient visit results in a "Mark Completed" with the doctor noting a recovery outcome, and the patient's risk score is in the low/moderate range, a Recovery Confirmation milestone can be manually triggered from this view — crediting the doctor's Recovery Counter.
