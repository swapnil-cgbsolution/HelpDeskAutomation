-- Helpdesk Automation schema for Supabase / PostgreSQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE ticket_status AS ENUM (
      'new',
      'open',
      'in_progress',
      'waiting_customer',
      'waiting_vendor',
      'remote_required',
      'closed',
      'out_of_sla'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'engineer', 'requester')),
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_memberships (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status ticket_status NOT NULL DEFAULT 'new',
  requester_id UUID REFERENCES users(id),
  requester_name TEXT,
  site TEXT NOT NULL,
  team TEXT NOT NULL,
  assignee_id UUID REFERENCES users(id),
  assignee_name TEXT,
  sla_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_followers (
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (ticket_id, user_id)
);

CREATE TABLE IF NOT EXISTS ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  body TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'internal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS remote_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  state TEXT NOT NULL CHECK (state IN ('scheduled', 'live', 'closed')),
  provider TEXT NOT NULL,
  pin_code TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES users(id),
  approver_name TEXT,
  state TEXT NOT NULL CHECK (state IN ('pending', 'approved', 'rejected')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT NOT NULL CHECK (audience IN ('admin', 'engineer', 'user')),
  ticket_id UUID REFERENCES tickets(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  records_total INT NOT NULL,
  records_success INT NOT NULL,
  actor_id UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('draft', 'running', 'completed', 'failed')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT NOT NULL,
  asset_tag TEXT,
  model TEXT,
  site TEXT,
  owner_id UUID REFERENCES users(id),
  imported_from UUID REFERENCES import_batches(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_team ON tickets(team);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket ON ticket_comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_ticket ON ticket_activities(ticket_id);

-- Basic seed data for immediate demos
INSERT INTO teams (name, scope)
  VALUES ('Field Ops', 'hardware'),
         ('Network Guild', 'network'),
         ('Automation Lab', 'platform')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (full_name, email, role)
  VALUES ('Priya Menon', 'priya@hat.demo', 'admin'),
         ('Rahul Verma', 'rahul@hat.demo', 'engineer'),
         ('Neha Gupta', 'neha@hat.demo', 'engineer'),
         ('Aditi Rao', 'aditi@hat.demo', 'requester')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tickets (title, description, category, priority, status, requester_name, site, team, assignee_name)
SELECT * FROM (
  VALUES
    ('Laptop battery swelling', 'Remote user noticing bulged chassis, needs loaner shipped.', 'Hardware', 'high', 'open'::ticket_status, 'Aditi Rao', 'Pune Remote', 'Field Ops', 'Rahul Verma'),
    ('Warehouse Wi-Fi dark', 'Entire Bay 5 offline, sensors not reporting data.', 'Network', 'urgent', 'remote_required'::ticket_status, 'Ops AI Bot', 'Mumbai DC', 'Network Guild', 'Neha Gupta'),
    ('Access revocation', 'Offboard contractor before midnight.', 'Access', 'medium', 'waiting_customer'::ticket_status, 'Compliance Bot', 'Bangalore', 'Automation Lab', NULL)
) AS seed(title, description, category, priority, status, requester_name, site, team, assignee_name)
ON CONFLICT DO NOTHING;
