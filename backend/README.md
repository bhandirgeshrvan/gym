# GymPulse Backend API

FastAPI backend for the GymPulse Gym Management Platform, connected to a Supabase PostgreSQL database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI 0.115 |
| Database | PostgreSQL (Supabase) |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT via python-jose + bcrypt |
| Validation | Pydantic v2 |
| Server | Uvicorn |

---

## Project Structure

```
backend/
├── config/
│   └── database.py          # DB engine, session, Base
├── router/
│   ├── auth.py              # Register, Login, Forgot Password
│   ├── gyms.py              # Gym CRUD
│   ├── members.py           # Member CRUD
│   ├── trainers.py          # Trainer CRUD
│   ├── attendance.py        # Check-in, history, stats
│   ├── payments.py          # Payment CRUD
│   ├── workouts.py          # Workout plan CRUD
│   └── dashboard.py         # Aggregated stats per role
├── models.py                # SQLAlchemy ORM models
├── schemas.py               # Pydantic request/response schemas
├── auth_utils.py            # JWT helpers, password hashing
├── server.py                # FastAPI app entry point
├── requirement.txt          # Python dependencies
├── .env                     # Environment variables (not committed)
└── GymPulse_API.postman_collection.json
```

---

## Prerequisites

- Python 3.10+ (tested on 3.13)
- pip
- A running PostgreSQL instance (Supabase is pre-configured)

---

## Setup & Installation

### 1. Clone / navigate to the backend folder

```bash
cd "Build Gym Management Platform/backend"
```

### 2. (Optional) Create a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirement.txt
```

> **Windows note:** All packages ship with pre-built wheels for Python 3.13 on Windows — no Rust or MSVC compiler needed.

### 4. Configure environment variables

The `.env` file is already present at `backend/.env`. Verify it contains:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/postgres
SECRET_KEY=gympulse-super-secret-key-change-in-production
```

Replace values if you switch databases. Never commit `.env` to version control.

---

## Running the Server

```bash
uvicorn server:app --reload
```

Expected output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXXX] using WatchFiles
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
INFO:gympulse:✅ Database connected successfully
INFO:     Application startup complete.
```

> If you see `❌ Database connection failed`, check your `DATABASE_URL` in `.env`.

### Other useful run options

```bash
# Custom host/port
uvicorn server:app --host 0.0.0.0 --port 8080 --reload

# Production (no reload)
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## API Overview

Base URL: `http://127.0.0.1:8000`

All protected routes require the header:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### 🔐 Auth — `/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user (any role) |
| POST | `/auth/login` | ❌ | Login and receive JWT token |
| POST | `/auth/forgot-password` | ❌ | Request password reset link |

#### 🏋️ Gyms — `/gyms`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/gyms/` | ✅ | List all gyms (super_admin) or own gyms |
| POST | `/gyms/` | ✅ | Create a new gym |
| GET | `/gyms/{id}` | ✅ | Get gym by ID |
| PATCH | `/gyms/{id}` | ✅ | Update gym details |
| DELETE | `/gyms/{id}` | ✅ | Delete gym |

#### 👥 Members — `/members`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/members/` | ✅ | List members (filter by `?gym_id=`) |
| POST | `/members/` | ✅ | Add a member |
| GET | `/members/{id}` | ✅ | Get member by ID |
| PATCH | `/members/{id}` | ✅ | Update member |
| DELETE | `/members/{id}` | ✅ | Delete member |

#### 🏃 Trainers — `/trainers`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/trainers/` | ✅ | List trainers (filter by `?gym_id=`) |
| POST | `/trainers/` | ✅ | Add a trainer |
| GET | `/trainers/{id}` | ✅ | Get trainer by ID |
| PATCH | `/trainers/{id}` | ✅ | Update trainer |

#### 📅 Attendance — `/attendance`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/attendance/checkin` | ✅ | Record a check-in (manual / qr) |
| GET | `/attendance/member/{id}` | ✅ | Member's full attendance history |
| GET | `/attendance/gym/{id}/today` | ✅ | Today's attendance count for a gym |
| GET | `/attendance/gym/{id}/weekly` | ✅ | Last 7 days attendance breakdown |

#### 💳 Payments — `/payments`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/payments/` | ✅ | List payments (filter by `?member_id=`) |
| POST | `/payments/` | ✅ | Record a payment |
| GET | `/payments/{id}` | ✅ | Get payment by ID |

