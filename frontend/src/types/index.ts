export type TicketStatus =
  | 'new'
  | 'open'
  | 'in_progress'
  | 'waiting_customer'
  | 'waiting_vendor'
  | 'remote_required'
  | 'closed'
  | 'out_of_sla';

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  assignee?: string;
  team: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TicketStatus;
  slaEndsAt?: string;
  updatedAt: string;
  category: string;
  site: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: string;
  avatar?: string;
  role: 'admin' | 'engineer' | 'user';
  body: string;
  createdAt: string;
  visibility: 'public' | 'internal';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  audience: 'admin' | 'engineer' | 'user';
}

export interface InsightStat {
  label: string;
  value: number;
  trend: number;
  variant?: 'positive' | 'negative' | 'neutral';
}

export interface ImportBatch {
  id: string;
  source: string;
  status: 'draft' | 'running' | 'completed' | 'failed';
  recordsTotal: number;
  recordsSuccess: number;
  errors: number;
  schedule?: string;
  actor?: string;
  createdAt: string;
}

export interface RemoteSession {
  id: string;
  ticketId: string;
  state: 'scheduled' | 'live' | 'closed';
  provider: string;
  pin?: string;
  startedAt?: string;
  endedAt?: string;
  ticketTitle?: string;
  requester?: string;
  site?: string;
}

export interface TicketApproval {
  id: string;
  ticketId: string;
  approverId?: string;
  approverName?: string;
  state: 'pending' | 'approved' | 'rejected';
  note?: string;
  createdAt: string;
  ticketTitle?: string;
}

export interface TeamRosterEntry {
  id?: string;
  name: string;
  role: string;
  status: 'Online' | 'Remote' | 'Away';
  team?: string;
  skills?: string[];
  load?: string;
}
