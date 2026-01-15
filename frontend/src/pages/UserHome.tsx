import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import LayoutShell from '../components/LayoutShell';
import TicketList from '../components/TicketList';
import { useTickets } from '../hooks/useTickets';
import { userNav } from '../constants/nav';
import { TicketStatus } from '../types';

type FilterKey = 'all' | 'open' | 'waiting' | 'remote' | 'sla' | 'closed';

const filterConfig: Record<Exclude<FilterKey, 'all'>, TicketStatus[]> = {
  open: ['new', 'open', 'in_progress'],
  waiting: ['waiting_customer', 'waiting_vendor'],
  remote: ['remote_required'],
  sla: ['out_of_sla'],
  closed: ['closed']
};

const pillPalette: Record<FilterKey, string> = {
  all: 'var(--primary-500)',
  open: 'var(--status-open)',
  waiting: 'var(--status-pending)',
  remote: 'var(--status-progress)',
  sla: 'var(--accent-error)',
  closed: 'var(--status-closed)'
};

const UserHome = () => {
  const { data: tickets = [] } = useTickets({ scope: 'user' });
  const [filter, setFilter] = useState<FilterKey>('all');

  const counts = useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        if (filterConfig.open.includes(ticket.status)) acc.open += 1;
        if (filterConfig.waiting.includes(ticket.status)) acc.waiting += 1;
        if (filterConfig.remote.includes(ticket.status)) acc.remote += 1;
        if (filterConfig.sla.includes(ticket.status)) acc.sla += 1;
        if (ticket.status === 'closed') acc.closed += 1;
        return acc;
      },
      { open: 0, waiting: 0, remote: 0, sla: 0, closed: 0 }
    );
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (filter === 'all') {
      return tickets;
    }
    const statuses = filterConfig[filter];
    return tickets.filter((ticket) => statuses.includes(ticket.status));
  }, [tickets, filter]);

  const nextSla = useMemo(() => {
    const upcoming = tickets
      .filter((ticket) => Boolean(ticket.slaEndsAt))
      .sort((a, b) => new Date(a.slaEndsAt ?? '').getTime() - new Date(b.slaEndsAt ?? '').getTime());
    return upcoming[0];
  }, [tickets]);

  return (
    <LayoutShell
      title="My Tickets"
      subtitle="View and manage your support requests"
      navItems={userNav}
      accent="user"
      actions={
        <Link
          to="/user/tickets/new"
          className="btn btn-primary"
        >
          <span>➕</span>
          New Ticket
        </Link>
      }
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[{
          label: 'Open Tickets',
          value: counts.open,
          chip: '+12%',
          color: pillPalette.open
        },
        {
          label: 'Awaiting Response',
          value: counts.waiting,
          chip: 'Action Needed',
          color: pillPalette.waiting
        },
        {
          label: 'Remote Sessions',
          value: counts.remote,
          chip: 'Ready',
          color: pillPalette.remote
        },
        {
          label: 'Resolved',
          value: counts.closed,
          chip: 'This Month',
          color: pillPalette.closed
        }].map((card) => (
          <div key={card.label} className="card" style={{ padding: '20px' }}>
            <span className="label" style={{ fontSize: '12px', color: 'var(--ink-500)' }}>{card.label}</span>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink-900)', marginTop: '8px' }}>
              {card.value}
            </div>
            <span
              className="badge"
              style={{
                marginTop: '12px',
                background: `${card.color}22`,
                color: card.color
              }}
            >
              {card.chip}
            </span>
          </div>
        ))}
      </section>

      <section style={{ marginTop: '24px', display: 'grid', gap: '24px', gridTemplateColumns: '2fr 1fr' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0 }}>Ticket queue</h2>
              <span style={{ color: 'var(--ink-400)', fontSize: '14px' }}>{filteredTickets.length} showing</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {(Object.keys(pillPalette) as FilterKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className="pill"
                  style={{
                    border: '1px solid var(--border-strong)',
                    background: filter === key ? pillPalette[key] : 'transparent',
                    color: filter === key ? '#fff' : 'var(--ink-600)',
                    cursor: 'pointer'
                  }}
                >
                  {key === 'all' ? 'All tickets' : key.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <TicketList tickets={filteredTickets} role="user" compact />
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', background: 'var(--panel-highlight)' }}>
            <p className="eyebrow" style={{ color: pillPalette.sla }}>SLA timer</p>
            {nextSla ? (
              <>
                <h3 style={{ margin: '8px 0 4px' }}>{formatDistanceToNow(new Date(nextSla.slaEndsAt ?? ''), { addSuffix: true })}</h3>
                <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>{nextSla.title}</p>
                <Link to={`/user/tickets/${nextSla.id}`} style={{ marginTop: '12px', display: 'inline-flex', gap: '6px', fontWeight: 600, color: 'var(--accent-blue-strong)' }}>
                  Review ticket →
                </Link>
              </>
            ) : (
              <p style={{ marginTop: '8px', color: 'var(--ink-500)' }}>No timers running right now.</p>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Remote session</h3>
            <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>
              Matches the “remote session” tile from the Figma boards. Launch when an engineer requests screen sharing or device control.
            </p>
            <button
              type="button"
              style={{
                width: '100%',
                borderRadius: '16px',
                border: 'none',
                padding: '14px',
                background: 'var(--gradient-pill)',
                color: '#fff',
                fontWeight: 600,
                marginTop: '12px'
              }}
            >
              Share access code
            </button>
          </div>
        </aside>
      </section>
    </LayoutShell>
  );
};

export default UserHome;
