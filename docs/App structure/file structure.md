# Swasthya AI - App File Structure

This document describes the key folders and files in the Swasthya AI application, outlining their purpose and relationship in the simplified project architecture.

---

## 📁 Root Folders

*   **`app/`**: The core React Native Expo application workspace.
*   **`backend/`**: Python-based backend service layer hosting REST endpoints and Neo4j graph integrations.
*   **`docs/`**: Project documentation and structure logs.

---

## 📁 Expo App Structure (`app/app/`)

The mobile application routing system is powered by **Expo Router**, grouping screens into logical user flows using group folders:

### 1. Root Files
*   **[`_layout.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/_layout.tsx)**: The main application entry layout. Hydrates user sessions, manages custom Poppins fonts, configures the status bar, and listens for Google OAuth deep link redirects.
*   **[`index.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/index.tsx)**: Routing gateway screen. Directs the user to the correct stage based on their current auth and onboarding completion state.

### 2. Authentication Flow Group (`(auth)/`)
Handles user identity verification and welcome landing.
*   **[`_layout.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(auth)/_layout.tsx)**: Router Stack layout for authentication screens.
*   **[`welcome.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(auth)/welcome.tsx)**: Interactive landing pages explaining app features like AI health advisor, family care tracking, generic alternatives, and risk warnings.
*   **[`login.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(auth)/login.tsx)**: Dual-purpose login and signup card supporting email/password and Google Sign-In via Supabase.
*   **[`callback.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(auth)/callback.tsx)**: Handler callback page that catches external auth state redirects.

### 3. Onboarding Flow Group (`(onboarding)/`)
Collects family details and patient baseline metrics.
*   **[`_layout.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(onboarding)/_layout.tsx)**: Router Stack layout for onboarding screens.
*   **[`family-setup.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(onboarding)/family-setup.tsx)**: Screen that enables patients to either establish a new family circle or input a code (or scan QR code) to join an existing group.
*   **[`chat.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(onboarding)/chat.tsx)**: Interactive guided chatbot setup that asks user for age, gender, height, weight, blood group, allergies, medications, chronic conditions, surgeries, and vaccinations, with suggestion chips and skip choices.
*   **[`summary.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(onboarding)/summary.tsx)**: Final confirmation screen listing collected profile, family, and vitals details. Pressing "Launch Swasthya AI" commits records to the database and opens the home dashboard.

### 4. Main Dashboard Group (`(tabs)/`)
Provides custom tab-bar navigation for the primary app features.
*   **[`_layout.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(tabs)/_layout.tsx)**: Custom bottom navigation bar configuration rendering 4 tabs (Home, Check-ins, Meds, Profile) plus a floating center button pointing to the health Chatbot.
*   **[`index.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(tabs)/index.tsx)**: Simple redirect pushing tabs root to the Home screen.
*   **[`home/index.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(tabs)/home/index.tsx)**: Primary dashboard displaying overall vitals summary, generic medicine savings stats, warning highlights, and AI-predicted risk profiles.
*   **[`checkin/index.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(tabs)/checkin/index.tsx)**: Section for tracking daily symptoms, severity, and heart rate, which triggers clinical Neo4j storage.
*   **[`chatbot/index.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(tabs)/chatbot/index.tsx)**: General medical query AI chatbot that updates the user with a session summary of logged symptoms after several turns.
*   **[`meds/index.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(tabs)/meds/index.tsx)**: Prescription and pill tracker showing dosage timings and savings details.
*   **[`profile/index.tsx`](file:///D:/college/PROJECTS/Swasthya-AI/app/app/(tabs)/profile/index.tsx)**: Patient profile settings, database synchronization status, and secure sign-out.

---

## 📁 Shareable Modules (`app/components/`)

Shared components are organized under specific directories matching the main app areas:
*   **`shared/`**: Common layout blocks like `ScreenWrapper`.
*   **`ui/`**: Base UI elements such as inputs, buttons, and page loaders (`Loader.tsx`).
*   **`chatbot/`**: Message bubbles, header layouts, and input blocks for the conversational assistant.
*   **`home/`**: Components for displaying vitals cards, charts, and recommendations.
*   **`checkin/`**: Components for symptom tracking and reporting.

---

## 📁 Shared Utilities & State (`app/services/` & `app/store/`)

*   **`services/`**: Client modules communicating with external platforms:
    *   `auth.service.ts`: Integrates Supabase sign-up, sign-in, and family management database queries.
    *   `backend.service.ts`: Calls Python REST API endpoints (e.g. daily summaries, scheme matching, risk prediction).
*   **`store/`**: Global state containers powered by Zustand:
    *   `auth.store.ts`: Retains session flags, patient IDs, profile status, and onboarding states.
