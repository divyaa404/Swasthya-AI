# ⌚ Wearable Integration & Signal Quality Index — Patient App Feature

## What It Is

Swasthya AI integrates with consumer wearables — Apple Watch via HealthKit and Android wearables via Google Health Connect — to bring passive, continuous health monitoring into the risk assessment pipeline. The platform reads heart rate, SpO2, step count, and sleep data and processes it through a Signal Quality Index (SQI) filter and a per-patient anomaly detection model before any reading influences a risk score or triggers an alert.

The fundamental design principle: **bad sensor data is worse than no data.** A false anomaly is more dangerous than a missed one, because it erodes trust and triggers unnecessary escalations. Every wearable reading is guilty until proven valid.

---

## Supported Data Types

| Data Type | Source | Frequency |
|---|---|---|
| Heart Rate (resting, active, overnight) | HealthKit / Health Connect | Continuous / per-minute |
| SpO2 (blood oxygen saturation) | HealthKit / Health Connect | Periodic |
| Step Count | HealthKit / Health Connect | Daily total + intraday |
| Sleep Duration & Stages | HealthKit / Health Connect | Nightly |
| Sleep Interruptions | HealthKit / Health Connect | Nightly |

---

## Signal Quality Index (SQI)

Before any wearable reading enters any calculation, SQI runs a validity filter. Readings that fail SQI are excluded from all downstream processing and flagged in the database with reason.

### SQI Rejection Rules

| Reading | Rejection Condition |
|---|---|
| Heart Rate | HR = 0, or HR > 200 with no corresponding accelerometer movement |
| SpO2 | SpO2 < 70% (physiologically incompatible with consciousness) |
| Steps | Daily step count > 80,000 (physically impossible for most patients) |
| Sleep | Sleep duration > 18 hours in a 24-hour period |
| HR Spike | Instantaneous HR jump > 80 bpm in under 5 seconds without movement context |

When a reading is rejected, it is logged as:
```
Reading excluded — sensor data quality insufficient (reason: [SQI rule])
```

Rejected readings are visible to the doctor in the patient analytics view as excluded data points — not hidden. The doctor can see that data was attempted but filtered, which is more informative than seeing no data at all.

---

## Personal Baseline Calibration

Anomaly detection does not use population averages. A resting HR of 80 bpm might be elevated for one patient and perfectly normal for another.

**First 7 days** of wearable data establish the patient's Personal Baseline:
- Mean resting HR
- Mean overnight SpO2
- Typical sleep duration range
- Typical daily step count range

After 7 days, anomaly detection uses:
```
Anomaly threshold = personal_mean + (1.5 × personal_std_deviation)
```

This means the system learns each patient's normal before it starts flagging deviations from it. A patient who naturally runs a high resting HR won't trigger endless false alerts.

The baseline is recalculated monthly on a rolling 30-day window to account for seasonal activity changes, age-related shifts, and medication effects.

---

## Anomaly Detection Model

Two methods run in parallel for each reading:

### 1. Isolation Forest (ML Model)
A per-patient Isolation Forest model (scikit-learn) is trained on that patient's historical wearable data. It learns the normal multivariate pattern of HR + SpO2 + steps + sleep together — not each in isolation. An anomaly is detected when the combination of values is unusual even if no single value breaches a threshold.

A new `.joblib` model file is saved per patient in `backend/ml/saved_models/`. The model is retrained periodically as more data accumulates.

### 2. Statistical Threshold Check
Simultaneously, a statistical check compares the reading against the personal baseline (mean ± 1.5 standard deviations). This is faster and more interpretable than the ML model.

**An anomaly is flagged when either method fires.** This prioritises sensitivity — it is better to surface a potential issue and let the doctor dismiss it than to miss a real signal.

---

## What Happens After an Anomaly Is Detected

```
SQI-validated anomaly detected
        │
        ▼
anomaly_detected = true → saved to anomaly_flags table
        │
        ▼
Body heatmap zone score updated (relevant zone)
        │
        ▼
Risk score recalculated (anomaly contributes to base score)
        │
        ▼
Event-triggered check-in generated:
"Your smartwatch detected something unusual last night.
 Did you experience [relevant symptom]?"
        │
        ▼
If combined with patient-reported symptom → escalation matrix checked
        │
        ▼
If critical override list triggered → immediate doctor notification via N8N
```

---

## Wearable Simulator (Demo / Testing)

For patients without a supported wearable, or for demo and testing purposes, the app includes a **Wearable Simulator** component. This generates realistic synthetic wearable readings with configurable anomaly injection. It is clearly labelled in the UI as simulated data and is designed for:

- Development and testing without real wearable hardware
- Demo presentations
- Patients who want to explore the app's wearable features before pairing a device

Simulated readings are tagged in the database with `source: "simulator"` and are treated identically to real readings by all downstream pipelines.

---

## Doctor View of Wearable Data

The doctor dashboard analytics panel shows per-patient:
- HR trend chart (7-day, with anomaly points highlighted in red)
- SpO2 readings (7-day, with SQI-rejected readings shown as grey)
- Sleep duration chart (7-day)
- Step count chart (7-day, with daily average line)
- Anomaly flags timeline — each flagged event shown with the detection method that fired (Isolation Forest / Statistical / Both)
- Personal baseline reference lines overlaid on each chart so the doctor can see what "normal" looks like for this specific patient
