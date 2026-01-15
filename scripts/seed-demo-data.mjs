import { Client } from 'pg';

const client = process.env.DATABASE_URL
  ? new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Client({
      host: 'db.cojrmycyagfosqpxyswd.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'CGBindia!@#123',
      ssl: { rejectUnauthorized: false }
    });

const TEAM_SEEDS = [
  { name: 'Field Ops', scope: 'hardware' },
  { name: 'Network Guild', scope: 'network' },
  { name: 'Automation Lab', scope: 'platform' }
];

const USER_SEEDS = [
  { fullName: 'Priya Menon', email: 'priya@hat.demo', role: 'admin' },
  { fullName: 'Rahul Verma', email: 'rahul@hat.demo', role: 'engineer' },
  { fullName: 'Neha Gupta', email: 'neha@hat.demo', role: 'engineer' },
  { fullName: 'Automation Scheduler', email: 'scheduler@hat.demo', role: 'admin' }
];

const minutesAgo = (mins) => new Date(Date.now() - mins * 60000).toISOString();

const TICKET_SEEDS = [
  {
    slug: 'autopilotPatch',
    title: 'Autopilot patch window',
    description: 'Schedule Knightfall autopilot patch for APAC kiosks before 02:00 IST.',
    category: 'Software',
    priority: 'high',
    status: 'open',
    requester: 'Automation Scheduler',
    site: 'Gurgaon Hub',
    team: 'Automation Lab',
    assignee: 'Neha Gupta'
  },
  {
    slug: 'branchModem',
    title: 'Branch 47 modem outage',
    description: 'Primary MPLS circuit down; need remote hands for reboot + config capture.',
    category: 'Network',
    priority: 'urgent',
    status: 'remote_required',
    requester: 'Ops AI Bot',
    site: 'Branch 47',
    team: 'Network Guild',
    assignee: 'Rahul Verma'
  },
  {
    slug: 'coreRouter',
    title: 'Core router config drift',
    description: 'Checksum mismatch between golden template and DC2 router.',
    category: 'Network',
    priority: 'high',
    status: 'waiting_vendor',
    requester: 'Control Tower',
    site: 'DC-02',
    team: 'Network Guild',
    assignee: 'Neha Gupta'
  },
  {
    slug: 'factoryCamera',
    title: 'Factory camera recalibration',
    description: 'Line 3 camera needs remote realignment ahead of QA walkthrough.',
    category: 'Hardware',
    priority: 'medium',
    status: 'in_progress',
    requester: 'Plant Supervisor',
    site: 'Navi Mumbai Plant',
    team: 'Field Ops',
    assignee: 'Rahul Verma'
  }
];

const COMMENT_SEEDS = [
  {
    ticketSlug: 'autopilotPatch',
    author: 'Automation bot',
    role: 'admin',
    body: 'Patch scheduled for 01:30 IST. Waiting on user confirmation.',
    visibility: 'public'
  }
];

const NOTIFICATION_SEEDS = [
  {
    id: '11111111-0000-4000-8000-000000000101',
    title: 'Patch window scheduled',
    body: 'APAC kiosks update rolling tonight.',
    audience: 'user',
    ticketSlug: 'autopilotPatch'
  },
  {
    id: '11111111-0000-4000-8000-000000000102',
    title: 'Remote approval pending',
    body: 'RS-9043 is waiting for elevated approval.',
    audience: 'admin',
    ticketSlug: 'branchModem'
  },
  {
    id: '11111111-0000-4000-8000-000000000103',
    title: 'Camera handoff ready',
    body: 'Factory feed is ready for takeover.',
    audience: 'engineer',
    ticketSlug: 'factoryCamera'
  }
];

const REMOTE_SESSION_SEEDS = [
  {
    id: '22222222-0000-4000-8000-000000000201',
    ticketSlug: 'branchModem',
    state: 'live',
    provider: 'Switchboard console',
    pin: '274 998',
    startedAt: minutesAgo(12),
    endedAt: null
  },
  {
    id: '22222222-0000-4000-8000-000000000202',
    ticketSlug: 'coreRouter',
    state: 'scheduled',
    provider: 'Secure shell relay',
    pin: '118 442',
    startedAt: null,
    endedAt: null
  },
  {
    id: '22222222-0000-4000-8000-000000000203',
    ticketSlug: 'factoryCamera',
    state: 'closed',
    provider: 'Camera assist',
    pin: '552 903',
    startedAt: minutesAgo(45),
    endedAt: minutesAgo(15)
  }
];

