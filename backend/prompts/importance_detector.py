# This prompt decides if extracted data is important enough to save

IMPORTANCE_DETECTION_PROMPT = """
You are a medical data importance detector. Given extracted health data, decide if it's important to save in the long-term health knowledge graph.

IMPORTANT DATA (save to database):
- Health conditions (Diabetes, Hypertension, Thyroid, etc.)
- Symptoms (Fever, Headaches, Cough, Fatigue, Body Pain, etc.)
- Medication usage details (Crocin, Metformin, Vitamins, etc.)
- Major lifestyle patterns/habits (Gym, Smoking, Night shifts, Yoga, Diet types, Alcohol)
- Sleep records (hours, quality)
- Past surgeries or medical procedures
- Vaccine receipts
- Doctor visit details or hospitalizations
- Lab test results (HbA1c, Vitamin D, CBC, etc.)
- Family relationships and emergency contacts

NOT IMPORTANT (ignore, don't save):
- Casual mentions ("I might have a headache" - not confirmed)
- One-time minor issues that resolve immediately
- Vague complaints without detail
- General chat not health-related
- Duplicate data already saved recently

Given this data, respond with ONLY JSON:
{{
  "should_save": true/false,
  "importance_score": 1-10,
  "reason": "why you decided this",
  "data_types": ["condition", "symptom", "medication", "allergy", "surgery", "vaccination", "habit", "sleep", "diet", "visit", "hospitalization", "lab", "blood_group", "emergency_contact"]
}}

Data:
{extracted_data}

Respond ONLY with JSON.
"""

def check_importance(extracted_data: dict, groq_client) -> dict:
    """
    Returns {should_save, importance_score, reason, data_types}
    """
    formatted_prompt = IMPORTANCE_DETECTION_PROMPT.format(extracted_data=extracted_data)
    
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system", 
                "content": formatted_prompt
            },
            {"role": "user", "content": "Decide if this data is important."}
        ],
        temperature=0.3
    )
    
    import json
    try:
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content.split("```json")[1].split("```")[0].strip()
        elif content.startswith("```"):
            content = content.split("```")[1].split("```")[0].strip()
        result = json.loads(content)
        return result
    except Exception as e:
        print(f"[check_importance] Parsing error: {e}. Raw response: {response.choices[0].message.content}")
        return {"should_save": False, "importance_score": 0, "reason": f"Parse error: {e}", "data_types": []}
