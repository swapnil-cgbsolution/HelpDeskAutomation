# Database setup

1. Sign in to Supabase dashboard using the provided credentials.
2. Open the SQL editor for the `Helpdesk` project and paste the contents of `schema.sql`.
3. Run the script to create enums, tables, indexes, and starter data. The script guards itself with `IF NOT EXISTS` so it is safe to re-run.
4. (Optional) Create a dedicated service role user and store its connection string inside `server/.env` as `DATABASE_URL`.