const APPROVAL_SEEDS = [
  {
    id: '33333333-0000-4000-8000-000000000301',
    ticketSlug: 'branchModem',
    approverEmail: 'priya@hat.demo',
    approverName: 'Priya Menon',
    state: 'pending',
    note: 'Need supervisor sign-off before console unlock.'
  },
  {
    id: '33333333-0000-4000-8000-000000000302',
    ticketSlug: 'coreRouter',
    approverEmail: 'rahul@hat.demo',
    approverName: 'Rahul Verma',
    state: 'approved',
    note: 'Pulse check complete, proceed with vendor handoff.'
  }
];

const IMPORT_BATCH_SEEDS = [
  {
    slug: 'sapCmdb',
    id: '44444444-0000-4000-8000-000000000401',
    source: 'SAP CMDB',
    total: 1240,
    success: 1237,
    actorEmail: 'priya@hat.demo',
    status: 'completed',
    metadata: { schedule: 'Daily · 09:30', errors: 3 }
  },
  {
    slug: 'fieldDevices',
    id: '44444444-0000-4000-8000-000000000402',
    source: 'Field devices CSV',
    total: 742,
    success: 730,
    actorEmail: 'priya@hat.demo',
    status: 'running',
    metadata: { schedule: 'Queued', errors: 12 }
  },
  {
    slug: 'vendorPortal',
    id: '44444444-0000-4000-8000-000000000403',
    source: 'Vendor portal',
    total: 308,
    success: 0,
    actorEmail: 'priya@hat.demo',
    status: 'draft',
    metadata: { schedule: 'Every 4h', errors: 0 }
  }
];

const INVENTORY_ASSET_SEEDS = [
  {
    id: '55555555-0000-4000-8000-000000000501',
    serial: 'EDGE-88421',
    assetTag: 'NET-447',
    model: 'Switchboard S12',
    site: 'Branch 47',
    ownerEmail: 'rahul@hat.demo',
    batchSlug: 'sapCmdb'
  },
  {
    id: '55555555-0000-4000-8000-000000000502',
    serial: 'CAM-99231',
    assetTag: 'PLANT-33',
    model: 'LineCam XR',
    site: 'Navi Mumbai Plant',
    ownerEmail: 'neha@hat.demo',
    batchSlug: 'fieldDevices'
  }
];

const ensureTicket = async (ticket) => {
  const insert = await client.query(
    `WITH existing AS (SELECT id FROM tickets WHERE title = $1)
     INSERT INTO tickets (title, description, category, priority, status, requester_name, site, team, assignee_name)
     SELECT $1, $2, $3, $4, $5::ticket_status, $6, $7, $8, $9
     WHERE NOT EXISTS (SELECT 1 FROM existing)
     RETURNING id`,
    [ticket.title, ticket.description, ticket.category, ticket.priority, ticket.status, ticket.requester, ticket.site, ticket.team, ticket.assignee]
  );

  if (insert.rowCount) {
    return insert.rows[0].id;
  }

  const { rows } = await client.query('SELECT id FROM tickets WHERE title = $1 LIMIT 1', [ticket.title]);
  return rows[0]?.id;
};

const insertCommentIfMissing = async (comment, ticketId) => {
  await client.query(
    `INSERT INTO ticket_comments (ticket_id, author_name, author_role, body, visibility)
     SELECT $1, $2, $3, $4, $5
     WHERE NOT EXISTS (
       SELECT 1 FROM ticket_comments WHERE ticket_id = $1 AND author_name = $2 AND body = $4
     )`,
    [ticketId, comment.author, comment.role, comment.body, comment.visibility]
  );
};

const upsertNotification = async (notification, ticketId) => {
  await client.query(
    `INSERT INTO notifications (id, title, body, audience, ticket_id)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id)
     DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, audience = EXCLUDED.audience, ticket_id = EXCLUDED.ticket_id`,
    [notification.id, notification.title, notification.body, notification.audience, ticketId]
  );
};

