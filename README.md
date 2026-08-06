# UZIMA — Maternal Health Tracking System

## About UZIMA

UZIMA is an offline-first maternal health tracking system designed for rural Rwanda. Its mission is to reduce preventable maternal and child mortality caused by missed antenatal care (ANC) visits, by equipping Community Health Workers (CHWs) with a digital tool to register pregnant women, automatically calculate their WHO-recommended visit schedule, log visit outcomes and danger signs, and give nurses and district health officers real-time visibility into the health status of their catchment areas.

Rural Rwanda faces a specific, documented problem: CHWs currently track pregnant women using paper records, with no systematic way to detect a missed visit or flag a woman showing danger signs before it becomes an emergency. UZIMA replaces this paper process with a mobile app that works with zero internet connectivity, a backend that automatically applies WHO's antenatal care guidelines, and a web dashboard that gives health facility staff an aggregate, real-time view of the women under their care.

### The Four Actors

- **Community Health Worker (CHW)**: uses the mobile app, offline, to register pregnant women and log visit outcomes in the field
- **Mother/Patient**: does not use any app directly; receives SMS reminders (planned, not yet implemented)
- **Nurse**: uses the web dashboard to monitor patients in her catchment area, view flagged high-risk cases, and add notes
- **District Health Officer**: uses the web dashboard to view aggregate, village-level attendance and risk summaries across the district
- **System Administrator**: uses the web dashboard to create and manage CHW, Nurse, and District Officer accounts

---

## What's in Each Part of the System

### Backend (`backend/`)

A Django REST Framework API that is the single source of truth for all patient data. It handles:

- **Authentication**  JWT-based login (24-hour access tokens), with four roles: CHW, Nurse, District Officer, System Administrator, each with strict role-based access control (RBAC)
- **Patient registration**  a CHW registers a patient, and the system automatically calculates her four WHO-recommended ANC visit dates (weeks 12, 20, 28, 36 from her last menstrual period)
- **Visit logging** CHWs log each visit as attended, missed, or flagged with danger signs; danger signs automatically mark a patient as high-risk
- **Nurse dashboard data** a nurse can only see patients within her own health centre's catchment area
- **District reporting**  aggregate patient counts and high-risk case counts per village, restricted to read-only, no patient-level detail, per the district officer's role
- **Account management**  a System Administrator can create new CHW, Nurse, or District Officer accounts, each scoped to a specific village cell, catchment area, or district

