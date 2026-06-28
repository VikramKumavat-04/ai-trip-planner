# AI Trip Planner 🌍✈️

A full-stack AI-powered travel planning application built with the MERN stack and Google Gemini AI.

## Tech Stack

**Frontend:** React 19 · Vite · Tailwind CSS · Framer Motion · React Hook Form · Zod  
**Backend:** Node.js · Express.js · MongoDB (Mongoose) · JWT Auth  
**AI:** Google Gemini 1.5 Flash  
**Deployment:** Frontend → Vercel · Backend → Render

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd ai-trip-planner

# Backend
cd backend && npm install
cp .env.example .env   # fill in your values

# Frontend
cd ../frontend && npm install
cp .env.example .env.local
```

### 2. Environment Variables

**Backend `.env`:**
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=your_secret_32chars_min
JWT_REFRESH_SECRET=your_secret_32chars_min
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:5173
```

**Frontend `.env.local`:**
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Run development servers

```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2)
cd frontend && npm run dev
```

App runs at: http://localhost:5173

## Features

- 🤖 AI-generated day-by-day itineraries (Gemini 1.5 Flash)
- 🔐 JWT auth with refresh tokens + Google OAuth
- 📄 PDF export of full itinerary (jsPDF)
- 🔗 Trip sharing via public link
- ❤️ Save favorite destinations
- 📱 Fully responsive (mobile-first)
- 🌙 Dark mode
- 👮 Admin dashboard
- 🔒 Helmet, rate limiting, input sanitization

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/google | Google OAuth |
| POST | /api/trips/generate | Generate AI itinerary |
| GET | /api/trips | Get user trips |
| POST | /api/trips | Save trip |
| DELETE | /api/trips/:id | Delete trip |
| POST | /api/trips/:id/share | Share trip |

## Deployment

**Frontend → Vercel:** Import the `frontend` folder, set env vars  
**Backend → Render:** Import the `backend` folder, set env vars from `.env.example`

## Author

Vikram Kumavat — [LinkedIn](https://linkedin.com/in/vikramkumavat) · [GitHub](https://github.com/VikramKumavat-04)