const upsertRemoteSession = async (session, ticketId) => {
  await client.query(
    `INSERT INTO remote_sessions (id, ticket_id, state, provider, pin_code, started_at, ended_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id)
     DO UPDATE SET state = EXCLUDED.state, provider = EXCLUDED.provider, pin_code = EXCLUDED.pin_code,
                   started_at = EXCLUDED.started_at, ended_at = EXCLUDED.ended_at`,
    [session.id, ticketId, session.state, session.provider, session.pin, session.startedAt, session.endedAt]
  );
};

const upsertApproval = async (approval, ticketId, approverId) => {
  await client.query(
    `INSERT INTO ticket_approvals (id, ticket_id, approver_id, approver_name, state, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id)
     DO UPDATE SET state = EXCLUDED.state, note = EXCLUDED.note`,
    [approval.id, ticketId, approverId, approval.approverName, approval.state, approval.note]
  );
};

const upsertImportBatch = async (batch, actorId) => {
  await client.query(
    `INSERT INTO import_batches (id, source, records_total, records_success, actor_id, status, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id)
     DO UPDATE SET source = EXCLUDED.source, records_total = EXCLUDED.records_total,
                   records_success = EXCLUDED.records_success, actor_id = EXCLUDED.actor_id,
                   status = EXCLUDED.status, metadata = EXCLUDED.metadata`,
    [batch.id, batch.source, batch.total, batch.success, actorId, batch.status, batch.metadata]
  );
};

const upsertInventoryAsset = async (asset, ownerId, batchId) => {
  await client.query(
    `INSERT INTO inventory_assets (id, serial_number, asset_tag, model, site, owner_id, imported_from)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id)
     DO UPDATE SET serial_number = EXCLUDED.serial_number, asset_tag = EXCLUDED.asset_tag,
                   model = EXCLUDED.model, site = EXCLUDED.site, owner_id = EXCLUDED.owner_id,
                   imported_from = EXCLUDED.imported_from`,
    [asset.id, asset.serial, asset.assetTag, asset.model, asset.site, ownerId, batchId]
  );
};

try {
  await client.connect();

  for (const team of TEAM_SEEDS) {
    await client.query(
      `INSERT INTO teams (name, scope)
       VALUES ($1, $2)
       ON CONFLICT (name) DO NOTHING`,
      [team.name, team.scope]
    );
  }

  for (const user of USER_SEEDS) {
    await client.query(
      `INSERT INTO users (full_name, email, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [user.fullName, user.email, user.role]
    );
  }

  const { rows: userRows } = await client.query(
    'SELECT id, email FROM users WHERE email = ANY($1)',
    [USER_SEEDS.map((user) => user.email)]
  );

  const usersByEmail = Object.fromEntries(userRows.map((row) => [row.email, row.id]));
  const requireUserId = (email) => {
    const id = usersByEmail[email];
    if (!id) {
      throw new Error(`Seed user missing for ${email}`);
    }
    return id;
  };

  const ticketsBySlug = {};
  for (const ticket of TICKET_SEEDS) {
    const id = await ensureTicket(ticket);
    ticketsBySlug[ticket.slug] = id;
  }

  for (const comment of COMMENT_SEEDS) {
    await insertCommentIfMissing(comment, ticketsBySlug[comment.ticketSlug]);
  }

  for (const notification of NOTIFICATION_SEEDS) {
    await upsertNotification(notification, notification.ticketSlug ? ticketsBySlug[notification.ticketSlug] : null);
  }

  for (const session of REMOTE_SESSION_SEEDS) {
    await upsertRemoteSession(session, ticketsBySlug[session.ticketSlug]);
  }

  for (const approval of APPROVAL_SEEDS) {
    await upsertApproval(approval, ticketsBySlug[approval.ticketSlug], requireUserId(approval.approverEmail));
  }

  const batchIdsBySlug = {};
  for (const batch of IMPORT_BATCH_SEEDS) {
    const actorId = requireUserId(batch.actorEmail);
    await upsertImportBatch(batch, actorId);
    batchIdsBySlug[batch.slug] = batch.id;
  }

  for (const asset of INVENTORY_ASSET_SEEDS) {
    await upsertInventoryAsset(asset, requireUserId(asset.ownerEmail), batchIdsBySlug[asset.batchSlug]);
  }

  console.log('Seeded tickets, comments, notifications, remote sessions, approvals, and import data.');
} catch (error) {
  console.error('Failed to seed data');
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
