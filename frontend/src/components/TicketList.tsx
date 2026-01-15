import { Link } from 'react-router-dom';
import { Ticket } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface TicketListProps {
  tickets: Ticket[];
  role: 'admin' | 'engineer' | 'user';
  compact?: boolean;
}

const statusConfig: Record<Ticket['status'], { color: string; bg: string; label: string }> = {
  new: { color: 'var(--status-open)', bg: 'rgba(59, 130, 246, 0.1)', label: 'New' },
  open: { color: 'var(--status-open)', bg: 'rgba(59, 130, 246, 0.1)', label: 'Open' },
  in_progress: { color: 'var(--status-progress)', bg: 'rgba(139, 92, 246, 0.1)', label: 'In Progress' },
  waiting_customer: { color: 'var(--status-pending)', bg: 'rgba(245, 158, 11, 0.1)', label: 'Waiting Customer' },
  waiting_vendor: { color: 'var(--status-pending)', bg: 'rgba(245, 158, 11, 0.1)', label: 'Waiting Vendor' },
  remote_required: { color: 'var(--status-progress)', bg: 'rgba(139, 92, 246, 0.1)', label: 'Remote Required' },
  closed: { color: 'var(--status-resolved)', bg: 'rgba(16, 185, 129, 0.1)', label: 'Closed' },
  out_of_sla: { color: 'var(--accent-error)', bg: 'rgba(239, 68, 68, 0.1)', label: 'Out of SLA' }
};

const priorityConfig: Record<string, { color: string; icon: string }> = {
  critical: { color: 'var(--accent-error)', icon: '🔴' },
  high: { color: 'var(--status-pending)', icon: '🟡' },
  medium: { color: 'var(--status-open)', icon: '🔵' },
  low: { color: 'var(--ink-400)', icon: '⚪' }
};

const TicketList = ({ tickets, role, compact }: TicketListProps) => (
  <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: '40%' }}>Ticket</th>
          <th style={{ width: '15%' }}>Requester</th>
          <th style={{ width: '15%' }}>Assignee</th>
          <th style={{ width: '12%' }}>Status</th>
          <th style={{ width: '10%' }}>Priority</th>
          <th style={{ width: '8%' }}>Updated</th>
        </tr>
      </thead>
      <tbody>
        {tickets.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-400)' }}>
              No tickets found
            </td>
          </tr>
        ) : (
          tickets.map((ticket) => {
            const statusInfo = statusConfig[ticket.status];
            const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.medium;
            
            return (
              <tr key={ticket.id}>
                <td>
                  <Link 
                    to={`/${role === 'user' ? 'user' : role}/tickets/${ticket.id}`} 
                    style={{ 
                      fontWeight: 600,
                      color: 'var(--primary-500)',
                      display: 'block',
                      marginBottom: '4px'
                    }}
                  >
                    #{ticket.id} {ticket.title}
                  </Link>
                  <span style={{ fontSize: '12px', color: 'var(--ink-500)' }}>
                    {ticket.category}
                  </span>
                </td>
                <td>{ticket.requester}</td>
                <td>
                  {ticket.assignee ? (
                    <span>{ticket.assignee}</span>
                  ) : (
                    <span style={{ color: 'var(--ink-400)', fontStyle: 'italic' }}>Unassigned</span>
                  )}
                </td>
                <td>
                  <span
                    className="badge"
                    style={{
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '13px',
                    color: priorityInfo.color,
                    fontWeight: 500
                  }}>
                    <span style={{ fontSize: '10px' }}>{priorityInfo.icon}</span>
                    <span style={{ textTransform: 'capitalize' }}>{ticket.priority}</span>
                  </span>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--ink-500)' }}>
                  {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: false })}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

export default TicketList;
