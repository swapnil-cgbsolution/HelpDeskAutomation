import { Router } from 'express';
import { listImportBatches, listRemoteSessions, listApprovals, listRoster } from '../services/operationsService';
import { listNotifications } from '../services/notificationService';

const router = Router();

router.get('/import-batches', async (_req, res, next) => {
  try {
    const batches = await listImportBatches();
    res.json(batches);
  } catch (error) {
    next(error);
  }
});

router.get('/remote-sessions', async (_req, res, next) => {
  try {
    const sessions = await listRemoteSessions();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

router.get('/approvals', async (_req, res, next) => {
  try {
    const approvals = await listApprovals();
    res.json(approvals);
  } catch (error) {
    next(error);
  }
});

router.get('/roster', async (_req, res, next) => {
  try {
    const roster = await listRoster();
    res.json(roster);
  } catch (error) {
    next(error);
  }
});

router.get('/notifications', async (req, res, next) => {
  try {
    const audience = req.query.audience?.toString() as 'admin' | 'engineer' | 'user' | undefined;
    const notifications = await listNotifications(audience);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

export default router;
