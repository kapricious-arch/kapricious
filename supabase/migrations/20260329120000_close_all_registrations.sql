CREATE OR REPLACE FUNCTION public.create_or_refresh_pending_registration(
  p_name text,
  p_email text,
  p_phone text,
  p_college text,
  p_event_id uuid,
  p_department_id uuid,
  p_entry_code text,
  p_amount_paid numeric,
  p_team_size integer,
  p_team_members jsonb
)
RETURNS TABLE (
  id uuid,
  entry_code text,
  payment_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Registrations are closed for all events.';
END;
$$;
