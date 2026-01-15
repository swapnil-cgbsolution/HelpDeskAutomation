import { query } from '../db/pool';
import { ImportBatch, RemoteSession, TicketApproval, TeamRosterEntry } from '../types';

interface ImportBatchRow {
  id: string;
  source: string;
  status: 'draft' | 'running' | 'completed' | 'failed';
  records_total: number;
  records_success: number;
  metadata: Record<string, unknown> | null;
  created_at: Date;
  actor_name: string | null;
}

const parseMetadata = (metadata: Record<string, unknown> | null) => ({
  schedule: typeof metadata?.schedule === 'string' ? metadata.schedule : undefined,
  errors: typeof metadata?.errors === 'number' ? metadata.errors : undefined
});

const mapImportBatch = (row: ImportBatchRow): ImportBatch => {
  const meta = parseMetadata(row.metadata);
  const calculatedErrors = meta.errors ?? Math.max(row.records_total - row.records_success, 0);

  return {
    id: row.id,
    source: row.source,
    status: row.status,
    recordsTotal: row.records_total,
    recordsSuccess: row.records_success,
    errors: calculatedErrors,
    schedule: meta.schedule,
    actor: row.actor_name ?? undefined,
    createdAt: row.created_at.toISOString()
  };
};

export const listImportBatches = async () => {
  const rows = await query<ImportBatchRow>(
    `SELECT b.id,
            b.source,
            b.status,
            b.records_total,
            b.records_success,
            b.metadata,
            b.created_at,
            u.full_name AS actor_name
       FROM import_batches b
       LEFT JOIN users u ON u.id = b.actor_id
       ORDER BY b.created_at DESC
       LIMIT 25`
  );

  return rows.map(mapImportBatch);
};

interface RemoteSessionRow {
  id: string;
  ticket_id: string;
  state: 'scheduled' | 'live' | 'closed';
  provider: string;
  pin_code: string | null;
  started_at: Date | null;
  ended_at: Date | null;
  ticket_title: string | null;
  requester_name: string | null;
  site: string | null;
}

const mapRemoteSession = (row: RemoteSessionRow): RemoteSession => ({
  id: row.id,
  ticketId: row.ticket_id,
  state: row.state,
  provider: row.provider,
  pin: row.pin_code ?? undefined,
  startedAt: row.started_at?.toISOString(),
  endedAt: row.ended_at?.toISOString(),
  ticketTitle: row.ticket_title ?? undefined,
  requester: row.requester_name ?? undefined,
  site: row.site ?? undefined
});

export const listRemoteSessions = async () => {
  const rows = await query<RemoteSessionRow>(
    `SELECT rs.id,
            rs.ticket_id,
            rs.state,
            rs.provider,
            rs.pin_code,
            rs.started_at,
            rs.ended_at,
            t.title AS ticket_title,
            t.requester_name,
            t.site
       FROM remote_sessions rs
       LEFT JOIN tickets t ON t.id = rs.ticket_id
       ORDER BY rs.created_at DESC
       LIMIT 30`
  );

  return rows.map(mapRemoteSession);
};

interface ApprovalRow {
  id: string;
  ticket_id: string;
  approver_id: string | null;
  approver_name: string | null;
  state: 'pending' | 'approved' | 'rejected';
  note: string | null;
  created_at: Date;
  ticket_title: string | null;
}

const mapApproval = (row: ApprovalRow): TicketApproval => ({
  id: row.id,
  ticketId: row.ticket_id,
  approverId: row.approver_id ?? undefined,
  approverName: row.approver_name ?? undefined,
  state: row.state,
  note: row.note ?? undefined,
  createdAt: row.created_at.toISOString(),
  ticketTitle: row.ticket_title ?? undefined
});

export const listApprovals = async () => {
  const rows = await query<ApprovalRow>(
    `SELECT ta.id,
            ta.ticket_id,
            ta.approver_id,
            ta.approver_name,
            ta.state,
            ta.note,
            ta.created_at,
            t.title AS ticket_title
       FROM ticket_approvals ta
       LEFT JOIN tickets t ON t.id = ta.ticket_id
       ORDER BY ta.created_at DESC
       LIMIT 30`
  );

  return rows.map(mapApproval);
};

interface RosterRow {
  id: string;
  full_name: string;
  role: string;
  team: string | null;
}

export const listRoster = async (): Promise<TeamRosterEntry[]> => {
  const rows = await query<RosterRow>(
    `SELECT u.id,
            u.full_name,
            u.role,
            tm.team_id,
            t.name AS team
       FROM users u
       LEFT JOIN team_memberships tm ON tm.user_id = u.id AND tm.is_primary IS TRUE
       LEFT JOIN teams t ON t.id = tm.team_id`
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.full_name,
    role: row.role,
    status: row.role === 'engineer' ? 'Online' : 'Remote',
    team: row.team ?? undefined,
    skills: row.role === 'engineer' ? ['Network', 'Console'] : ['Admin'],
    load: row.role === 'engineer' ? '2 tickets' : undefined
  }));
};
