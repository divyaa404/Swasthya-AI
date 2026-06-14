# 💊 Medicine Tracker & Drug Conflict Detection — Patient App Feature

## What It Is

The Medicine Tracker is the patient's complete medication management system within Swasthya AI. It tracks active medications, logs daily adherence, detects drug interactions before they can harm, surfaces affordability options, and generates a Jan Aushadhi Ready Prescription PDF for patients who want to switch to generic medicines.

The defining characteristic of this feature is that **drug conflict detection is a blocking gate, not an advisory warning.** A new medicine cannot be saved to the patient's record until the interaction check completes and the patient (or doctor) consciously acts on the result. This is not a popup that can be dismissed and ignored.

---

## Adding a New Medicine

When a patient adds a new medicine:

```
Patient enters medicine name
        │
        ▼
OpenFDA API called synchronously
(new medicine × all active medications)
        │
   ┌────┴────────────────────────────┐
   ▼                                 ▼
No conflicts found              Conflict detected
        │                            │
   Medicine saved                    ▼
                              Show conflict card:
                              - Which medicines interact
                              - Interaction type
                              - Severity level
                              - Plain-language explanation
                                     │
                              ┌──────┴──────────────┐
                              ▼                     ▼
                         Patient           Patient acknowledges
                         cancels           + doctor override
                              │            required to save
                         Medicine          Flag permanently
                         not saved         recorded
```

### Conflict Severity Levels

| Level | Label | What It Means |
|---|---|---|
| 1 | Informational | Mild interaction; monitor but no immediate risk |
| 2 | Caution | Moderate interaction; doctor should be aware |
| 3 | Do not take without doctor guidance | Potentially serious; cannot save without doctor override |

Doctor override requires the doctor to add a clinical note via the dashboard explaining why the benefit outweighs the risk. The flag and the override note are permanently part of the patient's medication record.

---

## Adherence Tracking

Every day, each active medication generates a pending adherence entry. The patient marks each medicine as taken or missed. The app can be configured to send a reminder notification at a set time per medicine.

### Adherence Log Structure

| Field | Description |
|---|---|
| `patient_id` | Patient reference |
| `medication_id` | Specific medicine |
| `date` | Calendar date |
| `taken` | Boolean |
| `taken_at` | Timestamp (if taken) |
| `missed_reason` | Optional free text |

### Adherence Rate Calculation

Adherence rate = (taken doses / scheduled doses) × 100, calculated over rolling 14-day window.

Adherence rate below **80%** triggers a flag in the doctor's morning briefing. Below **60%** triggers a proactive check-in question: *"We noticed you've missed several doses of [medicine] — is there a reason? Are you experiencing any side effects?"*

---

## Medicine List View

The medicine screen shows:
- All active medications with dosage and frequency
- Today's adherence status for each (taken / pending / missed)
- Streak indicator (consecutive days taken)
- Any active conflict flags (shown with amber or red badge)
- A history button showing the last 30-day adherence timeline per medicine

---

## Medicine Affordability Engine

Triggered automatically when the patient's risk score crosses the Elevated threshold (56+). Also accessible manually from any medicine card.

### What It Does

1. Reads all active medications from the patient's record
2. Calls the Jan Aushadhi price database for each branded medicine
3. Calculates:
   - Current monthly cost (branded)
   - Jan Aushadhi monthly cost (generic equivalent)
   - Monthly savings
   - Annual savings
4. Shows the nearest Jan Aushadhi Kendra (using patient location)
5. Checks government scheme eligibility for medicine coverage

### Jan Aushadhi Ready Prescription PDF

A downloadable, printable PDF that maps each branded medicine to its generic equivalent. Designed to be shown directly to a pharmacist at a Jan Aushadhi store.

The PDF includes:
- Patient's condition tags (non-sensitive)
- Each branded medicine name → generic equivalent name
- Dosage and frequency for each
- A clear header: *"Generic Medicine Reference — Not a Medical Prescription"*
- Swasthya AI branding and generation date

**PDF design principles:**
- Printable in black and white (many patients use basic printers or print at a shop)
- Large, readable font (minimum 12pt for medicine names)
- Clear visual separation between each medicine entry
- Prominent disclaimer at top and bottom
- QR code linking to the Jan Aushadhi store locator

---

## Government Scheme Eligibility Panel

Shown alongside the affordability engine. Matches the patient to:

| Scheme | Coverage |
|---|---|
| PM-JAY (Ayushman Bharat) | Hospitalisation up to ₹5 lakh/year |
| Rashtriya Arogya Nidhi | Catastrophic illness support |
| PMJAP | BPL patients with life-threatening conditions |
| State schemes | Matched by patient's registered state |

Each scheme card shows:
- Conditions covered
- Age and income eligibility requirements
- Coverage amount
- Documents required
- Nearest empanelled hospital (based on patient location)
- Direct link to scheme application portal

---

## Integration with Risk Score

Medication adherence rate feeds directly into the deterministic risk score base calculation. A patient who is consistently non-adherent to their hypertension medications will see their risk score reflect this — giving the doctor a data-backed conversation point at the next visit.

Drug conflict flags also contribute a fixed penalty to the risk score until the conflict is resolved (either by removing the offending medicine or by a doctor override with clinical note).
