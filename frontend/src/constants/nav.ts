export const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/imports', label: 'Imports', icon: '📥' },
  { href: '/admin/people', label: 'People', icon: '👥' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' }
];

export const adminDetailNav = (ticketId: string) => [
  { href: `/admin/tickets/${ticketId}`, label: 'Overview', icon: '📋' },
  { href: '/admin/remote', label: 'Remote session', icon: '💻' },
  { href: '/admin/notifications', label: 'Notifications', icon: '🔔' }
];

export const engineerNav = [
  { href: '/engineer', label: 'Tickets', icon: '🎫' },
  { href: '/engineer/team', label: 'Team', icon: '👥' },
  { href: '/engineer/remote', label: 'Remote', icon: '💻' }
];

export const engineerDetailNav = (ticketId: string) => [
  { href: `/engineer/tickets/${ticketId}`, label: 'Timeline', icon: '⏱️' },
  { href: '/engineer/remote', label: 'Remote', icon: '💻' },
  { href: '/engineer/approvals', label: 'Approvals', icon: '✅' }
];

export const userNav = [
  { href: '/user', label: 'Open tickets', icon: '📝' },
  { href: '/user/tickets/new', label: 'New ticket', icon: '➕' },
  { href: '/user/notifications', label: 'Notifications', icon: '🔔' }
];
