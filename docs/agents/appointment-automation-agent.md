# 📅 Appointment Automation Agent

## Role

The Appointment Automation Agent facilitates frictionless booking between patients and doctors. When a patient requests an appointment with a doctor, the agent queries the doctor's real-time schedule, evaluates the patient's priority based on their clinical risk score, identifies the best available slot, and assigns the slot to the patient automatically.

---

## Scheduling Process

```
   Patient clicks "Book Appointment" in mobile app
                          │
                          ▼
            Retrieve Patient Risk Profile
   (Checks risk score out of 100 & escalation logs)
                          │
                          ▼
        Query Doctor's Calendar Availability
     (Fetches work hours, existing bookings, slots)
                          │
                          ▼
             Determine Urgency Ranking
   - High Risk (>70) ──► Slot Reservation Override
   - Low Risk (<40)  ──► Normal Slot Selection
                          │
                          ▼
          Select Best Available Time Slot
                          │
                          ▼
          Auto-assign Slot & Update Database
   (Write to Supabase appointments table & block slot)
                          │
                          ▼
    Push Notification & App Booking Confirmation Card
```

---

## Technical Flow & Priority Logic

1. **Trigger** — The patient clicks the appointment link on their app or is prompted to book due to an elevated risk score.
2. **Calendar Audit** — The agent reads the doctor's calendar schedule from `doctor_availability` and filters out blocked or previously booked slots.
3. **Clinical Priority Sort** — If there are multiple bookings waiting, patients with a higher risk score are allocated priority slots (e.g., morning slots or urgent overrides).
4. **Auto-Assignment** — Schedules the appointment, books the slot in the database, and issues an OAuth/CalDAV update to the doctor's external calendar if integrated.
5. **Confirmation** — Sends confirmation messages to both the patient's mobile device and the doctor's dashboard panel.

---

## Safety & Scheduling Rules

- **Cancellation and Rescheduling** — If a patient cancels, the slot is immediately released back to the general availability pool.
- **Double Booking Guard** — A database lock ensures that a slot cannot be booked by two concurrent agent requests.
- **Doctor Manual Adjustments** — Doctors can manually block slots, mark appointments as completed, or push reschedule requests, which triggers the agent to recalculate and recommend alternative times.
