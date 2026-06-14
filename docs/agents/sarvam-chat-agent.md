# 💬 Sarvam Chatbot Agent

## Role

The Sarvam Chatbot Agent serves as the conversational entry point for patient symptom reporting and medical queries. Powered by **Sarvam AI**, it is fully multilingual, enabling patients across India to discuss their health concerns in their native tongue. It ensures all conversational exchanges happen in the patient's language of choice, translating where necessary on the backend to log structured findings, and generating empathetic responses in the same language.

---

## Process

1. **Multilingual Input Handling** — The patient inputs a message in their language (e.g., Hindi: *"मुझे तीन दिन से तेज सिरदर्द और कमजोरी हो रही है"*).
2. **Dual-Pipeline Execution**:
   - **Sarvam Translation & Chat Model**: Generates a natural, empathetic response in the user's language (*"यह सुनकर दुख हुआ। क्या आपको सिरदर्द के साथ चक्कर भी आ रहे हैं?"*).
   - **Symptom Extraction Pipeline**: Transcribes and extracts structured clinical entities (symptoms, severity, body zones, duration) into a standardized English JSON schema.
3. **Validation and Storage Check**:
   - If confidence of the extracted symptom is below 70%, triggers a conversational clarifying question rather than saving.
   - If severity is 7 or above, demands explicit user confirmation (e.g., *"You indicated severe pain (8/10). Is that correct?"*) before saving.
4. **Daily Chat Summarization**:
   - At the end of each day, a background agent processes the full chat transcript.
   - It compiles a concise medical summary of what the user talked about during the day.
   - Saves this daily chat summary in the `daily_chat_summaries` table in Supabase.

---

## Multilingual Capabilities (Sarvam AI)

By utilizing Sarvam AI's translation, speech, and language models:
- **Zero-Barrier Dialogue** — Supports English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, and Punjabi.
- **Language Lock** — The agent responds **only** in the language the patient used to message it.
- **Vernacular Nuance** — Understands local terminology for ailments (e.g., *"pet kharab"*, *"sar ghumna"*).

---

## Safety Rules

- **Strict Language Alignment** — Do not switch languages mid-conversation.
- **No Diagnosis** — Explicitly framing answers as symptom support, not clinical diagnoses.
- **Emergency Escalation Hook** — If a critical symptom (like resting chest pain or sudden weakness) is extracted, it hooks into the deterministic Escalation Matrix to display the emergency card immediately.

---

## Input & Output Structure

### Input Message
- Language: Hindi
- Message: *"मेरे छाती में दर्द हो रहा है और सांस लेने में कठिनाई है।"*

### Backend JSON (After Translation & Extraction)
```json
{
  "raw_message_translated": "I have chest pain and difficulty breathing.",
  "extracted_symptoms": [
    {
      "symptom_type": "chest pain",
      "body_zone": "chest",
      "severity": 8,
      "onset": "sudden",
      "duration": "1 hour"
    },
    {
      "symptom_type": "dyspnea",
      "body_zone": "respiratory",
      "severity": 7,
      "onset": "sudden",
      "duration": "1 hour"
    }
  ],
  "extraction_confidence": 0.94,
  "requires_confirmation": true,
  "escalation_triggered": true,
  "response_text_hindi": "आपके छाती में दर्द और सांस लेने में कठिनाई दोनों गंभीर लक्षण हैं। कृपया तुरंत अपने डॉक्टर से संपर्क करें या नजदीकी आपातकालीन कक्ष में जाएं।"
}
```
