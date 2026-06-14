# 👨‍👩‍👧‍👦 Family Genetics & Similarity Checker Agent

## Role

The Family Genetics & Similarity Checker Agent is responsible for analyzing health data across a linked family unit (linked via QR codes). It detects shared symptom patterns and potential genetic or household health risks, alerting family members while strictly respecting privacy guidelines.

---

## Process & Similarity Logic

1. **Family QR Linkage** — Users link their profiles to a family group by scanning a generated family QR code.
2. **Genetics & Symptom Tracking** — The agent maintains a background log of non-sensitive chronic conditions (e.g., family history of hypertension, diabetes) and daily symptoms.
3. **Similarity Checking**:
   - The agent executes daily cross-checks of symptoms across all members of a family group.
   - It searches for matching symptom clusters within a overlapping 72-hour window.
4. **Triggering Similarity Alerts**:
   - If Member A logs *"loss of taste and smell"* (a common viral symptom like COVID-19).
   - And Member B logs *"loss of taste and smell"* or *"sudden fever and dry cough"*.
   - The agent flags a **Family Similarity Alert**: *"2 members of this family are experiencing similar issues (loss of taste/smell). This may suggest a shared household infection."*
5. **Updating Family Health Summary** — Compiles these findings into the shared Family Dashboard summary.

---

## Privacy Rules & Sensitive Exclusions

The agent is subject to a strict database-level filter to prevent embarrassing or high-stigma medical situations from leaking.

### Excluded from Similarity Analysis & Family Summaries:
- HIV / STDs
- Mental Health conditions (e.g., depression, bipolar)
- Oncology / Cancer diagnoses
- Specific reproductive health records

*No genetic or symptom tracking is run for these categories. They are stripped before the agent's LLM context is constructed.*

### Anonymity of Alerts:
- If sharing toggles are set to strict privacy, the warning message defaults to anonymized formatting: *"2 members have similar issues"* rather than naming the individuals.

---

## Example Scenario: Viral Spread Alert

```
Member A (Mother) logs: "Loss of taste and smell"
                                │
                                ▼
                       Genetics Database
                  (No alerts triggered yet)
                                │
Member B (Son) logs: "Fever and loss of taste" (24h later)
                                │
                                ▼
               Family Similarity Checker Runs
                                │
       Matches "loss of taste" symptom in family group
                                │
                                ▼
                    Family Alert Triggered
        "2 members have similar issues (loss of taste).
         Please monitor symptoms and isolate if needed."
```
