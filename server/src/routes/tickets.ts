import { Router } from 'express';
import { z } from 'zod';
import {
  addComment,
  createTicket,
  dashboardInsights,
  getTicketById,
  listComments,
  listTickets,
  updateTicketStatus
} from '../services/ticketService';

const router = Router();

router.get('/tickets', async (req, res, next) => {
  try {
    const tickets = await listTickets(req.query.scope?.toString());
    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

router.post('/tickets', async (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(3),
      description: z.string().min(10),
      requester: z.string().min(3),
      site: z.string().min(2),
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
      category: z.string().min(2)
    });
    const payload = schema.parse(req.body);
    const ticket = await createTicket(payload);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
});

router.get('/tickets/:ticketId', async (req, res, next) => {
  try {
    const ticket = await getTicketById(req.params.ticketId);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

router.patch('/tickets/:ticketId/status', async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.enum(['new', 'open', 'in_progress', 'waiting_customer', 'waiting_vendor', 'remote_required', 'closed', 'out_of_sla'])
    });
    const payload = schema.parse(req.body);
    const ticket = await updateTicketStatus(req.params.ticketId, payload.status);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

router.get('/tickets/:ticketId/comments', async (req, res, next) => {
  try {
    const comments = await listComments(req.params.ticketId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.post('/tickets/:ticketId/comments', async (req, res, next) => {
  try {
    const schema = z.object({
      body: z.string().min(2),
      visibility: z.enum(['public', 'internal'])
    });
    const payload = schema.parse(req.body);
    const comment = await addComment(req.params.ticketId, payload.body, payload.visibility);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

router.get('/metrics/dashboard', async (_req, res, next) => {
  try {
    const payload = await dashboardInsights();
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

export default router;
