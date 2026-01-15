import { useParams } from 'react-router-dom';
import { useTicket } from '../hooks/useTickets';
import LayoutShell from '../components/LayoutShell';
import Timeline from '../components/Timeline';
import { engineerDetailNav } from '../constants/nav';

const EngineerTicketDetail = () => {
  const { ticketId } = useParams();
  const { data: ticket } = useTicket(ticketId);

  if (!ticket) {
    return null;
  }

  return (
    <LayoutShell title={`Working: ${ticket.title}`} subtitle={`${ticket.requester} · ${ticket.site}`} navItems={engineerDetailNav(ticket.id)} accent="teal">
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <h2>Activity timeline</h2>
          <Timeline
            items={[
              { label: 'Ticket accepted by you', timestamp: new Date(ticket.updatedAt).toLocaleString(), meta: ticket.team },
              {
                label: 'Remote diagnostics requested',
                timestamp: new Date(ticket.updatedAt).toLocaleString(),
                meta: 'Awaiting user confirmation'
              }
            ]}
          />
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Remote session</h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '14px' }}>
            Mirrors the remote page in the engineer prototype—session pin, voice channel toggle, device telemetry. Hook up with the real
            remote-control provider when ready.
          </p>
          <button
            style={{
              width: '100%',
              borderRadius: '16px',
              padding: '14px',
              border: 'none',
              background: 'var(--accent-teal)',
              color: '#041421',
              fontWeight: 600
            }}
          >
            Generate session pin
          </button>
        </div>
      </section>
    </LayoutShell>
  );
};

export default EngineerTicketDetail;
