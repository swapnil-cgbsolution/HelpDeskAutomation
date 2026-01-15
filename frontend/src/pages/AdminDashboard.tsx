import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import LayoutShell from '../components/LayoutShell';
import StatCard from '../components/StatCard';
import TicketList from '../components/TicketList';
import Timeline from '../components/Timeline';
import { useTickets } from '../hooks/useTickets';
import { fetchInsights } from '../api/tickets';
import { adminNav } from '../constants/nav';

const AdminDashboard = () => {
  const { data: insights } = useQuery({ queryKey: ['insights'], queryFn: fetchInsights });
  const { data: tickets = [] } = useTickets({ scope: 'admin' });

  const backlog = useMemo(() => insights?.backlog ?? [], [insights]);

  return (
    <LayoutShell
      title="Admin Dashboard"
      subtitle="Monitor SLA compliance, team performance, and system health"
      navItems={adminNav}
      accent="admin"
      actions={
        <button className="btn btn-primary">
          <span>➕</span>
          New Automation
        </button>
      }
    >
      {/* Key Metrics Section */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--ink-700)' }}>Key Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {insights?.stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      </section>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 380px' }}>
        {/* Ticket List */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Active Tickets</h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-500)', marginTop: '2px' }}>
                Real-time sync • Updated 30s ago
              </p>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
              ⟲ Refresh
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <TicketList tickets={tickets} role="admin" />
          </div>
        </div>

        {/* Backlog Sidebar */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Backlog Pressure</h3>
            <p style={{ fontSize: '12px', color: 'var(--ink-500)', marginTop: '2px' }}>
              {backlog.length} items requiring attention
            </p>
          </div>
          <div className="card-body">
            <Timeline
              items={backlog.map((ticket) => ({
                label: ticket.title,
                timestamp: new Date(ticket.updatedAt).toLocaleString(),
                meta: `${ticket.team} · ${ticket.status.replace('_', ' ')}`
              }))}
            />
          </div>
        </div>
      </div>
    </LayoutShell>
  );
};

export default AdminDashboard;
