# UZIMA — Maternal Health Tracking System

Offline-first maternal health tracking system for community health workers (CHWs) in rural Rwanda. Built for ALU Software Engineering coursework.

## Tech Stack

- **Backend:** Django REST Framework, Python 3.14.6
- **Database:** PostgreSQL 18
- **Mobile:** React Native 0.86 (bare CLI, not Expo), local storage via `@op-engineering/op-sqlite`
- **Web Dashboard:** React + Vite
- **Auth:** JWT (djangorestframework-simplejwt), 24-hour access token expiry

## Project Structure

uzima-maternal-health/
├── backend/ Django REST API
├── mobile/ React Native CHW app
└── dashboard/ React web dashboard (Nurse, District Officer, System Admin)

## Live Deployment

| Component | URL | Status |
|---|---|---|
| Backend API | https://uzima-backend.onrender.com | Live (Render, free tier) |
| Web Dashboard | https://uzima-maternal-health.vercel.app | Live (Vercel) |
| Mobile App | Not deployed | Emulator broken; not tested on real device |

**Note:** Render's free tier spins down after inactivity — the first request after a period of idle time may take 30-60 seconds to respond while the service wakes up.

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

Create `backend/.env` (see `.env.example` for template):

SECRET_KEY=<generate with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DEBUG=True
DB_NAME=uzima
DB_USER=uzima_user
DB_PASSWORD=<see personal notes>
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

```bash
python manage.py migrate
python manage.py runserver
```

Runs at `http://127.0.0.1:8000`

### Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Runs at `http://localhost:5173`

### Mobile

```bash
cd mobile
npm install
npx react-native run-android
```

Requires Android Studio, NDK version `27.1.12297006` specifically, and either a working emulator or a physical Android device connected via USB with debugging enabled.

## Database Credentials (local dev)

| Field | Value |
|---|---|
| Database name | `uzima` |
| Database user | `uzima_user` |
| Database password | *(see personal notes — not stored here)* |
| Host | `localhost` |
| Port | `5432` |

## Test Accounts (both local and live deployment)

| Username | Password | Role | Scoping |
|---|---|---|---|
| `admin` | *(superuser — set locally via createsuperuser)* | Django superuser | N/A |
| `chw_test` | `testpass123` | CHW | village_cell=`Kimisagara`, health_centre_id=`HC-001` |
| `chw_test2` | `testpass123` | CHW | village_cell=`Nyamirambo`, health_centre_id=`HC-002` |
| `nurse_test` | `testpass123` | Nurse | catchment_area=`Kimisagara Sector`, health_centre_id=`HC-001` |
| `officer_test` | `testpass123` | District Officer | district_id=`DIST-001` |
| `sysadmin_test` | `testpass123` | System Administrator | N/A |
| `chw_new` | `newpass123` | CHW | village_cell=`Nyamirambo`, health_centre_id=`HC-003` (created via admin UI) |

**Deployed backend superuser:** `admin` / *(placeholder password was set during seeding — changed after first login, see personal notes)*

## API Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/token/` | Public | Login, get JWT |
| POST | `/api/token/refresh/` | Public | Refresh access token |
| GET | `/api/me/` | Authenticated | Current user info + role profile |
| POST | `/api/users/create/` | System Admin | Create CHW/Nurse/District Officer account |
| GET/POST | `/api/patients/` | CHW | List/register patients (own village cell) |
| GET | `/api/patients/nurse/` | Nurse | List patients (own catchment area) |
| GET | `/api/patients/district-report/` | District Officer | Village-level aggregate report |
| GET/POST | `/api/visits/logs/` | CHW | Log visit outcomes + danger signs |
| GET/POST | `/api/visits/notes/` | Nurse | View/add notes on a patient |

## Sprint Status

| Sprint | Status | Notes |
|---|---|---|
| 1 — Setup, Auth | Complete | Backend + mobile skeleton, tested end-to-end |
| 2 — Patient Registration | Complete | Backend tested via curl; mobile tested live before emulator broke |
| 3 — Offline Sync Engine | Not started | Deliberately deferred; requires working mobile device |
| 4 — SMS Reminders | Not started | Celery/Redis, Africa's Talking not yet integrated |
| 5 — Missed Visit Detection | Partial | Backend complete + curl-tested; mobile screen written, untested; 24hr auto-detection not built |
| 6 — Nurse Dashboard | Complete | Login, patient list, filters, detail page, notes, risk flagging |
| 7 — District Reporting | Complete | Aggregate village report, CSV export |
| Bonus — Admin account creation | Complete | System Admin can create CHW/Nurse/District Officer accounts via UI |

## Known Issues

- Android emulator (Pixel 3a, API 28) crashes silently on startup — root cause not identified. Not deployed to a real device due to time constraints.
- JWT tokens stored in-memory only (mobile and dashboard) — no persistence across app restarts/page refreshes.
- Mobile screens have hardcoded Kinyarwanda strings; `i18n/rw.json` and `en.json` exist but are not wired in.
- "Next Visit" columns show `visit_1_date` unconditionally, not the next chronologically upcoming visit.
- District report is not scoped by actual district (no village-to-district mapping exists); currently returns all villages system-wide.
- No password-reset/change-password flow exists for CHW/Nurse/District Officer accounts — accounts are provisioned by a System Administrator with an initial password.

## Environment Notes

- VS Code's Git Bash terminal profile must use `args: ["-i"]`, not `["--login", "-i"]`, or core Unix commands break inside VS Code specifically.
- NDK version for mobile builds: `27.1.12297006` (check `mobile/android/build.gradle`).
- `psycopg[binary]==3.2.10` used instead of `psycopg2-binary` (incompatible with Python 3.14).
- CORS on the deployed backend is controlled via the `CORS_ALLOWED_ORIGINS` environment variable on Render (comma-separated list), not hardcoded in `settings.py`.
