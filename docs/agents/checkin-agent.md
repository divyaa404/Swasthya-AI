# ✅ Check-In Agent

## Role

The Check-In Agent generates a personalized set of daily check-in questions for the patient. Unlike generic forms, it dynamically constructs a multiple-choice or short Q&A sequence addressing outstanding health issues, medication status, and unresolved symptoms. Its core goal is to obtain specific, structured follow-up metrics on previously reported symptoms without causing survey fatigue.

---

## Process

1. **Retrieve Context** — Gathers:
   - Structured findings from the **Daily Workflow Orchestrator** (e.g., *Headache reported for three days, weight lost*).
   - Unresolved symptoms from the database (resolution status is `ongoing`).
   - Smartwatch vitals anomalies logged during the previous 24 hours.
   - Pending clinical questions queued by the treating physician.
2. **Identify Unresolved Slots** — Locates gaps in recent reports. For instance, if a headache was reported but its severity change, duration, or onset details are incomplete.
3. **Generate Question Sequence** — Creates 2 to 3 targeted questions with multiple-choice options.
   - *Example question*: *"Are you still getting headaches? How long has it been? How severe is the pain on a scale of 1 to 10?"*
4. **Queue Check-In** — Stores the generated Q&A sequence in `pending_checkin_questions` in Supabase.
5. **Render & Collect** — The app presents these questions sequentially. When the patient answers, the agent saves their responses to the structured symptom log, updating status tags and recalculating the risk score.

---

## Question Construction Examples

| Scenario | Generated Check-In Q&A | Input Source |
|---|---|---|
| Persistent Headache | **Q1: Are you still experiencing a headache?**<br>- Yes, still severe<br>- Yes, but milder<br>- No, resolved<br><br>**Q2: How long has it been present?**<br>- Less than 3 days<br>- 3 to 7 days<br>- More than a week | Daily Chat summary: "Severe headache" |
| Smartwatch resting heart rate elevated | **Q1: Did you notice any chest discomfort or heart racing last night?**<br>- Yes, chest pain at rest<br>- Yes, racing heart<br>- No, felt normal | Wearable Anomaly Logger |
| Weight Loss Flagged | **Q1: You've had a minor decrease in body weight. Have you been actively trying to lose weight?**<br>- Yes (diet/exercise)<br>- No (unexplained weight loss) | Medical Info Change Tracker |

---

## Safety Rules

- **Maximum Survey Length** — Constrained to a maximum of 3 questions per daily session to maintain high patient compliance and engagement.
- **Tone & Interrogation Prevention** — Rephrases questions conversationally. The patient should feel cared for, not interrogated.
- **Immediate Escalation Hooks** — If a patient's response to a check-in matches a Tier 1 or Tier 2 escalation trigger (e.g., selecting *"Yes, chest pain at rest"*), the flow halts immediately, and the emergency escalation card is displayed.
- **Expiration** — Stale check-in questions expire after 24 hours and are replaced by the next day's newly generated queue.
