# Helpdesk Automation Tool

## Stack
- **Frontend**: React + Vite + React Query + custom glassmorphism styling that matches the provided Figma shots for admin/engineer/user.
- **Backend**: Express + TypeScript + PostgreSQL (Supabase) with opinionated services for tickets, comments, and dashboard insights.
- **Database**: PostgreSQL schema defined in `db/schema.sql` with enums, foreign keys, remote session + import batch tables, and starter data.

## Local development
```bash
# install deps
npm install

# run backend only
npm run dev:server

# run frontend only
npm run dev:frontend

# run both with concurrency
npm run dev
```

Set environment variables for the API:
```
cp server/.env.example server/.env
```
Adjust the password/host according to your Supabase project.

## Deployment notes
- Host the frontend (Vite static bundle) on any CDN (Vercel, Netlify, Azure Static Web Apps).
- Deploy the backend to a Node-friendly host (Fly.io, Render, Azure App Service). Expose `PORT` and `DATABASE_URL` env vars.
- Apply the SQL found in `db/schema.sql` to the Supabase database.
- Update `VITE_API_URL` (e.g., `.env` file or platform-specific secret) so the React app can reach the API.
