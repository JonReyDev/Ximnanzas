import { Router } from 'express';
import { desc } from 'drizzle-orm';
import { db, pool } from './db.js';
import { requireProspectsAuth } from './auth.js';
import { appointmentsTable, prospectsTable } from './schema.js';
import { z } from 'zod';

const router = Router();
const prospectInput = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  message: z.string().trim().optional(),
});
const appointmentInput = prospectInput.omit({ message: true }).extend({
  date: z.string().date(),
  time: z.string().trim().min(1),
  topic: z.string().trim().min(1),
});

router.get('/healthz', async (_request, response) => {
  await pool.query('select 1');
  response.json({ status: 'ok' });
});

router.get('/prospects', requireProspectsAuth, async (_request, response) => {
  const rows = await db.select().from(prospectsTable).orderBy(desc(prospectsTable.createdAt));
  response.json(rows);
});

router.post('/prospects', async (request, response) => {
  const parsed = prospectInput.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: 'Revisa los datos del formulario.' });
    return;
  }
  const [prospect] = await db.insert(prospectsTable).values(parsed.data).returning();
  response.status(201).json(prospect);
});

router.get('/appointments', requireProspectsAuth, async (_request, response) => {
  const rows = await db.select().from(appointmentsTable).orderBy(desc(appointmentsTable.createdAt));
  response.json(rows);
});

router.post('/appointments', async (request, response) => {
  const parsed = appointmentInput.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: 'Revisa los datos de la cita.' });
    return;
  }
  const [appointment] = await db.insert(appointmentsTable).values(parsed.data).returning();
  response.status(201).json(appointment);
});

export default router;
