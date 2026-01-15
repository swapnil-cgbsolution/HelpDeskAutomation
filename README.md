# Helpdesk Automation Tool

A three-surface Helpdesk Automation experience (Admin, Engineer, Requester) mirroring the supplied Figma boards. The repo ships with a React front-end, an Express API, and a PostgreSQL schema ready for your Supabase instance.

- `frontend/`: Vite + React + React Query UI with bold card layout, chips, and gradients that reflect the mockups for admin, engineer, and user personas.
- `server/`: Typed Express API exposing tickets, comments, SLA metrics, and remote-session placeholders with Supabase-ready SQL.
- `db/`: Re-runnable schema creating enums, tables, relationships, indexes, and demo data for tickets, imports, remote sessions, and inventory.
- `docs/`: Ops notes and runbooks.

## Quick start
```bash
npm install
npm run dev
```

Environment variables:
```
cp server/.env.example server/.env
```
Update `DATABASE_URL` to the Supabase connection string and `VITE_API_URL` (in `frontend/.env`) to the deployed API.

## Scripts
- `npm run dev:frontend` – start the React surface on port 5173.
- `npm run dev:server` – run the API with live reload via `tsx` on port 4000.
- `npm run build` – build the client bundle and TypeScript compile the API.
- `npm run lint` – type-check both workspaces.

## Database
Apply `db/schema.sql` through the Supabase SQL editor or `psql`. It creates:
- role-aware `users`, `teams`, and `team_memberships`
- `tickets`, `ticket_comments`, `ticket_activities`, `ticket_approvals`
- operational tables for remote sessions, import batches, inventory, and notifications.

## Frontend theming
Typography uses **Space Grotesk** + **Instrument Sans**, avoiding default stacks per design guidance. CSS variables and gradients live in `frontend/src/styles/theme.css` so you can adjust palettes globally.
