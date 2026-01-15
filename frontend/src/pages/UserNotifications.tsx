import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import LayoutShell from '../components/LayoutShell';
import PagePlaceholder from '../components/PagePlaceholder';
import { userNav } from '../constants/nav';
import { useTickets } from '../hooks/useTickets';

type NotificationKind = 'sla' | 'remote' | 'waiting' | 'closed';

const badgePalette: Record<NotificationKind, string> = {
  sla: '#ff6b6b',
  remote: 'var(--accent-blue-strong)',
  waiting: 'var(--accent-amber)',
  closed: 'var(--accent-lime)'
};

const UserNotifications = () => {
  const { data: tickets = [] } = useTickets({ scope: 'user' });

  const notifications = useMemo(() => {
    const items = tickets.flatMap((ticket) => {
      const baseDate = new Date(ticket.updatedAt);
      const rows: Array<{
        id: string;
        title: string;
        body: string;
        kind: NotificationKind;
        createdAt: Date;
        href: string;
      }> = [];

      if (ticket.status === 'out_of_sla') {
        rows.push({
          id: `${ticket.id}-sla`,
          title: `${ticket.title} is trending past SLA`,
          body: 'Engineers escalated this request. Add context or attachments so they can close faster.',
          kind: 'sla',
          createdAt: baseDate,
          href: `/user/tickets/${ticket.id}`
        });
      }

      if (ticket.status === 'remote_required') {
        rows.push({
          id: `${ticket.id}-remote`,
          title: `Remote assist requested for ${ticket.title}`,
          body: 'Join the secure session and keep your device online while the engineer troubleshoots.',
          kind: 'remote',
          createdAt: baseDate,
          href: `/user/tickets/${ticket.id}`
        });
      }

      if (ticket.status === 'waiting_customer' || ticket.status === 'waiting_vendor') {
        rows.push({
          id: `${ticket.id}-waiting`,
          title: `Action needed on ${ticket.title}`,
          body: 'Reply to the latest comment so we can resume work. The SLA pause mirrors the Figma notifications sheet.',
          kind: 'waiting',
          createdAt: baseDate,
          href: `/user/tickets/${ticket.id}`
        });
      }

      if (ticket.status === 'closed') {
        rows.push({
          id: `${ticket.id}-closed`,
          title: `${ticket.title} closed`,
          body: 'Review the resolution summary and mark the session as satisfied—or reopen if the issue reappears.',
          kind: 'closed',
          createdAt: baseDate,
          href: `/user/tickets/${ticket.id}`
        });
      }

      return rows;
    });

    return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [tickets]);

  return (
    <LayoutShell
      title="Notifications"
      subtitle="Exactly like the Figma notifications drawer: SLA alerts, remote session invites, and closure summaries."
      navItems={userNav}
      accent="violet"
    >
      {notifications.length === 0 ? (
        <PagePlaceholder
          heading="Inbox"
          body="Once data plugs in, notifications scoped to the current requester will render here with the same styling as the exported boards."
          hint="User · Notifications"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map((item) => (
            <div key={item.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span className="pill" style={{ background: `${badgePalette[item.kind]}22`, color: badgePalette[item.kind] }}>{item.title}</span>
                <span style={{ color: 'var(--ink-400)', fontSize: '13px' }}>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
              </div>
              <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>{item.body}</p>
              <Link to={item.href} style={{ fontWeight: 600, color: 'var(--accent-blue-strong)' }}>
                View ticket →
              </Link>
            </div>
          ))}
        </div>
      )}
    </LayoutShell>
  );
};

export default UserNotifications;
