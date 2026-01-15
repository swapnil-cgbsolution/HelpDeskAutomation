import { query } from '../db/pool';
import { Notification } from '../types';

interface NotificationRow {
  id: string;
  title: string;
  body: string;
  audience: 'admin' | 'engineer' | 'user';
  ticket_id: string | null;
  created_at: Date;
  ticket_title: string | null;
}

const mapNotification = (row: NotificationRow): Notification => ({
  id: row.id,
  title: row.title,
  body: row.body,
  audience: row.audience,
  ticketId: row.ticket_id ?? undefined,
  createdAt: row.created_at.toISOString()
});

export const listNotifications = async (audience?: 'admin' | 'engineer' | 'user') => {
  const params: unknown[] = [];
  const where = audience ? `WHERE n.audience = $${params.push(audience)}` : '';
  const rows = await query<NotificationRow>(
    `SELECT n.id,
            n.title,
            n.body,
            n.audience,
            n.ticket_id,
            n.created_at,
            t.title AS ticket_title
       FROM notifications n
       LEFT JOIN tickets t ON t.id = n.ticket_id
       ${where}
       ORDER BY n.created_at DESC
       LIMIT 40`
     ,
     params
  );

  return rows.map(mapNotification);
};
