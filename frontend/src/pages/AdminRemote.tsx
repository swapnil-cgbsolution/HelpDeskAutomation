import LayoutShell from '../components/LayoutShell';
import { adminNav } from '../constants/nav';
import { useApprovals, useRemoteSessions } from '../hooks/useRemote';
import { RemoteSession, TicketApproval } from '../types';

const formatTime = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--');

const AdminRemote = () => {
  const { data: sessions = [], isLoading: sessionsLoading } = useRemoteSessions();
  const { data: approvals = [], isLoading: approvalsLoading } = useApprovals();
  const activity = sessions.slice(0, 3).map((session) => ({
    time: formatTime(session.startedAt),
    label: `${session.ticketTitle ?? 'Session'} · ${session.state}`,
    tone: session.state === 'live' ? 'positive' : session.state === 'closed' ? 'neutral' : 'alert'
  }));

  const placeholderSessions: RemoteSession[] = Array.from({ length: 3 }, (_, i) => ({
    id: `placeholder-${i}`,
    ticketId: 'placeholder',
    state: 'scheduled',
    provider: 'Loading',
    pin: '-- -- --'
  }));
  const placeholderApprovals: TicketApproval[] = Array.from({ length: 2 }, (_, i) => ({
    id: `placeholder-${i}`,
    ticketId: 'placeholder',
    state: 'pending',
    note: 'Loading',
    createdAt: new Date().toISOString()
  }));

  const sessionCards = sessions.length ? sessions : sessionsLoading ? placeholderSessions : [];
  const approvalList = approvals.length ? approvals : approvalsLoading ? placeholderApprovals : [];

  return (
    <LayoutShell
      title="Remote session orchestration"
      subtitle="Session queue, approvals, and audit activity just like the admin remote board."
      navItems={adminNav}
      accent="violet"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <section className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: '4px', color: 'var(--ink-400)' }}>Live sessions</p>
            <h2 style={{ margin: 0 }}>Console orchestration</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              style={{
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-strong)',
                padding: '10px 16px',
                background: 'transparent',
                fontWeight: 600
              }}
            >
              Pause all
            </button>
            <button
              type="button"
              style={{
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                padding: '10px 18px',
                background: 'var(--gradient-pill)',
                color: '#fff',
                fontWeight: 600
              }}
            >
              New session
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {sessionCards.map((session) => (
            <article key={session.id} className="widget-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>{session.id}</span>
                <span className="pill" style={{ background: 'var(--panel-highlight)', color: session.state === 'live' ? 'var(--accent-teal)' : session.state === 'closed' ? 'var(--accent-blue-strong)' : '#c07aff' }}>
                  {session.state ?? 'pending'}
                </span>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{session.requester ?? '--'}</p>
                <p style={{ margin: 0, color: 'var(--ink-500)', fontSize: '14px' }}>{session.site ?? '--'}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--ink-500)' }}>
                <span>{session.provider ?? 'Console'}</span>
                <span>Started {formatTime(session.startedAt)}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '16px',
                background: 'var(--panel-muted)'
              }}>
                <span style={{ fontWeight: 600, letterSpacing: '0.08em' }}>{session.pin ?? '-- -- --'}</span>
                <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--accent-blue-strong)', fontWeight: 600 }}>Copy</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Approvals queue</h3>
            <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--accent-blue-strong)', fontWeight: 600 }}>View policy</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {approvalList.map((approval) => (
              <li key={approval.id} style={{ border: '1px solid var(--border-strong)', borderRadius: '18px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>{approval.ticketTitle ?? approval.title}</span>
                  <span className="eyebrow" style={{ color: 'var(--ink-400)' }}>{approval.id}</span>
                </div>
                <p style={{ margin: '4px 0', color: 'var(--ink-500)' }}>Owner · {approval.approverName ?? '--'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ink-500)' }}>
                  <span>{approval.note ?? 'Awaiting note'}</span>
                  <span style={{ color: approval.state === 'pending' ? '#ff6b6b' : 'var(--accent-teal)', fontWeight: 600 }}>{approval.state}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button type="button" style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-pill)', padding: '8px 14px', background: 'transparent', fontWeight: 600 }}>Reject</button>
                  <button type="button" style={{ border: 'none', borderRadius: 'var(--radius-pill)', padding: '8px 18px', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600 }}>Approve</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Audit feed</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(activity.length ? activity : [{ time: '--', label: 'No recent activity', tone: 'neutral' as const }]).map((entry) => (
              <li key={entry.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--ink-500)' }}>{entry.time}</span>
                <span style={{ flex: 1, marginLeft: '12px', fontWeight: 600, color: entry.tone === 'alert' ? '#ff6b6b' : entry.tone === 'positive' ? 'var(--accent-teal)' : 'var(--ink-600)' }}>
                  {entry.label}
                </span>
              </li>
            ))}
          </ul>
          <button type="button" style={{ marginTop: '16px', border: 'none', background: 'transparent', color: 'var(--accent-blue-strong)', fontWeight: 600 }}>View audit trail</button>
        </div>
      </section>
    </div>
  </LayoutShell>
  );
};

export default AdminRemote;
