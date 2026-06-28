# 🚀 Deployment Guide — Single Server on Render

## How it works
The React frontend is built into `backend/public/` and Express serves it.
**One Render service. One URL. No CORS issues.**

```
Build process (Render runs this automatically):
  frontend/  →  npm run build  →  dist/  →  copied to  →  backend/public/
  
At runtime:
  https://your-app.onrender.com/api/*   → Express API routes
  https://your-app.onrender.com/*       → React frontend (index.html)
```

---

## Before You Start — Gather These

| What | Where to get it | Free? |
|------|----------------|-------|
| GitHub account | github.com | ✅ |
| Render account | render.com | ✅ |
| MongoDB Atlas URI | mongodb.com/atlas | ✅ |
| Gemini API Key | aistudio.google.com/apikey | ✅ |

---

## Step 1 — Push to GitHub

Extract the ZIP, open terminal in the root folder:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-trip-planner.git
git push -u origin main
```

---

## Step 2 — MongoDB Atlas Setup

1. Go to cloud.mongodb.com → Create free account
2. Create a free M0 cluster (any region)
3. Security → Database Access → Add New User
   - Username: `tripuser`  Password: make something strong, save it
4. Security → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Click Connect → Drivers → copy the connection string
6. Edit the string:
   - Replace `<password>` with your password
   - Add database name: `.../ai-trip-planner?retryWrites...`
   - Final example: `mongodb+srv://tripuser:mypass@cluster0.abc.mongodb.net/ai-trip-planner?retryWrites=true&w=majority`
7. Save this string — you need it in Step 3

---

## Step 3 — Get Gemini API Key

1. Go to aistudio.google.com/apikey
2. Sign in with Google → Create API Key → Copy it

---

## Step 4 — Deploy on Render

1. Go to render.com → Sign up (use GitHub login)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo → select `ai-trip-planner`
4. Fill in:
   - **Name:** `ai-trip-planner`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm run render-build`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
5. Add these Environment Variables:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 5000 |
| MONGODB_URI | *(your Atlas URI from Step 2)* |
| JWT_ACCESS_SECRET | *(any random 32+ char string)* |
| JWT_REFRESH_SECRET | *(any different random 32+ char string)* |
| JWT_ACCESS_EXPIRES | 15m |
| JWT_REFRESH_EXPIRES | 7d |
| GEMINI_API_KEY | *(your key from Step 3)* |

6. Click **Create Web Service**
7. Watch the logs — build takes 3-5 minutes
8. Once **Live**, your app is at: `https://ai-trip-planner.onrender.com`

---

## Step 5 — Verify It Works

Open `https://your-app.onrender.com/health` — should show `{"status":"OK"}`
Open `https://your-app.onrender.com` — should show your React app

---

## Local Development

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env     # fill in your values, use localhost MongoDB or Atlas
npm install
npm run dev              # runs on http://localhost:5000

# Terminal 2 — Frontend  
cd frontend
# .env.local already has VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # runs on http://localhost:5173
```

---

## Updating Your App

Just push to GitHub — Render auto-deploys:
```bash
git add .
git commit -m "my update"
git push
```

---

## ⚠️ Notes

- **Free tier sleeps** after 15 min of inactivity → first request takes ~30s to wake up
- To prevent sleeping → upgrade to Render Starter ($7/month)
- **JWT Secrets** can be any long random string — to generate one:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
