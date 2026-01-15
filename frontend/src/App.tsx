import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import AdminTicketDetail from './pages/AdminTicketDetail';
import AdminImports from './pages/AdminImports';
import AdminPeople from './pages/AdminPeople';
import AdminReports from './pages/AdminReports';
import AdminRemote from './pages/AdminRemote';
import AdminNotifications from './pages/AdminNotifications';
import EngineerDashboard from './pages/EngineerDashboard';
import EngineerTicketDetail from './pages/EngineerTicketDetail';
import EngineerTeam from './pages/EngineerTeam';
import EngineerRemote from './pages/EngineerRemote';
import EngineerApprovals from './pages/EngineerApprovals';
import UserHome from './pages/UserHome';
import UserNewTicket from './pages/UserNewTicket';
import UserTicketDetail from './pages/UserTicketDetail';
import UserNotifications from './pages/UserNotifications';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/tickets/:ticketId" element={<AdminTicketDetail />} />
      <Route path="/admin/imports" element={<AdminImports />} />
      <Route path="/admin/people" element={<AdminPeople />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/remote" element={<AdminRemote />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route path="/engineer" element={<EngineerDashboard />} />
      <Route path="/engineer/tickets/:ticketId" element={<EngineerTicketDetail />} />
      <Route path="/engineer/team" element={<EngineerTeam />} />
      <Route path="/engineer/remote" element={<EngineerRemote />} />
      <Route path="/engineer/approvals" element={<EngineerApprovals />} />
      <Route path="/user" element={<UserHome />} />
      <Route path="/user/tickets/new" element={<UserNewTicket />} />
      <Route path="/user/tickets/:ticketId" element={<UserTicketDetail />} />
      <Route path="/user/notifications" element={<UserNotifications />} />
    </Routes>
  </BrowserRouter>
);

export default App;
