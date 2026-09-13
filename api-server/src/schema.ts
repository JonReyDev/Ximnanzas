import { date, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const prospectsTable = pgTable('prospects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const appointmentsTable = pgTable('appointments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  date: date('date', { mode: 'string' }).notNull(),
  time: text('time').notNull(),
  topic: text('topic').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
