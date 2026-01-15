import { query } from '../db/pool';
import { Comment, Ticket, TicketStatus } from '../types';

interface TicketRow {
  id: string;
  title: string;
  description: string;
  requester_name: string | null;
  requester_fallback: string | null;
  assignee_name: string | null;
  assignee_fallback: string | null;
  team: string;
  priority: Ticket['priority'];
  status: TicketStatus;
  sla_ends_at: Date | null;
  updated_at: Date;
  category: string;
  site: string;
}

const mapTicket = (row: TicketRow): Ticket => ({
  id: row.id,
  title: row.title,
  requester: row.requester_name ?? row.requester_fallback ?? 'Unidentified',
  assignee: row.assignee_name ?? row.assignee_fallback ?? undefined,
  team: row.team,
  priority: row.priority,
  status: row.status,
  slaEndsAt: row.sla_ends_at?.toISOString(),
  updatedAt: row.updated_at.toISOString(),
  category: row.category,
  site: row.site
});

const fallbackTickets: Ticket[] = [
  {
    id: 'demo-1',
    title: 'Printer outage at Mumbai HQ',
    requester: 'Nikita Shah',
    assignee: 'Karan Patel',
    team: 'Field Ops',
    priority: 'high',
    status: 'in_progress',
    slaEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'Hardware',
    site: 'Mumbai HQ'
  },
  {
    id: 'demo-2',
    title: 'VPN not reachable for APAC users',
    requester: 'Liang Chen',
    assignee: 'Remote Swarm',
    team: 'Network',
    priority: 'urgent',
    status: 'out_of_sla',
    slaEndsAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'Network',
    site: 'Remote'
  }
];

export const listTickets = async (scope?: string) => {
  const filter =
    scope === 'engineer'
      ? "WHERE t.assignee_id IS NOT NULL"
      : scope === 'user'
      ? 'WHERE t.requester_id IS NOT NULL OR t.requester_name IS NOT NULL'
      : '';

  const rows = await query<TicketRow>(
    `SELECT
        t.id,
        t.title,
        t.description,
        r.full_name AS requester_name,
        t.requester_name AS requester_fallback,
        a.full_name AS assignee_name,
        t.assignee_name AS assignee_fallback,
        t.team,
        t.priority,
        t.status,
        t.sla_ends_at,
        t.updated_at,
        t.category,
        t.site
      FROM tickets t
      LEFT JOIN users r ON r.id = t.requester_id
      LEFT JOIN users a ON a.id = t.assignee_id
      ${filter}
      ORDER BY t.updated_at DESC
      LIMIT 40`
  );

  if (!rows.length) {
    return fallbackTickets;
  }

  return rows.map(mapTicket);
};

export const getTicketById = async (ticketId: string) => {
  const rows = await query<TicketRow>(
    `SELECT t.id,
            t.title,
            t.description,
            r.full_name AS requester_name,
            t.requester_name AS requester_fallback,
            a.full_name AS assignee_name,
            t.assignee_name AS assignee_fallback,
            t.team,
            t.priority,
            t.status,
            t.sla_ends_at,
            t.updated_at,
            t.category,
            t.site
       FROM tickets t
       LEFT JOIN users r ON r.id = t.requester_id
       LEFT JOIN users a ON a.id = t.assignee_id
       WHERE t.id = $1
       LIMIT 1`,
    [ticketId]
  );

  const ticket = rows[0];
  if (!ticket) {
    const fallback = fallbackTickets.find((demo) => demo.id === ticketId);
    if (fallback) {
      return fallback;
    }
    throw new Error('Ticket not found');
  }
  return mapTicket(ticket);
};

