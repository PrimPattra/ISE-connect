# ISE Connect

A career platform for Chulalongkorn University ISE students. Job hunters can browse postings, track applications, and showcase projects. Recruiters (alumni/faculty) can post roles and manage applicants.

**Live app:** https://ise-connect.vercel.app

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo (React Native Web) |
| Backend | Flask + Gunicorn |
| Database | MongoDB Atlas |
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Auth | JWT (Bearer token) |

---

## Features

### Job Hunter
- Browse and filter job postings (type, location, keyword)
- Save jobs and apply via external links
- View company reviews and salary data
- Browse and like projects in the Showcase
- Edit profile (skills, headline, track)

### Recruiter
- Post new roles with skills, compensation, and period
- View applicants per role and update their status (New / Interview / Offer / Rejected)
- Search the candidate pool

---

## Project Structure

```
ISE-connect/
├── app/                    # Expo file-based routes
│   ├── (auth)/             # Login / register screens
│   └── (tabs)/             # Main tab screens
│       ├── board.tsx        # Job listings (hunter)
│       ├── recruiter.tsx    # Role management (recruiter)
│       ├── reviews.tsx      # Company reviews
│       ├── showcase.tsx     # Project showcase
│       └── profile.tsx      # User profile
├── components/             # Reusable UI components
├── context/
│   └── app-context.tsx     # Global state (user, jobs, projects…)
├── services/
│   └── api.ts              # All API calls to the backend
├── backend/
│   ├── app.py              # Flask app factory
│   ├── config.py           # Env var loading
│   ├── db.py               # MongoDB client + collections
│   ├── models/             # Pydantic models
│   ├── routes/             # API route blueprints
│   │   ├── auth.py          # /auth/register, /auth/login, /auth/me
│   │   ├── jobs.py          # /jobs CRUD + save toggle
│   │   ├── applications.py  # /applications
│   │   ├── projects.py      # /projects CRUD + likes
│   │   ├── reviews.py       # /reviews
│   │   └── resources.py     # /resources
│   ├── middleware/
│   │   └── auth.py          # JWT require_auth decorator
│   └── seed.py             # One-time DB seed script
└── vercel.json             # Vercel output directory config
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account (or local MongoDB)

### Frontend

```bash
npm install
npx expo start
```

The app opens in Expo Go or a browser. Set the backend URL in `.env.local`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Create backend/.env
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET

python app.py
```

Backend runs at `http://localhost:5000`.

> To test on a physical phone on a different network, use [ngrok](https://ngrok.com) to expose port 5000 and set that URL as `EXPO_PUBLIC_API_URL`.

### Seed the database (optional)

```bash
cd backend
python seed.py
```

Creates sample users, jobs, projects, reviews, and resources.

**Seed accounts** (password: `password123`):
| Email | Role |
|-------|------|
| proudmorakod@student.chula.ac.th | hunter |
| pim@alumni.chula.ac.th | hunter |
| anong@gmail.com | recruiter |

---

## Environment Variables

### Backend (`backend/.env`)

| Key | Description |
|-----|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `DB_NAME` | Database name (default: `ise_connect`) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRY_HOURS` | Token lifetime in hours (default: `24`) |

### Frontend (`.env.local`)

| Key | Description |
|-----|-------------|
| `EXPO_PUBLIC_API_URL` | Backend base URL |

---

## Deployment

### Render (backend)

- **Root directory:** `backend`
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `gunicorn "app:create_app()"`
- **Environment variables:** set all 4 backend vars in the Render dashboard

### Vercel (frontend)

- **Build command:** `npx expo export`
- **Output directory:** `dist`
- **Environment variables:** set `EXPO_PUBLIC_API_URL` to your Render service URL

After changing environment variables on either platform, trigger a redeploy for changes to take effect.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user |
| GET | `/jobs` | List all jobs |
| POST | `/jobs` | Post a new job (recruiter) |
| PATCH | `/jobs/:id/save` | Toggle save |
| GET | `/applications` | List applications |
| POST | `/applications` | Submit application |
| PATCH | `/applications/:id/status` | Update applicant status |
| GET | `/projects` | List projects |
| POST | `/projects` | Add project |
| PATCH | `/projects/:id/like` | Toggle like |
| GET | `/reviews` | List reviews |
| POST | `/reviews` | Add review |
| GET | `/resources` | List resources |
| POST | `/resources` | Add resource |
