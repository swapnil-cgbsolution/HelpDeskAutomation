import { Link } from 'react-router-dom';

const Landing = () => (
  <div style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', minHeight: '100vh', padding: '0' }}>
    {/* Top Navigation Bar */}
    <nav style={{ 
      background: 'rgba(255, 255, 255, 0.05)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--primary-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '18px'
        }}>
          HD
        </div>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>HelpDesk Automation</span>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/admin" className="btn btn-secondary" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          Sign In
        </Link>
      </div>
    </nav>

    {/* Hero Section */}
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ 
          display: 'inline-block',
          padding: '8px 16px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#66b0ff',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          Enterprise IT Service Management
        </div>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 700, 
          color: 'white', 
          marginBottom: '24px',
          lineHeight: '1.2'
        }}>
          Streamline Your IT Operations
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: 'rgba(255, 255, 255, 0.8)', 
          maxWidth: '720px', 
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Comprehensive helpdesk automation platform designed for enterprise teams. 
          Manage tickets, track SLAs, coordinate remote support, and maintain service excellence.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/admin" className="btn btn-primary" style={{ 
            padding: '14px 32px',
            fontSize: '16px',
            boxShadow: '0 10px 30px rgba(0, 112, 243, 0.3)'
          }}>
            Access Portal
          </Link>
          <button className="btn" style={{ 
            padding: '14px 32px',
            fontSize: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            View Documentation
          </button>
        </div>
      </div>

      {/* Portal Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginTop: '80px'
      }}>
        {[
          {
            path: '/admin',
            icon: '📊',
            label: 'Administrator Portal',
            description: 'Full system oversight with analytics, user management, SLA tracking, and automated workflows.',
            features: ['Dashboard & Analytics', 'Team Management', 'System Configuration', 'Reports & Exports'],
            color: 'var(--primary-500)'
          },
          {
            path: '/engineer',
            icon: '🔧',
            label: 'Engineer Portal',
            description: 'Efficient ticket resolution with team collaboration, remote access tools, and approval workflows.',
            features: ['Ticket Queue', 'Team Collaboration', 'Remote Sessions', 'Approvals'],
            color: 'var(--status-progress)'
          },
          {
            path: '/user',
            icon: '🎫',
            label: 'End User Portal',
            description: 'Simplified ticket submission and tracking with real-time updates and support communication.',
            features: ['Submit Tickets', 'Track Progress', 'View History', 'Notifications'],
            color: 'var(--accent-info)'
          }
        ].map((portal) => (
          <Link
            key={portal.path}
            to={portal.path}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: portal.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              {portal.icon}
            </div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: 'white',
              marginBottom: '12px'
            }}>
              {portal.label}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              {portal.description}
            </p>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {portal.features.map((feature, idx) => (
                <div key={idx} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  <span style={{ color: portal.color }}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '80px',
        paddingTop: '32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '13px'
      }}>
        <p>© 2026 HelpDesk Automation. Enterprise IT Service Management Platform.</p>
      </div>
    </div>
  </div>
);

export default Landing;
