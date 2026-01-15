import LayoutShell from '../components/LayoutShell';
import { engineerNav } from '../constants/nav';
import { useApprovals } from '../hooks/useRemote';

const defaultPolicies = [
  { title: 'Privileged change', description: 'Requires MFA + supervisor review', status: 'Active' },
  { title: 'Camera assist', description: 'Auto timeout after 15m idle', status: 'Updating' }
];

const formatTime = (stamp?: string) => (stamp ? new Date(stamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

const EngineerApprovals = () => {
  const { data: approvals = [], isLoading } = useApprovals();
  const pending = approvals.filter((approval) => approval.state === 'pending');
  const history = approvals.filter((approval) => approval.state !== 'pending').slice(0, 5);

  const placeholder = isLoading && !approvals.length ? Array.from({ length: 2 }, (_, idx) => ({ id: `placeholder-${idx}` })) : [];

  return (
    <LayoutShell
      title="Approvals"
      subtitle="Quickly approve or decline work before remote consoles unlock."
      navItems={engineerNav}
      accent="teal"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <section className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p className="eyebrow" style={{ margin: 0, color: 'var(--ink-400)' }}>Queue</p>
              <h2 style={{ margin: 0 }}>Pending decisions</h2>
            </div>
            <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--accent-blue-strong)', fontWeight: 600 }}>View history</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(pending.length ? pending : placeholder).map((entry) => (
              <article key={entry.id} style={{ border: '1px solid var(--border-strong)', borderRadius: '20px', padding: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                <div>
                  <p className="eyebrow" style={{ margin: 0, color: 'var(--ink-400)' }}>{entry.id ?? '--'}</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{entry.ticketTitle ?? 'Loading approval'}</p>
                  <p style={{ margin: 0, color: 'var(--ink-500)', fontSize: '14px' }}>{entry.note ?? 'Awaiting note'}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--ink-500)' }}>Requester</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{entry.approverName ?? '--'}</p>
                  <p style={{ margin: 0, color: '#ff6b6b', fontWeight: 600 }}>{formatTime(entry.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-pill)', padding: '10px 16px', background: 'transparent', fontWeight: 600 }}>Decline</button>
                  <button type="button" style={{ border: 'none', borderRadius: 'var(--radius-pill)', padding: '10px 18px', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600 }}>Approve</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Recent activity</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(history.length ? history : placeholder).map((row) => (
                <li key={row.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--ink-500)' }}>{formatTime(row.createdAt)}</span>
                  <span style={{ flex: 1, marginLeft: '12px' }}>{row.ticketTitle ?? 'Approval update'}</span>
                  <span style={{ color: row.state === 'rejected' ? '#ff6b6b' : 'var(--accent-teal)' }}>{row.state ?? '--'}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Policies</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {defaultPolicies.map((policy) => (
                <li key={policy.title} style={{ border: '1px solid var(--border-strong)', borderRadius: '16px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{policy.title}</p>
                      <p style={{ margin: 0, color: 'var(--ink-500)' }}>{policy.description}</p>
                    </div>
                    <span className="pill" style={{ background: 'var(--panel-highlight)', color: policy.status === 'Active' ? 'var(--accent-teal)' : '#c07aff', fontWeight: 600 }}>{policy.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </LayoutShell>
  );
};

export default EngineerApprovals;
