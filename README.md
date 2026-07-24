# MANAS: Mental Awareness & Assistance for Student Stress

MANAS is a privacy-first, web-based wellness application designed to help students track their emotional state, access immediate self-care tools, and securely request professional help. It uses an intuitive "weather" metaphor for tracking stress and offers anonymous department-level analytics for institutes.

## Table of Contents
1. [Architecture Summary](#architecture-summary)
2. [Folder Structure](#folder-structure)
3. [Environment Variables](#environment-variables)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [Installation & Development Guide](#installation--development-guide)
7. [Deployment Guide](#deployment-guide)

---

## Architecture Summary
**Frontend**: React, Vite, TypeScript, Tailwind CSS, Zustand (state persistence), Framer Motion (animations), React Router.
**Backend**: Node.js, Express, TypeScript, Prisma (ORM).
**Database**: PostgreSQL (Neon Serverless PostgreSQL recommended).
**Styling**: Pixel-perfect translation of Stitch Design System tokens (Glassmorphism, curated typography).

---

## Folder Structure
```text
f:\Maanas
├── package.json               # Monorepo task runner (concurrently)
├── vercel.json                # Vercel deployment configuration
├── railway.json               # Railway deployment configuration
├── backend/                   # Express backend (Clean Architecture)
│   ├── prisma/                # Schema & Seed script
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic & DB queries
│   │   ├── routes/            # Express routers
│   │   ├── middleware/        # JWT auth, Error handling
│   │   ├── validators/        # Zod request validation schemas
│   │   └── utils/             # Standardized JSON responses
│   └── .env
└── frontend/                  # React + Vite frontend
    ├── src/
    │   ├── api/               # Modular Axios clients 
    │   ├── components/        # Reusable UI (Mascot)
    │   ├── pages/             # Stitch translated screens
    │   └── store/             # Zustand persistent store
    ├── tailwind.config.js     # Stitch token maps
    └── .env
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@ep-x-y.us-east-2.aws.neon.tech/neondb` |
| `JWT_SECRET` | Secret for signing JWTs | `supersecret_jwt_key_for_manas` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for backend APIs | `http://localhost:3000/api` |

---

## Database Schema
- **Institute**: `id`, `name`, `email`, `password`
- **Assessment**: `id`, `deviceId`, `department`, `academicYear`, `score`, `weatherCategory`, `timestamp`
- **AssessmentHistory**: `id`, `deviceId`, `totalScore`, `timestamp`
- **Counselor**: `id`, `name`, `specialty`, `available`
- **Appointment**: `id`, `deviceId`, `counselorId`, `date`, `status`
- **WeatherRecommendation**: `id`, `weatherCategory`, `recommendations` (JSON)

---

## API Documentation

### Auth Endpoints
- **POST** `/api/auth/login`
  - **Body**: `{ "email": "...", "password": "..." }`
  - **Response**: `{ "success": true, "data": { "token": "...", "user": {...} } }`

### Assessment Endpoints (Anonymous)
- **POST** `/api/assessments`
  - **Body**: `{ "deviceId": "...", "department": "...", "academicYear": "...", "score": 10, "weatherCategory": "Cloudy" }`
  - **Response**: `{ "success": true, "data": { "assessment": {...}, "recommendations": [...] } }`

### Appointment Endpoints (Anonymous)
- **GET** `/api/appointments/counselors`
  - **Response**: List of available counselors.
- **POST** `/api/appointments`
  - **Body**: `{ "deviceId": "...", "counselorId": "...", "date": "2026-07-24T10:00:00Z" }`
  - **Response**: Booked appointment status.
- **GET** `/api/appointments?deviceId=...`
  - **Response**: List of appointments for that device.

### Dashboard Endpoints (Requires JWT)
- **GET** `/api/dashboard/stats`
- **GET** `/api/dashboard/departments`

---

## Installation & Development Guide

1. **Install Dependencies** (Root folder):
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in both `frontend/` and `backend/`. Ensure `DATABASE_URL` in the backend points to a valid PostgreSQL database.
3. **Database Setup**:
   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   npm run prisma:seed
   ```
4. **Run Development Servers** (Root folder):
   ```bash
   npm start
   ```
   *Frontend runs on http://localhost:5173, Backend on http://localhost:3000.*

---

## Deployment Guide

### Database (Neon PostgreSQL)
1. Create a Neon project.
2. Copy the connection string.
3. Add it as `DATABASE_URL` in Railway.

### Backend (Railway)
1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the `railway.json` file in the root directory.
3. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT` (8080).
4. Run Prisma deployment commands locally or via Railway build steps to apply the schema.

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Vercel will detect the `vercel.json` and automatically configure the frontend build (`cd frontend && npm install && npm run build`).
3. Add Environment Variable: `VITE_API_URL` pointing to your Railway backend URL (e.g., `https://manas-api.up.railway.app/api`).
4. Deploy.
