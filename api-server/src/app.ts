import cors from 'cors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import router from './routes.js';

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(pinoHttp({
  redact: ['req.headers.authorization', 'req.headers.cookie'],
}));
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));
app.use('/api', router);

export default app;
