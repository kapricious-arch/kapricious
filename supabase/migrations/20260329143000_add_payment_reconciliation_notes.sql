CREATE TABLE IF NOT EXISTS public.payment_reconciliation_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_email text NOT NULL,
  event_title text NOT NULL,
  payment_id text NOT NULL UNIQUE,
  order_id text,
  amount_paid numeric(10,2) NOT NULL,
  note_type text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_reconciliation_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment reconciliation notes"
ON public.payment_reconciliation_notes
FOR ALL
USING (public.has_role('admin', auth.uid()))
WITH CHECK (public.has_role('admin', auth.uid()));
