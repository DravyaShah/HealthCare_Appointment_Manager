# Health AI System Design Document

## 1. System Architecture

Health AI is built on a modern, decoupled client-server architecture:
- **Frontend (Client)**: A React-based Single Page Application (SPA) built with Vite and styled with Tailwind CSS. It communicates with the backend via RESTful APIs.
- **Backend (Server)**: A Django-based application utilizing the Django REST Framework (DRF). It handles business logic, database operations, third-party integrations, and exposes API endpoints.
- **Database**: SQLite (default for development), which stores structured data like Users, Profiles, Appointments, and Prescriptions.
- **Task Queue / Background Jobs**: Celery with Redis as the message broker. Used for asynchronous tasks like sending emails and syncing Google Calendar events without blocking the main API response.
- **AI Engine**: Google's Gemini LLM (gemini-2.5-flash) is integrated for analyzing symptoms, generating clinical summaries, providing health insights, and analyzing medical news.

## 2. Core Modules & Data Models

### Accounts Module
- **User Model**: Extends `AbstractUser` with custom roles (`patient`, `doctor`, `admin`).
- **Authentication**: Handled via `djangorestframework-simplejwt` for secure, stateless access using access and refresh tokens.

### Appointments Module
- **Appointment Model**: Links `PatientProfile` and `DoctorProfile`. Contains fields for scheduling (`appointment_date`, `status`, `google_event_id`) and clinical data (`symptoms`, `urgency_level`, `pre_visit_summary`, `post_visit_notes`, `post_visit_summary`).
- **DoctorLeave Model**: Tracks doctor unavailability to prevent scheduling conflicts.

### AI Engine Module
- **Gemini Service**: Handles all interactions with the LLM API. 
  - Generates pre-visit summaries from patient symptoms (identifying urgency and chief complaints).
  - Generates patient-friendly post-visit summaries from doctor's clinical notes.

### Prescriptions Module
- **Medication Model**: Stores details of prescribed drugs, dosages, and durations.

## 3. Key Workflows

### Appointment Booking Flow
1. **Patient Request**: Patient selects a doctor and submits an appointment request with symptoms and a preferred time.
2. **Conflict Checking**: The API validates that the doctor is not on leave and that the requested slot does not overlap with existing appointments.
3. **AI Pre-visit Analysis**: The `gemini_service` synchronously processes the provided symptoms to generate an urgency level and a concise summary for the doctor.
4. **Database Commit**: The appointment is saved with the AI-generated context.
5. **Background Tasks (Celery)**:
   - A task is triggered to sync the appointment with Google Calendar, inviting both the patient and the doctor.
   - An email service sends a confirmation email to the patient.

### Post-Visit Summary Flow
1. **Doctor Input**: After an appointment, the doctor submits clinical notes via the dashboard.
2. **AI Post-visit Analysis**: The `gemini_service` translates complex clinical jargon into a patient-friendly summary, including medication schedules and follow-up steps.
3. **Record Update**: The appointment record is updated with these summaries, making them immediately accessible to the patient via their dashboard.

## 4. Integration Strategies

### Google Calendar API
- Utilizes service accounts for server-to-server authentication.
- Events are created dynamically, respecting the individual doctor's `slot_duration_minutes`.
- Celery handles retries in case of transient Google API failures, ensuring eventual consistency between the database and the calendar.

### Email Service (SMTP)
- Django's built-in `EmailBackend` is configured for SMTP (e.g., Gmail).
- Functions abstract the creation of templates for booking confirmations, cancellations, and reminders.

## 5. Security & Error Handling
- **Authorization**: API views enforce role-based access control (e.g., only patients can book, only doctors can add clinical notes).
- **Graceful Degradation**: If the Gemini API fails, the system catches the exception and returns a structured fallback response, allowing the core scheduling flow to succeed even if AI features are temporarily down.
- **Environment Variables**: Sensitive data (API keys, database credentials, email passwords) are loaded via `python-decouple`, ensuring they are kept out of source control.
