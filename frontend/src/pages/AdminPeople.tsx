import LayoutShell from '../components/LayoutShell';
import { adminNav } from '../constants/nav';

const teammates = [
  { name: 'Anika Shah', role: 'Admin', team: 'Networking', status: 'Online' },
  { name: 'Marcus Lee', role: 'Engineer', team: 'Field Ops', status: 'Remote' },
  { name: 'Priya Kulkarni', role: 'Engineer', team: 'Applications', status: 'Offline' },
  { name: 'Diego Ramirez', role: 'Admin', team: 'Security', status: 'Online' }
];

const AdminPeople = () => (
  <LayoutShell
    title="People & permissions"
    subtitle="Matches the people boards: directory cards, quick actions, and add-engineer forms."
    navItems={adminNav}
    accent="amber"
  >
    <section style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Team directory</h2>
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
            + Add engineer
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--ink-400)', fontSize: '12px' }}>
              {['Name', 'Role', 'Team', 'Status', 'Actions'].map((heading) => (
                <th key={heading} className="eyebrow" style={{ paddingBottom: '8px' }}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teammates.map((mate) => (
              <tr key={mate.name} style={{ borderTop: '1px solid var(--border-strong)' }}>
                <td style={{ padding: '12px 0', fontWeight: 600 }}>{mate.name}</td>
                <td style={{ padding: '12px 0' }}>{mate.role}</td>
                <td style={{ padding: '12px 0' }}>{mate.team}</td>
                <td style={{ padding: '12px 0' }}>
                  <span className="pill" style={{ background: 'var(--panel-highlight)', color: mate.status === 'Online' ? 'var(--accent-teal)' : 'var(--ink-600)' }}>
                    {mate.status}
                  </span>
                </td>
                <td style={{ padding: '12px 0' }}>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--accent-blue-strong)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Invite form</h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>Hook this form to the `/api/users` endpoint when ready.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {['Full name', 'Email', 'Team'].map((label) => (
              <input
                key={label}
                placeholder={label}
                style={{
                  borderRadius: '16px',
                  border: '1px solid var(--border-strong)',
                  padding: '12px',
                  background: 'var(--panel-muted)'
                }}
              />
            ))}
            <button
              type="button"
              style={{
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                padding: '12px',
                background: 'var(--accent-blue)',
                color: '#fff',
                fontWeight: 600
              }}
            >
              Send invite
            </button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Access summary</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Admins: 6', 'Engineers: 18', 'Requesters: 1.2k'].map((row) => (
              <li key={row} style={{ color: 'var(--ink-600)', fontWeight: 600 }}>{row}</li>
            ))}
          </ul>
          <button
            type="button"
            style={{
              marginTop: '12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-strong)',
              padding: '10px 16px',
              background: 'transparent',
              fontWeight: 600,
              color: 'var(--ink-600)'
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
    </section>
  </LayoutShell>
);

export default AdminPeople;
