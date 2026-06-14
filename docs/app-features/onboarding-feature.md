# 🚀 AI Conversational Onboarding — Patient App Feature

## What It Is

Onboarding is the first interaction a new patient has with Swasthya AI, and it sets the tone for everything that follows. Instead of presenting the patient with a long form, a series of dropdowns, or a medical questionnaire, Swasthya AI conducts a **multi-turn AI conversation** that collects the same structured clinical profile — but in a way that feels like talking to a knowledgeable, friendly assistant.

The goal is to collect a complete health profile in a single session without the patient ever feeling like they are filling out paperwork.

---

## What Is Collected

The onboarding conversation gathers:

| Category | Details Collected |
|---|---|
| Chronic conditions | Condition name, severity, duration, management status |
| Condition detail | e.g. Diabetes → insulin or oral? Which medication? Dosage? Controlled or uncontrolled? |
| Current medications | Name, dosage, frequency, prescribed by whom, how long taking |
| Allergies | Medicine, food, environmental — reaction type and severity |
| Past surgeries | Procedure, year, complications |
| Family history | Conditions in first-degree relatives, their current health status |
| Income category | Categorical (below 2.5L / 2.5–5L / above 5L) for scheme eligibility matching |
| Lifestyle basics | Smoking, alcohol, physical activity level |
| Primary language preference | For follow-up communication |

---

## Conversation Flow

The AI agent handles the conversation dynamically, not through a fixed script. It knows which categories still need to be covered and adapts based on what the patient has already shared.

**Example exchange:**

> *AI:* "Let's start with any ongoing health conditions. Do you have any conditions you manage regularly — like diabetes, blood pressure, thyroid issues, or anything else?"
>
> *Patient:* "Yes, I have diabetes and BP."
>
> *AI:* "Thanks. For your diabetes — are you on insulin injections, or do you take tablets for it?"
>
> *Patient:* "Tablets. Metformin 500mg twice a day."
>
> *AI:* "Got it. And how well controlled is it — has your doctor mentioned your sugar levels are in a good range recently?"
>
> *Patient:* "Mostly okay, last HbA1c was 7.1."
>
> *AI:* "That's useful to note. Now for your blood pressure — are you on any medication for it?"

The agent continues across all categories, asking natural follow-ups where clinically relevant, and moving on when sufficient detail is collected.

---

## Profile Confirmation Card

At the end of the conversation, before anything is saved to Supabase, the AI presents a **structured summary card** listing everything collected:

```
📋 Your Health Profile — Please Review

Conditions:
  • Type 2 Diabetes (Metformin 500mg BD, HbA1c 7.1, mostly controlled)
  • Hypertension (Amlodipine 5mg OD)

Allergies:
  • Penicillin (rash)

Family History:
  • Father: Hypertension, Type 2 Diabetes
  • Mother: No known conditions

Past Surgeries:
  • Appendectomy (2019, no complications)

Income Category: 2.5–5L (for scheme matching)

Does everything look correct? You can tap any section to edit it.
```

The patient can correct any detail before confirming. Only after confirmation is the profile saved.

---

## Inline Edit After Onboarding

If the patient realises something was wrong after saving, the profile screen allows editing of any field. A significant change (adding a new condition, adding a new medication) re-triggers the relevant downstream processes: drug conflict check for new medicines, risk score recalculation, scheme eligibility re-matching.

---

## Technical Notes

- The onboarding agent runs as a multi-turn conversation managed by the `/agent/onboard` endpoint
- Conversation state is maintained in the Zustand chat store on the client and in the `chat_sessions` table on the backend
- The agent uses a structured extraction prompt to parse each patient message into profile fields
- All extractions have a confidence threshold — low-confidence extractions prompt a clarifying question rather than saving an uncertain value
- The entire onboarding typically takes 5–8 minutes and 15–25 message turns

---

## Design Philosophy

The absence of forms is intentional. Forms communicate "you are a patient filling out administrative paperwork." Conversation communicates "we are listening to you." In a healthcare context where patient trust is the foundation of engagement, how the first interaction feels matters as much as what it collects.

The agent is designed to sound warm, not clinical. It uses plain language, asks one thing at a time, and never uses medical abbreviations the patient might not understand.
