-- Keep public forms insert-only. Administrative reads and changes require Supabase Auth.

DROP POLICY IF EXISTS "anon_select_leads" ON leads;
DROP POLICY IF EXISTS "anon_update_leads" ON leads;
DROP POLICY IF EXISTS "anon_delete_leads" ON leads;
DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;

DROP POLICY IF EXISTS "authenticated_manage_leads" ON leads;
CREATE POLICY "authenticated_manage_leads" ON leads
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_manage_appointments" ON appointments;
CREATE POLICY "authenticated_manage_appointments" ON appointments
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
