-- Reconcile RC Trails registrations that show captured in the final payment report
-- but remained pending in the registrations table.

UPDATE public.registrations
SET
  payment_status = 'verified',
  payment_gateway_status = 'captured',
  payment_currency = 'INR',
  amount_paid = 100,
  transaction_id = 'pay_SWaRS7WH24JwcO',
  razorpay_order_id = 'order_SWaRLqkGWMyvLU'
WHERE id = 'cb0596aa-d0dc-4c00-9728-ad166a969215'
  AND email = 'sajjadansar30@gmail.com'
  AND payment_status = 'pending';

UPDATE public.registrations
SET
  payment_status = 'verified',
  payment_gateway_status = 'captured',
  payment_currency = 'INR',
  amount_paid = 100,
  transaction_id = 'pay_SWahIETtA6QdTj',
  razorpay_order_id = 'order_SWafyHqk6ZlR7B'
WHERE id = 'ac227ce2-2430-4b4f-a2e5-d4e435627f7b'
  AND email = 'johnpaul32404@gmail.com'
  AND payment_status = 'pending';

UPDATE public.registrations
SET
  payment_status = 'verified',
  payment_gateway_status = 'captured',
  payment_currency = 'INR',
  amount_paid = 100,
  transaction_id = 'pay_SWax2Fl8jQfeaa',
  razorpay_order_id = 'order_SWawvfjhcAkBS7'
WHERE id = 'f2bde0df-ffe0-4733-ab76-5148510ae4d8'
  AND email = 'riyashussain100@gmail.com'
  AND payment_status = 'pending';

UPDATE public.registrations
SET
  payment_status = 'verified',
  payment_gateway_status = 'captured',
  payment_currency = 'INR',
  amount_paid = 100,
  transaction_id = 'pay_SWbALkyVdDB92a',
  razorpay_order_id = 'order_SWbAJ4W5OrHkBX'
WHERE id = '821ccf3c-ca30-4ea8-8e5f-ff702f3a8729'
  AND email = 'afeefahamed44@gmail.com'
  AND payment_status = 'pending';
