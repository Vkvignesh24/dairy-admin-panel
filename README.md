# Dairy Admin Panel

React + Vite admin panel for the existing Dairy backend.

## Setup

```bash
npm install
cp .env.example .env
# fill VITE_API_BASE and VITE_FIREBASE_* values
npm run dev
```

## Auth

Login uses Firebase Email/Password. The Firebase ID token is exchanged with
`POST /api/admin/auth/login`. Only users whose Mongo record has `role: "admin"`
can sign in.

## Pages

- `/` Dashboard
- `/subscriptions`
- `/tomorrow` Tomorrow delivery (backend-computed, 5 PM cutoff)
- `/orders`
- `/products`
- `/customers`

Excel and PDF exports are client-side via `xlsx` and `jsPDF`. The backend
also exposes `/export/csv` and `/export/pdf` endpoints if you prefer
server-side generation.
