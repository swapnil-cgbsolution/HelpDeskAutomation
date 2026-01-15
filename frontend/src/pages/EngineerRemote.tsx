import LayoutShell from '../components/LayoutShell';
import { engineerNav } from '../constants/nav';
import { useRemoteSessions } from '../hooks/useRemote';

const quickActions = ['Lock console', 'Share camera', 'Escalate', 'End session'];

const healthMetrics = [
  { label: 'Latency', value: '48 ms', tone: 'positive' },
  { label: 'Packet loss', value: '0.6%', tone: 'alert' },
  { label: 'Camera FPS', value: '24', tone: 'neutral' },
  { label: 'Audio status', value: 'Stable', tone: 'positive' }
];

const formatTime = (value?: string) => (value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--');
const formatDuration = (value?: string) => {
  if (!value) return '--';
  const diffMs = Date.now() - new Date(value).getTime();
  if (diffMs <= 0) return '--';
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} elapsed`;
};

const defaultTimeline = [
  { time: '12:07', label: 'Config backup stored', tone: 'positive' },
  { time: '12:02', label: 'Session resumed after approval', tone: 'neutral' },
  { time: '11:55', label: 'Camera feed muted by requester', tone: 'neutral' }
];

const EngineerRemote = () => {
  const { data: sessions = [], isLoading } = useRemoteSessions();
  const liveSession = sessions.find((session) => session.state === 'live') ?? sessions[0];

  const sessionTimeline = liveSession
    ? [
        { time: formatTime(liveSession.startedAt), label: 'Session started', tone: 'positive' as const },
        liveSession.endedAt ? { time: formatTime(liveSession.endedAt), label: 'Session closed', tone: 'neutral' as const } : null
      ].filter(Boolean)
    : [];

  const timeline = sessionTimeline.length ? sessionTimeline : defaultTimeline;

  return (
    <LayoutShell
      title="Remote console"
      subtitle="Session console, chat, and controls the way the engineer board depicts."
      navItems={engineerNav}
      accent="teal"
    >
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
      <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p className="eyebrow" style={{ margin: 0, color: 'var(--ink-400)' }}>{liveSession?.ticketTitle ?? 'No session selected'}</p>
            <h2 style={{ margin: 0 }}>Session pin {liveSession?.pin ?? '-- -- --'}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--ink-500)' }}>{liveSession?.site ?? 'Select a session to see details'}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="pill" style={{ background: 'var(--panel-highlight)', color: 'var(--accent-teal)', fontWeight: 600 }}>{liveSession?.state ?? 'Idle'}</span>
            <button type="button" style={{ border: 'none', borderRadius: 'var(--radius-pill)', padding: '10px 18px', background: 'var(--accent-blue)', color: '#fff', fontWeight: 600 }}>End session</button>
          </div>
        </div>
        <div className="widget-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderRadius: '24px' }}>
          <div>
            <p style={{ margin: 0, color: 'var(--ink-500)' }}>Uptime</p>
            <p style={{ margin: 0, fontWeight: 600 }}>{formatDuration(liveSession?.startedAt)}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--ink-500)' }}>Channel</p>
            <p style={{ margin: 0, fontWeight: 600 }}>{liveSession?.provider ?? 'Switchboard console'}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--ink-500)' }}>Controls</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Mic', 'Camera', 'Console'].map((control) => (
                <button key={control} type="button" style={{ border: '1px solid var(--border-strong)', borderRadius: '50%', width: '40px', height: '40px', background: 'transparent', fontWeight: 600 }}>{control[0]}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0 }}>Chat</h3>
            <div style={{ color: 'var(--ink-500)', fontSize: '14px' }}>
              {liveSession ? (
                <p style={{ margin: 0 }}>Requester · {liveSession.requester ?? '--'} · {formatTime(liveSession.startedAt)}</p>
              ) : (
                <p style={{ margin: 0 }}>Chat transcript will surface once a session is live.</p>
              )}
            </div>
            <textarea
              placeholder="Type update"
              style={{ borderRadius: '16px', border: '1px solid var(--border-strong)', padding: '10px', background: 'var(--panel-muted)', minHeight: '72px' }}
            />
            <button type="button" style={{ alignSelf: 'flex-end', border: 'none', borderRadius: 'var(--radius-pill)', padding: '8px 16px', background: 'var(--accent-teal)', color: '#fff', fontWeight: 600 }}>Send</button>
          </div>

          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ margin: 0 }}>Timeline</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {timeline.map((entry) => (
                <li key={entry.label} style={{ display: 'flex', gap: '12px' }}>
                  <span className="eyebrow" style={{ width: '48px', color: 'var(--ink-400)' }}>{entry.time}</span>
                  <span style={{ fontWeight: 600, color: entry.tone === 'positive' ? 'var(--accent-teal)' : entry.tone === 'alert' ? '#ff6b6b' : 'var(--ink-600)' }}>{entry.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0 }}>Quick actions</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {quickActions.map((action) => (
              <button key={action} type="button" style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-pill)', padding: '10px 18px', background: 'transparent', fontWeight: 600 }}>{action}</button>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Session health</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
            {healthMetrics.map((metric) => (
              <article key={metric.label} className="widget-card" style={{ padding: '14px' }}>
                <p style={{ margin: 0, color: 'var(--ink-500)' }}>{metric.label}</p>
                <p style={{ margin: 0, fontWeight: 600, color: metric.tone === 'alert' ? '#ff6b6b' : metric.tone === 'positive' ? 'var(--accent-teal)' : 'var(--ink-600)' }}>{metric.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  </LayoutShell>
  );
};

export default EngineerRemote;
