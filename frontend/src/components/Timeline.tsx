interface TimelineItem {
  label: string;
  timestamp: string;
  meta?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline = ({ items }: TimelineProps) => (
  <ul style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: 0 }}>
    {items.map((item) => (
      <li
        key={item.label + item.timestamp}
        style={{
          display: 'flex',
          gap: '16px',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '8px',
            borderRadius: '999px',
            background: 'var(--accent-blue-strong)',
            flexShrink: 0,
            marginTop: '4px'
          }}
        />
        <div
          style={{
            background: 'var(--panel-muted)',
            borderRadius: 'var(--radius-medium)',
            padding: '12px 16px',
            border: '1px solid var(--border-strong)',
            flex: 1
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{item.label}</p>
          {item.meta && <p style={{ margin: '6px 0 0', color: 'var(--ink-400)' }}>{item.meta}</p>}
          <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ink-400)' }}>{item.timestamp}</p>
        </div>
      </li>
    ))}
  </ul>
);

export default Timeline;