export const createTicket = async (payload: {
  title: string;
  description: string;
  requester: string;
  site: string;
  priority: Ticket['priority'];
  category: string;
}) => {
  const [inserted] = await query<{ id: string }>(
    `INSERT INTO tickets (title, description, requester_name, site, priority, category, status, team)
     VALUES ($1, $2, $3, $4, $5, $6, 'new', 'Field Ops')
     RETURNING id`,
    [payload.title, payload.description, payload.requester, payload.site, payload.priority, payload.category]
  );

  return getTicketById(inserted.id);
};

export const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
  const [row] = await query<{ id: string }>(
    `UPDATE tickets
       SET status = $2,
           updated_at = now()
     WHERE id = $1
     RETURNING id`,
    [ticketId, status]
  );

  if (!row) {
    throw new Error('Ticket not found');
  }

  return getTicketById(row.id);
};

interface CommentRow {
  id: string;
  ticket_id: string;
  author_name: string;
  author_role: string;
  body: string;
  visibility: 'public' | 'internal';
  created_at: Date;
}

const mapComment = (row: CommentRow) => ({
  id: row.id,
  ticketId: row.ticket_id,
  author: row.author_name,
  role: row.author_role as Comment['role'],
  body: row.body,
  visibility: row.visibility,
  createdAt: row.created_at.toISOString()
});

const commentFallback = [
  {
    id: 'demo-comment',
    ticketId: 'demo-1',
    author: 'Automation bot',
    role: 'admin' as const,
    body: 'Baseline comment placeholder—configure Supabase to store the real stream.',
    visibility: 'public' as const,
    createdAt: new Date().toISOString()
  }
];

export const listComments = async (ticketId: string) => {
  const rows = await query<CommentRow>(
    `SELECT id, ticket_id, author_name, author_role, body, visibility, created_at
       FROM ticket_comments
       WHERE ticket_id = $1
       ORDER BY created_at DESC`,
    [ticketId]
  );

  if (!rows.length) {
    return commentFallback.filter((demo) => demo.ticketId === ticketId);
  }

  return rows.map(mapComment);
};

export const addComment = async (ticketId: string, body: string, visibility: 'public' | 'internal') => {
  const [row] = await query<CommentRow>(
    `INSERT INTO ticket_comments (ticket_id, author_name, author_role, body, visibility)
     VALUES ($1, 'Admin Persona', 'admin', $2, $3)
     RETURNING id, ticket_id, author_name, author_role, body, visibility, created_at`,
    [ticketId, body, visibility]
  );

  return mapComment(row);
};

export const dashboardInsights = async () => {
  const [overview] = await query<{ total: number; breached: number; remote: number; awaiting: number }>(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'out_of_sla')::int AS breached,
            COUNT(*) FILTER (WHERE status = 'remote_required')::int AS remote,
            COUNT(*) FILTER (WHERE status = 'waiting_customer')::int AS awaiting
       FROM tickets`
  );

  const backlog = await query<TicketRow>(
    `SELECT t.id,
            t.title,
            t.description,
            r.full_name AS requester_name,
            t.requester_name AS requester_fallback,
            a.full_name AS assignee_name,
            t.assignee_name AS assignee_fallback,
            t.team,
            t.priority,
            t.status,
            t.sla_ends_at,
            t.updated_at,
            t.category,
            t.site
       FROM tickets t
       LEFT JOIN users r ON r.id = t.requester_id
       LEFT JOIN users a ON a.id = t.assignee_id
       ORDER BY t.updated_at DESC
       LIMIT 5`
  );

  const stats = [
    { label: 'Live tickets', value: overview?.total ?? 24, trend: 8, variant: 'positive' as const },
    { label: 'Out of SLA', value: overview?.breached ?? 2, trend: -4, variant: 'negative' as const },
    { label: 'Remote sessions', value: overview?.remote ?? 5, trend: 12, variant: 'positive' as const },
    { label: 'Waiting on users', value: overview?.awaiting ?? 3, trend: -6, variant: 'neutral' as const }
  ];

  return { stats, backlog: backlog.length ? backlog.map(mapTicket) : fallbackTickets };
};
