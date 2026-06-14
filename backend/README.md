# Swasthya AI Backend — MVP Production Ready

This is the refactored, lightweight MVP backend for Swasthya AI. It focuses solely on User Authentication, Registration, Profile, and Medical Information management. It has been stripped of heavy AI/ML libraries to ensure extremely fast, resource-friendly, and reliable deployments on cloud environments like **Render**.

---

## 🛠️ Local Development Setup

To run this backend locally:

### 1. Create and Activate Virtual Environment
Open your terminal in the `backend/` directory:

#### Windows (Command Prompt / PowerShell):
```bash
python -m venv venv
venv\Scripts\activate
```

#### macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend/` directory based on `.env.example`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 4. Start the Server
```bash
uvicorn main:app --reload
```
The server will start on `http://localhost:8000`. You can view the API interactive docs at `http://localhost:8000/docs`.

---

## 🚀 Production Deployment on Render

This project contains a `Dockerfile` optimized for Render web service deployments.

### Steps to Deploy:
1. Push your repository to **GitHub**.
2. Log in to the [Render Dashboard](https://dashboard.render.com) and click **New -> Web Service**.
3. Select your repository.
4. Configure the settings:
   - **Name**: `swasthya-ai-backend` (or your preferred name)
   - **Environment**: `Docker`
   - **Root Directory**: `backend` (or leave blank and set build context to `backend/`)
5. Under **Environment Variables**, add the following credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
6. Click **Deploy Web Service**. Render will build the container and deploy it, exposing a public HTTPS URL (e.g., `https://swasthya-ai-backend.onrender.com`).

---

## 🔒 API Documentation & Authentication Middleware

All endpoints under `/api/profile/*` are protected and require a valid Supabase JWT token passed via the `Authorization` header:

```http
Authorization: Bearer <your-supabase-jwt-token>
```

### Endpoints

#### Health Check
- **GET** `/health`
- **Response**: `{"status": "ok"}`

#### Current User Profile
- **GET** `/api/profile/me`
- **Response**:
  ```json
  {
    "id": "be5b5671-3112-436c-acdf-0eb7cb6e5efe",
    "email": "user@example.com",
    "full_name": "Rahul Kumar",
    "phone": "9912345678"
  }
  ```

#### Update User Profile
- **PUT** `/api/profile`
- **Payload**:
  ```json
  {
    "full_name": "Rahul Kumar",
    "phone": "9912345678",
    "age": 24,
    "gender": "Male"
  }
  ```

#### Get Medical Information
- **GET** `/api/profile/medical`
- **Response**: Returns the medical details for the authenticated user.

#### Update Medical Information
- **PUT** `/api/profile/medical`
- **Payload**:
  ```json
  {
    "weight": "70kg",
    "height": "175cm",
    "blood_type": "O+",
    "allergies": "Peanuts",
    "blood_pressure": "120/80",
    "heart_rate": "72",
    "oxygen_level": "98%",
    "surgeries": "None",
    "chronic_conditions": "None",
    "vaccinations": "BCG, Covid-19",
    "family_genetics": "None"
  }
  ```
- *Note: This endpoint performs an **upsert with on-conflict resolution on `patient_id`** to prevent duplicate key errors.*

#### Verify Token (Utility)
- **GET** `/api/auth/verify-token`
- **Response**: Returns details of the verified user from the token.
