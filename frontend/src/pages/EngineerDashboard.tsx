import LayoutShell from '../components/LayoutShell';
import TicketList from '../components/TicketList';
import { useTickets } from '../hooks/useTickets';
import { engineerNav } from '../constants/nav';

const EngineerDashboard = () => {
  const { data: tickets = [] } = useTickets({ scope: 'engineer' });

  return (
    <LayoutShell
      title="Engineer Dashboard"
      subtitle="Manage assigned tickets, collaborate with team members, and initiate remote support sessions"
      navItems={engineerNav}
      accent="engineer"
      actions={
        <button className="btn btn-primary">
          <span>💻</span>
          Start Remote Session
        </button>
      }
    >
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 340px' }}>
        {/* Ticket Queue */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>My Ticket Queue</h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-500)', marginTop: '2px' }}>
              {tickets.length} active assignments
            </p>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <TicketList tickets={tickets} role="engineer" />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Team Status */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Team Status</h3>
            </div>
            <div className="card-body">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'Anika Kumar', dept: 'Networking', status: 'online' },
                  { name: 'Prakash Singh', dept: 'Field Support', status: 'online' },
                  { name: 'Rita Patel', dept: 'Applications', status: 'away' }
                ].map((mate) => (
                  <li key={mate.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{mate.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-500)' }}>{mate.dept}</div>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: mate.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: mate.status === 'online' ? 'var(--accent-success)' : 'var(--status-pending)'
                      }}
                    >
                      {mate.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Quick Actions</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                📋 View Approvals
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                💬 Team Chat
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                📊 My Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
};

export default EngineerDashboard;
