interface PagePlaceholderProps {
  heading: string;
  body: string;
  hint?: string;
}

const PagePlaceholder = ({ heading, body, hint }: PagePlaceholderProps) => (
  <div
    style={{
      borderRadius: 'var(--radius-large)',
      border: '1px dashed var(--border-strong)',
      padding: '32px',
      background: 'var(--panel-muted)',
      textAlign: 'left'
    }}
  >
    <h2 style={{ marginTop: 0 }}>{heading}</h2>
    <p style={{ color: 'var(--ink-500)', maxWidth: '720px' }}>{body}</p>
    {hint && (
      <p
        style={{
          marginTop: '12px',
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--ink-400)'
        }}
      >
        {hint}
      </p>
    )}
  </div>
);

export default PagePlaceholder;
