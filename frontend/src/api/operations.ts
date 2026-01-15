import { apiClient } from './client';
import { ImportBatch, Notification, RemoteSession, TicketApproval, TeamRosterEntry } from '../types';

export const fetchImportBatches = () => apiClient.get<ImportBatch[]>('/api/import-batches');
export const fetchNotifications = (audience?: 'admin' | 'engineer' | 'user') =>
	apiClient.get<Notification[]>(`/api/notifications${audience ? `?audience=${audience}` : ''}`);
export const fetchRemoteSessions = () => apiClient.get<RemoteSession[]>('/api/remote-sessions');
export const fetchApprovals = () => apiClient.get<TicketApproval[]>('/api/approvals');
export const fetchRoster = () => apiClient.get<TeamRosterEntry[]>('/api/roster');