Database: PostgreSQL. Every RBAC boundary (a CHW only seeing her own village cell's patients, a Nurse only seeing her own catchment area) is enforced at the database query level, not just in the UI.

### Mobile App (`mobile/`)

A React Native application built for Community Health Workers, designed to work fully offline. It includes:

- A Kinyarwanda-first login screen
- A patient registration form with a native date picker for entering a patient's last menstrual period date
- Local storage using SQLite, so a CHW can register patients and log visits with zero internet connectivity
- A patient list screen with name search
- A visit-logging screen where a CHW records whether a patient attended, missed, or showed danger signs during a home visit

All patient and visit data written on the mobile app is stored locally first. Syncing this local data to the backend server (so a nurse can see it on the dashboard) is a planned feature not yet implemented, see Known Limitations below.

### Web Dashboard (`dashboard/`)

A React (Vite) web application used by Nurses, District Officers, and System Administrators. It includes:

- A role-aware login page that redirects each user to the correct view based on their account type
- A nurse-facing patient list with filters by village and risk status, and a detail page per patient showing her full ANC schedule and a running list of nurse-authored notes
- A district officer-facing report showing patient counts and high-risk case counts per village, with a CSV export button
- A system administrator-facing form to create new CHW, Nurse, or District Officer accounts with the correct role-specific fields

---

## Live Deployment

| Component | URL |
|---|---|
| Backend API (live): https://uzima-backend.onrender.com (not browsable directly)
  - Admin panel: https://uzima-backend.onrender.com/admin/
  - Login endpoint: https://uzima-backend.onrender.com/api/token/ (POST only, not browsable directly)
| Web Dashboard | https://uzima-maternal-health.vercel.app |

**Note:** The backend is hosted on Render's free tier, which spins down after a period of inactivity. The first request after idle time may take 30-60 seconds to respond while the server wakes up  this is expected, not an error.

### Test Accounts (on the live deployment)

| Username | Password | Role |
|---|---|---|
| `nurse_test` | `testpass123` | Nurse |
| `officer_test` | `testpass123` | District Health Officer |
| `sysadmin_test` | `testpass123` | System Administrator |
| `chw_test` | `testpass123` | Community Health Worker (API access only, no web dashboard login) |

Log in to the web dashboard at the URL above using any of the Nurse, District Officer, or System Administrator accounts, each will redirect to its own view automatically.

---

## Project Structure
```
uzima-maternal-health/
├── backend/ Django REST Framework API
│ ├── manage.py
│ ├── requirements.txt
│ ├── uzima_core/ Project settings, root URL config
│ ├── accounts/ User model, roles, JWT auth, RBAC permissions, account creation
│ ├── patients/ Patient model, registration, nurse/district endpoints
│ ├── schedules/ ANC schedule model, WHO date calculation logic
│ ├── visits/ Visit logs, danger signs, nurse notes
│ └── notifications/ SMS log model (schema only, not yet in use)
│
├── mobile/ React Native app (bare CLI, not Expo)
│ └── src/
│ ├── screens/ Login, Home, Patient Registration, Patient List, Visit Log
│ ├── services/ API client, auth service
│ ├── db/ Local SQLite schema and repositories
│ └── i18n/ Kinyarwanda/English string files (prepared, not yet wired in)
│
└── dashboard/ React + Vite web app
└── src/
├── pages/ Login, Nurse Dashboard, Patient Detail, District Report, Create User
├── components/ Sidebar, Patient Table, Filter Bar
└── services/ API client, auth service
```
---

## Full Local Setup Instructions

These steps assume a Windows machine with Git Bash. Adjust paths/commands accordingly for Mac/Linux.

### Prerequisites

Install these before starting:
- **Python 3.14+** — https://www.python.org/downloads/
- **PostgreSQL 15+** — https://www.postgresql.org/download/
- **Node.js 20+** and npm — https://nodejs.org/
- **Git** — https://git-scm.com/
- (Mobile only) **Android Studio** with NDK version `27.1.12297006`, and either an Android emulator or a physical Android device

### 1. Clone the repository

```bash
git clone https://github.com/T-Sylivie/uzima-maternal-health.git
cd uzima-maternal-health
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

Create a database and user in PostgreSQL:
```bash
psql -U postgres
```
Inside the `psql` prompt:
```sql
CREATE USER uzima_user WITH PASSWORD 'choose_a_password';
CREATE DATABASE uzima OWNER uzima_user;
GRANT ALL PRIVILEGES ON DATABASE uzima TO uzima_user;
\q
```

Create a `.env` file inside `backend/` (copy `.env.example` as a starting point) with the following:

SECRET_KEY=<generate one with the command below>
DEBUG=True
DB_NAME=uzima
DB_USER=uzima_user
DB_PASSWORD=<the password you chose above>
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

Generate a secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Run migrations and create a superuser:
```bash
python manage.py migrate
python manage.py createsuperuser
```

Seed test accounts (CHW, Nurse, District Officer, System Admin) matching the live deployment:
```bash
python manage.py seed_test_users
```

Start the backend server:
```bash
python manage.py runserver
```

Backend now runs at `http://127.0.0.1:8000`

### 3. Dashboard setup

Open a new terminal:
```bash
cd uzima-maternal-health/dashboard
npm install
```

Confirm `dashboard/src/services/apiClient.js` points to your local backend for development:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

Start the dashboard:
```bash
npm run dev
```

Dashboard now runs at `http://localhost:5173`. Log in with any seeded test account (see Test Accounts table above).

### 4. Mobile app setup

Open a new terminal:
```bash
cd uzima-maternal-health/mobile
npm install
```

Ensure an Android emulator is running (via Android Studio's Device Manager), or a physical Android device is connected via USB with debugging enabled (`adb devices` should list it).

```bash
npx react-native run-android
```

This builds and installs the app on the connected emulator/device. In a separate terminal, start the Metro bundler if it isn't already running:
```bash
npx react-native start
```

---

## API Endpoints Reference

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/token/` | Public | Log in, receive JWT access + refresh tokens |
| POST | `/api/token/refresh/` | Public | Get a new access token using a refresh token |
| GET | `/api/me/` | Authenticated | Get the logged-in user's info and role profile |
| POST | `/api/users/create/` | System Admin only | Create a new CHW, Nurse, or District Officer account |
| GET, POST | `/api/patients/` | CHW only | List or register patients within the CHW's own village cell |
| GET | `/api/patients/nurse/` | Nurse only | List patients within the nurse's own catchment area |
| GET | `/api/patients/district-report/` | District Officer only | Aggregate patient and high-risk counts per village |
| GET, POST | `/api/visits/logs/` | CHW only | List or log visit outcomes and danger signs |
| GET, POST | `/api/visits/notes/` | Nurse only | View or add notes on a specific patient |

---

## Sprint-by-Sprint Status

| Sprint | Scope | Status |
|---|---|---|
| 1 | Project setup, Django/PostgreSQL scaffolding, React Native base app, JWT authentication | Complete, tested end-to-end |
| 2 | Patient registration, offline LMP entry, automatic ANC date calculation, local SQLite storage | Complete, tested end-to-end |
| 3 | Offline sync engine (SQLite to PostgreSQL) | Not implemented |
| 4 | SMS reminders via Africa's Talking, Celery/Redis task scheduling | Not implemented |
| 5 | Missed visit detection, danger sign logging and escalation | Backend complete and tested; mobile visit-logging screen written but not visually verified (see Known Limitations); automated 24-hour missed-visit detection not implemented |
| 6 | Nurse web dashboard: patient list, filters, flagged cases, notes | Complete |
| 7 | District officer reporting: aggregate attendance by village | Complete, includes CSV export |
| — | System Administrator account creation (not in original sprint plan, added during implementation) | Complete |

---

## Known Limitations

- **Offline sync is not implemented.** Patients registered on the mobile app are stored locally on the device only; they do not currently sync to the backend server, and therefore will not appear on the nurse or district officer dashboards. This is Sprint 3 scope, deliberately deferred due to time constraints.
- **SMS reminders are not implemented.** The database schema exists (`SMSLog` model) but no Celery task or Africa's Talking integration has been built.
- **Automated missed-visit detection is not implemented.** A CHW can manually log a visit as "missed," but there is no scheduled job that automatically detects an unlogged, overdue visit and raises an alert.
- **The Android emulator used during development became unstable partway through the project** and could not be reliably used for further visual testing of mobile screens built after that point. These screens (patient list search, visit logging) were written and are structurally consistent with earlier, working screens, but were not visually re-verified.
- **JWT tokens are stored in memory only**, both on mobile and on the web dashboard. Refreshing the browser page, or restarting the mobile app, requires logging in again.
- **No self-service password reset or change-password feature exists.** Accounts are provisioned by a System Administrator with an initial password.
- **District reporting is not scoped to an actual administrative district** — there is no village-to-district mapping in the current data model, so the report currently aggregates across all villages system-wide rather than one officer's specific district.
- **Mobile screens display Kinyarwanda text directly**, rather than through the `i18n/rw.json` and `en.json` files that were prepared but not wired into the screens; there is currently no in-app language toggle.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django REST Framework, Python 3.14 |
| Database | PostgreSQL |
| Mobile | React Native (bare CLI), `@op-engineering/op-sqlite` for local storage |
| Web Dashboard | React, Vite |
| Authentication | JSON Web Tokens (djangorestframework-simplejwt) |
| Backend Hosting | Render |
| Dashboard Hosting | Vercel |
