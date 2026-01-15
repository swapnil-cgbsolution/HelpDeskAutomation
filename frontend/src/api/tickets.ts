import { apiClient } from './client';
import { InsightStat, Ticket, TicketComment, TicketStatus } from '../types';

export const fetchTickets = (params?: Record<string, string>) => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return apiClient.get<Ticket[]>(`/api/tickets${query}`);
};

export const fetchTicket = (ticketId: string) =>
  apiClient.get<Ticket>(`/api/tickets/${ticketId}`);

export const fetchTicketComments = (ticketId: string) =>
  apiClient.get<TicketComment[]>(`/api/tickets/${ticketId}/comments`);

export const createTicket = (payload: {
  title: string;
  description: string;
  requester: string;
  site: string;
  priority: Ticket['priority'];
  category: string;
}) => apiClient.post<Ticket>('/api/tickets', payload);

export const updateTicketStatus = (ticketId: string, status: TicketStatus) =>
  apiClient.patch<Ticket>(`/api/tickets/${ticketId}/status`, { status });

export const addTicketComment = (ticketId: string, body: string, visibility: TicketComment['visibility']) =>
  apiClient.post<TicketComment>(`/api/tickets/${ticketId}/comments`, { body, visibility });

export const fetchInsights = () =>
  apiClient.get<{ stats: InsightStat[]; backlog: Ticket[] }>(`/api/metrics/dashboard`);
