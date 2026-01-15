import LayoutShell from '../components/LayoutShell';
import { adminNav } from '../constants/nav';

const kpis = [
  { label: 'Tickets resolved', value: '1,248', delta: '+12% WoW', tone: 'positive' },
  { label: 'Breached SLA', value: '18', delta: '−4 vs last week', tone: 'positive' },
  { label: 'Avg. handle time', value: '14m 22s', delta: '+32s', tone: 'neutral' },
  { label: 'Live backlog', value: '342', delta: '+31 overnight', tone: 'alert' }
];

const teams = [
  { name: 'Field Ops', sla: '98.4%', change: '+0.8%', breaches: 2 },
  { name: 'Apps Stack', sla: '96.1%', change: '+0.3%', breaches: 6 },
  { name: 'Network Edge', sla: '94.3%', change: '−1.4%', breaches: 9 }
];

const incidents = [
  { id: 'INC-3412', title: 'Firewall firmware rollbacks', owner: 'Network Edge', impact: 'Medium', updated: '10:24' },
  { id: 'INC-3421', title: 'ICS telemetry drift', owner: 'Field Ops', impact: 'High', updated: '09:57' },
  { id: 'INC-3432', title: 'Vendor modem outage', owner: 'Apps Stack', impact: 'Low', updated: '09:33' }
];

const AdminReports = () => (
  <LayoutShell
    title="Reports & statistics"
    subtitle="KPIs, SLA trend, and incident drilldowns as in the reporting mockups."
    navItems={adminNav}
    accent="amber"
  >
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
      {kpis.map((item) => (
        <article key={item.label} className="widget-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p className="eyebrow" style={{ color: 'var(--ink-400)', margin: 0 }}>{item.label}</p>
          <h2 style={{ margin: 0 }}>{item.value}</h2>
          <span style={{ fontWeight: 600, color: item.tone === 'alert' ? '#ff6b6b' : item.tone === 'positive' ? 'var(--accent-teal)' : 'var(--ink-500)' }}>{item.delta}</span>
        </article>
      ))}
    </section>

    <section style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '24px', marginTop: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>SLA trend</h3>
          <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--accent-blue-strong)', fontWeight: 600 }}>Export CSV</button>
        </div>
        <div style={{ height: '180px', background: 'linear-gradient(180deg, rgba(255, 215, 155, 0.5), transparent)', borderRadius: '20px', position: 'relative', marginTop: '12px' }}>
          <div style={{ position: 'absolute', inset: '16px', borderRadius: '16px', background: 'var(--panel-muted)' }} />
          <svg viewBox="0 0 320 120" style={{ position: 'absolute', inset: '32px', width: 'calc(100% - 64px)', height: 'calc(100% - 64px)' }}>
            <polyline
              fill="none"
              stroke="var(--accent-blue-strong)"
              strokeWidth="3"
              strokeLinecap="round"
              points="0,70 40,50 80,45 120,30 160,40 200,25 240,35 280,20 320,18"
            />
            <polyline
              fill="none"
              stroke="var(--accent-teal)"
              strokeWidth="2"
              strokeDasharray="6"
              points="0,80 40,65 80,60 120,55 160,58 200,50 240,48 280,44 320,40"
            />
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '13px', color: 'var(--ink-500)' }}>
          <span>Past 8 days</span>
          <span>Target SLA 97%</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Team performance</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-pill)', padding: '8px 14px', background: 'transparent', fontWeight: 600 }}>Week</button>
            <button type="button" style={{ border: 'none', borderRadius: 'var(--radius-pill)', padding: '8px 14px', background: 'var(--accent-blue)', color: '#fff', fontWeight: 600 }}>Month</button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--ink-400)', fontSize: '12px' }}>
              {['Team', 'SLA', 'Change', 'Breaches'].map((heading) => (
                <th key={heading} className="eyebrow" style={{ paddingBottom: '8px' }}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.name} style={{ borderTop: '1px solid var(--border-strong)' }}>
                <td style={{ padding: '12px 0', fontWeight: 600 }}>{team.name}</td>
                <td style={{ padding: '12px 0' }}>{team.sla}</td>
                <td style={{ padding: '12px 0', color: team.change.startsWith('−') ? '#ff6b6b' : 'var(--accent-teal)' }}>{team.change}</td>
                <td style={{ padding: '12px 0' }}>{team.breaches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section style={{ marginTop: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Incident spotlight</h3>
          <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--accent-blue-strong)', fontWeight: 600 }}>Create report</button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {incidents.map((incident) => (
            <li key={incident.id} style={{ borderRadius: '18px', border: '1px solid var(--border-strong)', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: '12px', alignItems: 'center' }}>
              <div>
                <p className="eyebrow" style={{ margin: 0, color: 'var(--ink-400)' }}>{incident.id}</p>
                <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{incident.title}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--ink-500)' }}>Owner</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{incident.owner}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--ink-500)' }}>Impact</p>
                <span className="pill" style={{ background: 'var(--panel-highlight)', color: incident.impact === 'High' ? '#ff6b6b' : incident.impact === 'Medium' ? '#f07f2e' : 'var(--accent-teal)', fontWeight: 600 }}>
                  {incident.impact}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: 'var(--ink-500)' }}>Updated</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{incident.updated}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </LayoutShell>
);

export default AdminReports;
