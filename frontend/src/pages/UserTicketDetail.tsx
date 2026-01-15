import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import LayoutShell from '../components/LayoutShell';
import Timeline from '../components/Timeline';
import { useTicket } from '../hooks/useTickets';
import { userNav } from '../constants/nav';
import { fetchTicketComments } from '../api/tickets';
import { TicketStatus } from '../types';

const statusColorMap: Record<TicketStatus, string> = {
  new: 'var(--accent-blue)',
  open: 'var(--accent-teal)',
  in_progress: 'var(--accent-teal)',
  waiting_customer: 'var(--accent-amber)',
  waiting_vendor: 'var(--accent-amber)',
  remote_required: 'var(--accent-blue-strong)',
  closed: 'var(--accent-lime)',
  out_of_sla: '#ff6b6b'
};

const UserTicketDetail = () => {
  const { ticketId } = useParams();
  const { data: ticket } = useTicket(ticketId);

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => {
      if (!ticketId) {
        throw new Error('Missing ticket id');
      }
      return fetchTicketComments(ticketId);
    },
    enabled: Boolean(ticketId)
  });

  if (!ticket) {
    return null;
  }

  const readableStatus = ticket.status.replace(/_/g, ' ');
  const slaCopy = ticket.slaEndsAt ? formatDistanceToNow(new Date(ticket.slaEndsAt), { addSuffix: true }) : 'Not set';

  const timelineItems = comments.length
    ? comments.map((note) => ({
        label: note.body,
        timestamp: new Date(note.createdAt).toLocaleString(),
        meta: `${note.author} · ${note.role}`
      }))
    : [
        {
          label: 'Ticket created',
          timestamp: new Date(ticket.updatedAt).toLocaleString(),
          meta: `${ticket.requester} submitted`
        }
      ];
  return (
    <LayoutShell title={ticket.title} subtitle={`${ticket.requester} · ${ticket.site}`} navItems={userNav} accent="violet">
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Updates timeline</h2>
              <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>Every admin/engineer comment pipes through the `/comments` endpoint.</p>
            </div>
            <span className="pill" style={{ background: `${statusColorMap[ticket.status]}22`, color: statusColorMap[ticket.status] }}>{readableStatus}</span>
          </div>
          <Timeline items={timelineItems} />
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              style={{
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-strong)',
                padding: '12px 20px',
                background: 'transparent',
                fontWeight: 600,
                color: 'var(--ink-600)'
              }}
            >
              Add comment
            </button>
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
              Attach file
            </button>
          </div>
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', background: 'var(--panel-highlight)' }}>
            <p className="eyebrow" style={{ color: '#ff6b6b' }}>SLA</p>
            <h3 style={{ margin: '8px 0 4px' }}>{slaCopy}</h3>
            <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>You’ll get the same SLA badge colors as the “User out of SLA” board.</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Ticket details</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[{ label: 'Requester', value: ticket.requester }, { label: 'Team', value: ticket.team }, { label: 'Site', value: ticket.site }].map((row) => (
                <li key={row.label} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-600)' }}>
                  <span style={{ fontWeight: 500 }}>{row.label}</span>
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Remote support</h3>
            <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>When engineers request access you’ll see the same CTA stack as in the Figma “remote session” card.</p>
            <Link to="/user" style={{ display: 'inline-flex', gap: '6px', marginTop: '12px', fontWeight: 600, color: 'var(--accent-blue-strong)' }}>
              View instructions →
            </Link>
          </div>
        </aside>
      </section>
    </LayoutShell>
  );
};

export default UserTicketDetail;