#### 🏋️ Workouts — `/workouts`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/workouts/` | ✅ | List plans (filter by `?trainer_id=` or `?member_id=`) |
| POST | `/workouts/` | ✅ | Create a workout plan |
| GET | `/workouts/{id}` | ✅ | Get workout plan by ID |
| PATCH | `/workouts/{id}` | ✅ | Update workout plan |
| DELETE | `/workouts/{id}` | ✅ | Delete workout plan |

#### 📊 Dashboard — `/dashboard`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/super-admin` | ✅ | Platform-wide stats (gyms, users, revenue, churn) |
| GET | `/dashboard/gym-owner/{gym_id}` | ✅ | Gym-level stats (members, attendance, revenue) |

---

## Roles

| Role | Value | Access |
|------|-------|--------|
| Super Admin | `super_admin` | Full platform access |
| Gym Owner | `gym_owner` | Own gym(s) only |
| Trainer | `trainer` | Assigned members only |
| Member | `member` | Own profile only |

---

## Interactive API Docs

Once the server is running, open in your browser:

| URL | Description |
|-----|-------------|
| `http://127.0.0.1:8000/docs` | Swagger UI — interactive, try APIs in browser |
| `http://127.0.0.1:8000/redoc` | ReDoc — clean readable documentation |

---

## Postman Collection

File: `GymPulse_API.postman_collection.json`

### Import Steps

1. Open **Postman**
2. Click **Import** (top left)
3. Drag and drop `GymPulse_API.postman_collection.json`
4. The collection appears with all folders and variables pre-configured

### Collection Variables (auto-managed)

| Variable | Description | Set by |
|----------|-------------|--------|
| `base_url` | `http://127.0.0.1:8000` | Pre-set |
| `token` | JWT access token | Auto-saved on Login/Register |
| `gym_id` | Last created gym ID | Auto-saved on Create Gym |
| `member_id` | Last created member ID | Auto-saved on Create Member |
| `trainer_id` | Last created trainer ID | Auto-saved on Create Trainer |
| `payment_id` | Last created payment ID | Auto-saved on Create Payment |
| `workout_id` | Last created workout ID | Auto-saved on Create Workout |

### Recommended Test Order

Run requests in this sequence — each step feeds IDs into the next:

```
1. 🔐 Auth → Register Super Admin        (token auto-saved)
2. 🔐 Auth → Register Gym Owner
3. 🔐 Auth → Register Trainer
4. 🔐 Auth → Register Member
5. 🔐 Auth → Login - Super Admin         (token refreshed)
6. 🏋️ Gyms → Create Gym                 (gym_id auto-saved)
7. 🏃 Trainers → Create Trainer          (trainer_id auto-saved)
8. 👥 Members → Create Member            (member_id auto-saved)
9. 📅 Attendance → Check In
10. 📅 Attendance → Today's Count
11. 📅 Attendance → Weekly Attendance
12. 💳 Payments → Create Payment         (payment_id auto-saved)
13. 🏋️ Workouts → Create Workout Plan   (workout_id auto-saved)
14. 📊 Dashboard → Super Admin Stats
15. 📊 Dashboard → Gym Owner Stats
16. 🔒 Auth Guard → No Token (expect 401)
17. 🔒 Auth Guard → Invalid Token (expect 401)
```

### Run Entire Collection at Once

1. Right-click the **GymPulse API** collection
2. Click **Run collection**
3. Click **Run GymPulse API**
4. All 36 requests execute in order with pass/fail test results

---

## Database Models

```
users          → id, first_name, last_name, email, hashed_password, role
gyms           → id, name, location, plan, owner_id (FK users)
members        → id, user_id, gym_id, trainer_id, membership_plan, status, expiry_date
trainers       → id, user_id, gym_id, specialty, experience_years, rating
attendance     → id, member_id, checked_in_at, method
payments       → id, member_id, amount, description, method, status, invoice_number
workout_plans  → id, name, trainer_id, member_id, duration_minutes, level, exercises (JSON)
```

Tables are auto-created on first startup via `Base.metadata.create_all()`.

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `DATABASE_URL is None` | `.env` not found or empty | Check `.env` file exists with correct values |
| `401 Unauthorized` | Missing or expired token | Login again to get a fresh token |
| `400 Email already registered` | Duplicate registration | Use a different email or login instead |
| `404 Not found` | Wrong ID in URL | Check the ID exists using the List endpoint first |
| `psycopg2 build error` | Wrong psycopg2 version | Use `psycopg2-binary==2.9.10` (pre-built wheel) |
