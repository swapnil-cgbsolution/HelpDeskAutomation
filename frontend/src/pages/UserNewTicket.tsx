import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import LayoutShell from '../components/LayoutShell';
import { createTicket } from '../api/tickets';
import { userNav } from '../constants/nav';
import { Ticket } from '../types';

type TicketDraft = {
  title: string;
  description: string;
  requester: string;
  site: string;
  priority: Ticket['priority'];
  category: string;
};

const priorityOptions: Ticket['priority'][] = ['low', 'medium', 'high', 'urgent'];

const UserNewTicket = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<TicketDraft>({
    title: '',
    description: '',
    requester: '',
    site: '',
    priority: 'medium',
    category: 'Hardware'
  });

  const mutation = useMutation({
    mutationFn: () => createTicket(form),
    onSuccess: (ticket) => navigate(`/user/tickets/${ticket.id}`)
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate();
  };

  const handleChange = <K extends keyof TicketDraft>(key: K, value: TicketDraft[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <LayoutShell
      title="Create ticket"
      subtitle="Matches the 'User new ticket' board: simple stacked form with priority tabs and attachment affordances."
      navItems={userNav}
      accent="violet"
    >
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px', maxWidth: '720px' }}>
        {['title', 'requester', 'site'].map((field) => (
          <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{field}</span>
            <input
              required
              value={form[field as 'title' | 'requester' | 'site']}
              onChange={(event) => handleChange(field as 'title' | 'requester' | 'site', event.target.value)}
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-strong)',
                padding: '14px',
                background: 'var(--panel-muted)',
                color: 'var(--ink-900)'
              }}
            />
          </label>
        ))}

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Category</span>
          <select
            value={form.category}
            onChange={(event) => handleChange('category', event.target.value)}
            style={{
              borderRadius: '16px',
              padding: '14px',
              background: 'var(--panel-muted)',
              color: 'var(--ink-900)',
              border: '1px solid var(--border-strong)'
            }}
          >
            {['Hardware', 'Software', 'Network', 'Access'].map((option) => (
              <option key={option} value={option} style={{ color: '#111322' }}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Priority</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {priorityOptions.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => handleChange('priority', priority)}
                style={{
                  flex: '1 1 120px',
                  borderRadius: '18px',
                  padding: '14px',
                  border: '1px solid var(--border-strong)',
                  background: form.priority === priority ? 'var(--gradient-pill)' : 'transparent',
                  color: form.priority === priority ? '#fff' : 'var(--ink-900)',
                  textTransform: 'capitalize'
                }}
              >
                {priority}
              </button>
            ))}
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Description</span>
          <textarea
            required
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
            rows={6}
            style={{
              borderRadius: '20px',
              border: '1px solid var(--border-strong)',
              padding: '16px',
              background: 'var(--panel-muted)',
              color: 'var(--ink-900)'
            }}
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isPending}
          style={{
            borderRadius: '999px',
            border: 'none',
            padding: '14px',
            background: 'var(--gradient-pill)',
            color: '#fff',
            fontWeight: 600
          }}
        >
          {mutation.isPending ? 'Dispatching…' : 'Submit ticket'}
        </button>
      </form>
    </LayoutShell>
  );
};

export default UserNewTicket;
