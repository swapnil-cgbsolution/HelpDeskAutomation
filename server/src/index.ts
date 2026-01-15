import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pino from 'pino-http';
import { env } from './config/env';
import operationsRouter from './routes/operations';
import ticketsRouter from './routes/tickets';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(pino());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', ticketsRouter);
app.use('/api', operationsRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(400).json({ message: error.message });
});

app.listen(env.port, () => {
  console.log(`API listening on port ${env.port}`);
});
