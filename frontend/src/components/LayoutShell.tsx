import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface LayoutShellProps {
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  accent?: 'admin' | 'engineer' | 'user';
  actions?: ReactNode;
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

const accentColors: Record<NonNullable<LayoutShellProps['accent']>, string> = {
  admin: 'var(--primary-500)',
  engineer: 'var(--status-progress)',
  user: 'var(--accent-info)'
};

const LayoutShell = ({ title, subtitle, navItems, accent = 'admin', actions, children, breadcrumbs }: LayoutShellProps) => {
  const location = useLocation();
  const [sidebarCollapsed] = useState(false);
  
  const accentColor = accentColors[accent];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--page-bg)' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '16px',
              flexShrink: 0
            }}
          >
            HD
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Help Desk</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', textTransform: 'capitalize' }}>
                {accent} Portal
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const active = item.href === location.pathname;
            return (
              <Link
                key={item.href}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  margin: '2px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--sidebar-active)' : 'transparent',
                  color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: active ? 600 : 500,
                  fontSize: '14px',
                  borderLeft: active ? `3px solid ${accentColor}` : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--sidebar-hover)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }
                }}
              >
                {item.icon && (
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                )}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px'
          }}
        >
          {!sidebarCollapsed && (
            <>
              <div style={{ fontWeight: 600, color: 'white' }}>System User</div>
              <div style={{ marginTop: '4px' }}>v1.0.0</div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Bar */}
        <header
          style={{
            background: 'white',
            borderBottom: '1px solid var(--border-light)',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--ink-500)' }}>
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {crumb.href ? (
                      <Link to={crumb.href} style={{ color: 'var(--primary-500)', hover: { textDecoration: 'underline' } }}>
                        {crumb.label}
                      </Link>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                    {idx < breadcrumbs.length - 1 && <span>/</span>}
                  </span>
                ))}
              </div>
            )}
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--ink-900)' }}>{title}</h1>
            {subtitle && (
              <p style={{ marginTop: '4px', color: 'var(--ink-500)', fontSize: '14px' }}>{subtitle}</p>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{actions}</div>
          )}
        </header>

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: '24px 32px',
            overflowY: 'auto'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutShell;
