# 🗺️ Body Heatmap — Patient App Feature

## What It Is

The Body Heatmap is a visual representation of the patient's symptom history mapped onto an anatomical SVG figure. It gives patients — and by extension, doctors reviewing a QR-scanned profile — an immediate spatial and temporal understanding of where the patient has been experiencing problems, how severe those problems have been, and whether they are improving or worsening.

It is the fastest possible way to communicate "where does it hurt, for how long, and how badly" without the patient having to repeat their history every visit.

---

## Visual Design

The heatmap renders an SVG human figure in two views:
- **Front view** — head, face, neck, chest, abdomen, arms, hands, legs, feet
- **Back view** — back of head, neck, upper back, lower back, gluteal region, back of legs

The figure is divided into **anatomical zones**, each assigned a colour based on a computed zone score:

| Colour | Zone Score | Meaning |
|---|---|---|
| 🟢 Green | 0–25 | No recent or significant symptoms |
| 🟡 Yellow | 26–50 | Mild or resolving symptoms |
| 🟠 Orange | 51–75 | Moderate or recent symptoms |
| 🔴 Red | 76–100 | Severe or active symptoms |

---

## Zone Score Calculation

Each zone's score is computed from three inputs:

### 1. Symptom Severity
The raw severity (1–10) reported for each symptom in this zone, averaged across all active symptoms.

### 2. Symptom Frequency
How many distinct symptom events have been logged in this zone over the past 30 days. Higher frequency pushes the score up.

### 3. Recency Decay Function
Symptoms fade over time. A symptom reported today contributes its full weight. A symptom from 14 days ago contributes approximately half its weight. A symptom from 30 days ago contributes near zero. This prevents old, resolved symptoms from permanently colouring a zone red.

The decay function is:

```
weight = severity × e^(−decay_rate × days_since_report)
```

Where `decay_rate` is calibrated per condition type — a cardiac symptom decays more slowly than a headache, because recurrence of cardiac symptoms carries more clinical significance.

### 4. Wearable Anomaly Contribution
Wearable anomalies (validated by SQI) contribute to zone scores even when the patient has not reported a symptom. A heart rate anomaly raises the chest zone score. A sleep anomaly raises a general "fatigue" indicator. This means the heatmap reflects the complete picture — not just what the patient chose to report.

---

## Zone Detail View

Tapping any zone opens a detail panel showing:

- **Contributing symptoms** — list of all symptoms logged in this zone with date, severity, and current status (ongoing / resolved)
- **Timeline** — a mini chart showing severity over the past 30 days for this zone
- **Severity trend** — directional indicator (improving / stable / worsening) based on linear regression over the past 7 days
- **Zone Health Index** — a single composite score (0–100) summarising the zone's current state, shown as a progress bar

---

## Doctor View

When a doctor scans a patient QR and the full profile loads, the body heatmap is shown prominently in the patient overview. The doctor sees the same colour-coded figure the patient sees — but with additional clinical detail:

- Symptom names use clinical terminology (not lay descriptions)
- Wearable anomaly contributions are shown separately from patient-reported symptoms
- Zone detail view shows the raw extraction confidence for each symptom
- A "new since last visit" badge highlights zones that changed since the patient's last appointment

This gives the doctor a complete symptom geography in under 5 seconds — before the patient has said a word.

---

## Recency Decay in Practice

**Scenario:** A patient had severe chest pain (severity 8) three weeks ago, which was investigated and resolved. They now have mild knee pain (severity 3) reported yesterday.

**Without decay:** The chest zone would show red, misleading the doctor into thinking the chest problem is still active.

**With decay:** The chest zone has faded to yellow-green (the old severe symptom is now low-weighted). The knee zone shows light orange (recent, moderate). The heatmap accurately reflects the current state.

---

## Technical Notes

- SVG is built with React Native Skia for smooth rendering and tap gesture handling on mobile
- Zone boundaries are defined as SVG path regions with named IDs matching the Supabase symptom zone taxonomy
- Score recalculation runs on every new symptom save, every wearable anomaly flag, and every check-in submission
- The heatmap state is persisted in Supabase; the app loads the pre-computed score on launch without needing to re-run calculations client-side
