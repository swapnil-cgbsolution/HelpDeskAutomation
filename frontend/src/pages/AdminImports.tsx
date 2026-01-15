import LayoutShell from '../components/LayoutShell';
import { adminNav } from '../constants/nav';
import { useImportBatches } from '../hooks/useOperations';

const placeholder = Array.from({ length: 3 }, (_, index) => ({
  id: `batch-skeleton-${index}`,
  source: 'Loading...',
  schedule: '--',
  status: 'draft' as const,
  recordsTotal: 0,
  recordsSuccess: 0,
  errors: 0,
  createdAt: ''
}));

const AdminImports = () => {
  const { data: batches = [], isLoading } = useImportBatches();
  const displayCards = batches.length ? batches : placeholder;

  const formatSchedule = (schedule: string | undefined, createdAt?: string) => {
    if (schedule) {
      return schedule;
    }
    if (!createdAt) {
      return '—';
    }
    return new Date(createdAt).toLocaleString();
  };

  return (
    <LayoutShell
      title="Imports"
      subtitle="Matches the Import Data board: batch cards, timeline of refreshes, and audit table for error counts."
      navItems={adminNav}
      accent="amber"
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {displayCards.map((batch) => (
          <div key={batch.id} className="widget-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p className="eyebrow" style={{ color: 'var(--accent-blue-strong)' }}>{batch.id}</p>
            <h3 style={{ margin: 0 }}>{batch.source}</h3>
            <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>{formatSchedule(batch.schedule, batch.createdAt)}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span style={{ color: batch.errors ? '#ff6b6b' : 'var(--accent-teal)' }}>{batch.status}</span>
              <span>{batch.recordsTotal ?? 0} rows</span>
            </div>
          </div>
        ))}
      </section>

      <section className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Recent refreshes</h2>
          <button
            type="button"
            style={{
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-strong)',
              padding: '10px 18px',
              background: 'transparent',
              fontWeight: 600,
              color: 'var(--ink-600)'
            }}
          >
            Upload file
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--ink-400)', fontSize: '12px' }}>
              {['Batch', 'Source', 'Started', 'Records', 'Errors', 'Status'].map((heading) => (
                <th key={heading} className="eyebrow" style={{ paddingBottom: '8px' }}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(isLoading && !batches.length ? placeholder : batches).map((batch) => (
              <tr key={`${batch.id}-row`} style={{ borderTop: '1px solid var(--border-strong)' }}>
                <td style={{ padding: '12px 0' }}>{batch.id}</td>
                <td style={{ padding: '12px 0' }}>{batch.source}</td>
                <td style={{ padding: '12px 0', color: 'var(--ink-500)' }}>{formatSchedule(batch.schedule, batch.createdAt)}</td>
                <td style={{ padding: '12px 0' }}>{batch.recordsTotal ?? 0}</td>
                <td style={{ padding: '12px 0', color: batch.errors ? '#ff6b6b' : 'var(--ink-600)' }}>{batch.errors}</td>
                <td style={{ padding: '12px 0' }}>
                  <span className="pill" style={{ background: `${batch.errors ? '#ff6b6b22' : 'var(--accent-teal)22'}`, color: batch.errors ? '#ff6b6b' : 'var(--accent-teal)' }}>
                    {batch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </LayoutShell>
  );
};

export default AdminImports;
