import { useMemo, useState } from 'react';
import LayoutShell from '../components/LayoutShell';
import { adminNav } from '../constants/nav';
import { useNotifications } from '../hooks/useNotifications';

const channels = ['All', 'SLA', 'Remote', 'Imports', 'People'] as const;

const AdminNotifications = () => {
  const [activeChannel, setActiveChannel] = useState<(typeof channels)[number]>('All');
  const { data: notifications = [], isLoading } = useNotifications('admin');

  const normalized = useMemo(
    () =>
      notifications.map((notification) => {
        const lowerTitle = notification.title.toLowerCase();
        let channel: (typeof channels)[number] = 'People';
        if (lowerTitle.includes('import')) channel = 'Imports';
        else if (lowerTitle.includes('remote')) channel = 'Remote';
        else if (notification.audience === 'admin') channel = 'SLA';
        else if (notification.audience === 'engineer') channel = 'Remote';

        return {
          id: notification.id,
          title: notification.title,
          detail: notification.body,
          channel,
          timestamp: new Date(notification.createdAt).toLocaleString()
        };
      }),
    [notifications]
  );

  const filler = isLoading && !normalized.length ? Array.from({ length: 3 }, (_, i) => ({ id: `placeholder-${i}`, title: 'Loading', detail: 'Fetching notifications…', channel: 'People', timestamp: '' })) : [];
  const filtered = (normalized.length ? normalized : filler).filter((item) => activeChannel === 'All' || item.channel === activeChannel);

  return (
    <LayoutShell
      title="Notifications"
      subtitle="Matches the admin broadcast board: filter pills, alert cards, and send buttons."
      navItems={adminNav}
      accent="amber"
    >
      <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0 }}>Ops alerts</h2>
            <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>Drive push/email announcements directly from here.</p>
          </div>
          <button
            type="button"
            style={{
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              padding: '12px 20px',
              background: 'var(--gradient-pill)',
              color: '#fff',
              fontWeight: 600
            }}
          >
            Compose alert
          </button>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
          {channels.map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => setActiveChannel(channel)}
              className="pill"
              style={{
                border: '1px solid var(--border-strong)',
                background: activeChannel === channel ? 'var(--accent-amber)' : 'transparent',
                color: activeChannel === channel ? '#15182c' : 'var(--ink-600)',
                cursor: 'pointer'
              }}
            >
              {channel}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map((item) => (
          <div key={item.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="pill" style={{ background: 'var(--panel-highlight)', color: 'var(--ink-600)' }}>{item.channel}</span>
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>{item.detail}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--ink-400)', fontSize: '12px' }}>{item.timestamp}</span>
              <button
                type="button"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-strong)',
                  padding: '8px 14px',
                  background: 'transparent',
                  fontWeight: 600,
                  color: 'var(--ink-600)'
                }}
              >
                Send now
              </button>
            </div>
          </div>
        ))}
      </section>
    </LayoutShell>
  );
};

export default AdminNotifications;
