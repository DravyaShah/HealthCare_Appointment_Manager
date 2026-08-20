# 🏥 HealthAI - Next-Generation Clinical Intelligence Platform

HealthAI is an enterprise-grade healthcare management system designed to bridge the gap between patients and medical professionals. By seamlessly integrating **Cloud-based LLMs** and **Privacy-First Local AI**, the platform automates clinical workflows, extracts actionable insights from raw medical data, and provides an intelligent, autonomous patient experience.

## 🎯 Project Overview

In modern healthcare, doctors are overwhelmed with administrative tasks and dense medical histories, while patients often struggle to understand complex clinical jargon. HealthAI solves this by providing:
1. **For Doctors:** An AI-powered research engine and automated patient report summarizations to accelerate clinical decision-making.
2. **For Patients:** A secure digital vault for medical records and a highly intelligent, 100% private local AI assistant capable of answering health queries based on their unique medical history.

## 🌟 Core Capabilities

*   **🔒 Role-Based Access Control (RBAC):** Distinct, secure architectures for Healthcare Providers and Patients, ensuring strict data segregation and privacy compliance.
*   **📄 Automated Clinical Parsing:** A custom data-pipeline that ingests patient-uploaded PDF medical reports, extracts raw text using `PyPDF2`, and structures it for AI analysis.
*   **🧠 Local AI Intelligence (Ollama):** A 100% private, locally-hosted LLM inference engine (utilizing models like `phi3`) that acts as an autonomous health assistant. It securely performs Retrieval-Augmented Generation (RAG) against the patient's medical vault without ever transmitting PII (Personally Identifiable Information) to the cloud.
*   **🌐 Cloud AI Research Engine:** Deep integration with the **Google Gemini GenAI SDK** to aggregate live medical RSS feeds, synthesize dense academic literature, and generate rapid executive summaries for doctors.
*   **✨ Premium User Experience:** A highly responsive, state-of-the-art Single Page Application (SPA) built with React and Tailwind CSS, featuring glassmorphism UI elements, dynamic routing, and seamless state management.

## 🖼️ Platform Showcase

1. **Homepage:** 
<img width="1902" height="954" alt="Screenshot 2026-06-08 181910" src="https://github.com/user-attachments/assets/674c6b3e-9081-4319-b833-3e948481c65f" />

2. **Dashboard:** 
<img width="1916" height="969" alt="Screenshot 2026-06-08 182042" src="https://github.com/user-attachments/assets/425c843e-52bf-4e24-97d7-29552bea7c4e" />

3. **Login Page:** 
<img width="1897" height="946" alt="Screenshot 2026-06-08 182000" src="https://github.com/user-attachments/assets/3d2bbc16-1e07-474b-83ab-7055eb02ce6b" />

4. **AI Assistant Chat:** 
<img width="1916" height="969" alt="Screenshot 2026-06-08 182042" src="https://github.com/user-attachments/assets/e162e24f-a022-47bc-a515-1faf335961a0" />


## 🛠️ Technical Architecture

### Frontend (Client-Side)
*   **Framework:** React 18 (Vite for rapid Hot Module Replacement)
*   **Styling:** Tailwind CSS (Utility-first, responsive design with custom glassmorphism components)
*   **Routing & State:** React Router DOM, React Context API
*   **HTTP Client:** Axios (Configured for JWT authentication interceptors)
*   **Icons:** Lucide React

### Backend (Server-Side)
*   **Framework:** Django & Django REST Framework (DRF)
*   **Database:** SQLite (Development) / PostgreSQL-ready (Production)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Document Processing:** PyPDF2

### AI & Machine Learning Infrastructure
*   **Ollama (Local AI):** Hosts lightweight models (`phi3`) for secure, zero-latency inference and RAG pipelines.
*   **Google Gemini (Cloud AI):** Handles complex reasoning and external data summarization (Clinical Research Engine).

## 🚀 Local Development Setup

Follow these steps to deploy the application locally.

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   [Ollama](https://ollama.com/) installed and running locally.

### 1. Backend Initialization
```bash
# Clone the repository
git clone https://github.com/MYGITACCOUNT-10/AI_Health.git
cd AI_Health/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:** Create a `.env` file in the `backend/config` directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```

**Database Setup:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Initialization
Open a new terminal window:
```bash
cd AI_Health/frontend

# Install dependencies and start the development server
npm install
npm run dev
```

### 3. AI Model Setup
Ensure the Ollama service is running, then pull the required inference model:
```bash
ollama pull phi3
```

---
*Developed as a demonstration of Full-Stack Engineering, AI Integration, and Modern Web Architecture.*
