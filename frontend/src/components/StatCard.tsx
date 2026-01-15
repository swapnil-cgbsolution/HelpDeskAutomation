import { InsightStat } from '../types';

interface StatCardProps extends InsightStat {
  icon?: string;
}

const StatCard = ({ label, value, trend, variant = 'neutral', icon }: StatCardProps) => {
  const variantConfig = {
    positive: { color: 'var(--accent-success)', bg: 'rgba(16, 185, 129, 0.1)', icon: '↗' },
    negative: { color: 'var(--accent-error)', bg: 'rgba(239, 68, 68, 0.1)', icon: '↘' },
    neutral: { color: 'var(--ink-400)', bg: 'rgba(107, 114, 128, 0.1)', icon: '→' }
  };

  const config = variantConfig[variant];

  return (
    <div
      className="card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'white'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <span className="label" style={{ fontSize: '12px', color: 'var(--ink-500)', marginBottom: '8px' }}>
            {label}
          </span>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            color: 'var(--ink-900)',
            lineHeight: 1,
            marginTop: '8px'
          }}>
            {value}
          </div>
        </div>
        {icon && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--panel-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {icon}
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        padding: '6px 10px',
        borderRadius: 'var(--radius-sm)',
        background: config.bg,
        width: 'fit-content'
      }}>
        <span style={{ color: config.color, fontSize: '14px', fontWeight: 600 }}>
          {config.icon}
        </span>
        <span style={{ color: config.color, fontSize: '13px', fontWeight: 600 }}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span style={{ color: 'var(--ink-500)', fontSize: '12px' }}>vs last period</span>
      </div>
    </div>
  );
};

export default StatCard;
