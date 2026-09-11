ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Nuevo';

UPDATE leads
SET status = 'Nuevo'
WHERE status IS NULL OR status NOT IN ('Nuevo', 'Contactado', 'En seguimiento', 'Cerrado');

ALTER TABLE leads
  DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE leads
  ADD CONSTRAINT leads_status_check
  CHECK (status IN ('Nuevo', 'Contactado', 'En seguimiento', 'Cerrado'));