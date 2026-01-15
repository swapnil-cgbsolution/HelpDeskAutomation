import LayoutShell from '../components/LayoutShell';
import { engineerNav } from '../constants/nav';
import { useRoster } from '../hooks/useRemote';
import { TeamRosterEntry } from '../types';

const escalations = [
  { id: 'ESC-902', requester: 'User · D. Khan', target: 'Apps stack', state: 'Waiting' },
  { id: 'ESC-903', requester: 'Admin · H. Wu', target: 'Network edge', state: 'Accepted' }
];

const fallbackDetail = {
  name: 'Priya Kulkarni',
  timezone: 'UTC+5:30',
  badges: ['On remote', 'Camera ready'],
  bio: 'Senior engineer covering application stack escalations and remote approvals.',
  stats: [
    { label: 'Tickets this week', value: '14' },
    { label: 'Approvals cleared', value: '6' },
    { label: 'Avg. handle', value: '11m' }
  ]
};

const EngineerTeam = () => {
  const { data: roster = [], isLoading } = useRoster();
  const placeholders: TeamRosterEntry[] = isLoading && !roster.length ? Array.from({ length: 4 }, (_, idx) => ({ id: `placeholder-${idx}`, name: 'Loading...', role: '--', status: 'Remote', skills: [], load: '--' })) : [];
  const rosterDisplay = roster.length ? roster : placeholders;
  const focus = roster[0]
    ? {
        name: roster[0].name,
        timezone: 'Local',
        badges: ['Live', roster[0].status],
        bio: `${roster[0].role} covering ${roster[0].team ?? 'core operations'}.`,
        stats: fallbackDetail.stats
      }
    : fallbackDetail;

  return (
    <LayoutShell
      title="Team mates"
      subtitle="Presence, skills, and escalations per the engineer roster board."
      navItems={engineerNav}
      accent="teal"
    >
      <section style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>Live roster</h2>
            <button type="button" style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-pill)', padding: '10px 18px', background: 'transparent', fontWeight: 600 }}>Filter</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {rosterDisplay.map((engineer) => (
              <article key={engineer.id ?? engineer.name} className="widget-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{engineer.name}</p>
                    <p style={{ margin: 0, color: 'var(--ink-500)' }}>{engineer.role}</p>
                  </div>
                  <span className="pill" style={{ background: 'var(--panel-highlight)', color: engineer.status === 'Online' ? 'var(--accent-teal)' : engineer.status === 'Remote' ? '#c07aff' : '#ffb347', fontWeight: 600 }}>{engineer.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(engineer.skills?.length ? engineer.skills : ['Console']).map((skill) => (
                    <span key={skill} className="pill" style={{ background: 'var(--panel-muted)', color: 'var(--ink-600)', fontWeight: 600 }}>{skill}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--ink-500)' }}>{engineer.load ?? '2 tickets'}</span>
                  <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--accent-blue-strong)', fontWeight: 600 }}>Ping</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="eyebrow" style={{ margin: 0, color: 'var(--ink-400)' }}>Focus engineer</p>
                <h3 style={{ margin: '4px 0 0' }}>{focus.name}</h3>
                <p style={{ margin: 0, color: 'var(--ink-500)' }}>{focus.bio}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 600 }}>{focus.timezone}</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {focus.badges.map((badge) => (
                    <span key={badge} className="pill" style={{ background: 'var(--panel-highlight)', color: 'var(--accent-teal)', fontWeight: 600 }}>{badge}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginTop: '16px' }}>
              {focus.stats.map((stat) => (
                <article key={stat.label} className="widget-card" style={{ padding: '14px' }}>
                  <p style={{ margin: 0, color: 'var(--ink-500)' }}>{stat.label}</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{stat.value}</p>
                </article>
              ))}
            </div>
            <button type="button" style={{ marginTop: '16px', border: 'none', borderRadius: 'var(--radius-pill)', padding: '10px 18px', background: 'var(--accent-blue)', color: '#fff', fontWeight: 600 }}>Start swarm</button>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>Escalations</h3>
              <button type="button" style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-pill)', padding: '8px 14px', background: 'transparent', fontWeight: 600 }}>Create</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {escalations.map((item) => (
                <li key={item.id} style={{ border: '1px solid var(--border-strong)', borderRadius: '16px', padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <p className="eyebrow" style={{ margin: 0, color: 'var(--ink-400)' }}>{item.id}</p>
                    <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{item.requester}</p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.target}</p>
                  <span className="pill" style={{ background: 'var(--panel-highlight)', color: item.state === 'Waiting' ? '#f07f2e' : 'var(--accent-teal)', fontWeight: 600 }}>{item.state}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </LayoutShell>
  );
};

export default EngineerTeam;
