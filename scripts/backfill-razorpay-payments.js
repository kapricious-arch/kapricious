import { createClient } from "@supabase/supabase-js";

const DEFAULT_EVENT_TITLE = "Star of Kapricious";

function parseArgs(argv) {
  const options = {
    commit: false,
    eventTitle: DEFAULT_EVENT_TITLE,
    limit: null,
    registrationId: null,
  };

  for (const arg of argv) {
    if (arg === "--commit") {
      options.commit = true;
      continue;
    }
    if (arg.startsWith("--event-title=")) {
      options.eventTitle = arg.slice("--event-title=".length).trim() || DEFAULT_EVENT_TITLE;
      continue;
    }
    if (arg.startsWith("--limit=")) {
      const parsed = Number(arg.slice("--limit=".length));
      if (Number.isFinite(parsed) && parsed > 0) options.limit = parsed;
      continue;
    }
    if (arg.startsWith("--registration-id=")) {
      options.registrationId = arg.slice("--registration-id=".length).trim() || null;
    }
  }

  return options;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildBasicAuth(keyId, secret) {
  return Buffer.from(`${keyId}:${secret}`).toString("base64");
}

async function razorpayGet(pathname, authHeader) {
  const response = await fetch(`https://api.razorpay.com/v1${pathname}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload?.error?.description ||
      payload?.error?.reason ||
      `Razorpay request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

function selectBestOrderPayment(orderPayments) {
  const items = Array.isArray(orderPayments?.items) ? orderPayments.items : [];
  if (!items.length) return null;

  const rankedStatuses = ["captured", "authorized", "created"];
  for (const status of rankedStatuses) {
    const match = items
      .filter((item) => item?.status === status)
      .sort((a, b) => Number(b?.created_at || 0) - Number(a?.created_at || 0))[0];
    if (match) return match;
  }

  return items.sort((a, b) => Number(b?.created_at || 0) - Number(a?.created_at || 0))[0] || null;
}

function normalizeAmount(amountInSubunits) {
  const rupees = Number(amountInSubunits || 0) / 100;
  return Number.isFinite(rupees) ? Number(rupees.toFixed(2)) : null;
}

function isMissingBackfillData(row) {
  return (
    row.amount_paid == null ||
    !row.payment_currency ||
    !row.payment_gateway_status ||
    !row.razorpay_order_id ||
    row.payment_status !== "verified"
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const razorpayKeyId = requireEnv("RAZORPAY_KEY_ID");
  const razorpaySecret = requireEnv("RAZORPAY_KEY_SECRET");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const razorpayAuth = buildBasicAuth(razorpayKeyId, razorpaySecret);

  let eventIds = null;
  if (!options.registrationId) {
    const { data: events, error: eventError } = await supabase
      .from("events")
      .select("id, title")
      .eq("title", options.eventTitle);

    if (eventError) throw eventError;
    if (!events?.length) {
      throw new Error(`No events found with title "${options.eventTitle}".`);
    }

    eventIds = events.map((event) => event.id);
  }

  let query = supabase
    .from("registrations")
    .select(
      "id, name, email, created_at, event_id, transaction_id, razorpay_order_id, amount_paid, payment_currency, payment_gateway_status, payment_status",
    )
    .order("created_at", { ascending: false });

  if (options.registrationId) {
    query = query.eq("id", options.registrationId);
  } else if (eventIds?.length === 1) {
    query = query.eq("event_id", eventIds[0]);
  } else if (eventIds?.length) {
    query = query.in("event_id", eventIds);
  }

  const { data: registrations, error: registrationError } = await query;
  if (registrationError) throw registrationError;

  const candidates = (registrations || [])
    .filter((row) => row.transaction_id || row.razorpay_order_id)
    .filter(isMissingBackfillData)
    .slice(0, options.limit ?? undefined);

  if (!candidates.length) {
    console.log("No matching registrations need backfill.");
    return;
  }

  console.log(
    `${options.commit ? "Committing" : "Previewing"} Razorpay backfill for ${candidates.length} registration(s).`,
  );

  const summary = {
    scanned: candidates.length,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0,
  };

  for (const row of candidates) {
    try {
      let payment = null;

      if (row.transaction_id) {
        payment = await razorpayGet(`/payments/${row.transaction_id}`, razorpayAuth);
      } else if (row.razorpay_order_id) {
        const orderPayments = await razorpayGet(`/orders/${row.razorpay_order_id}/payments`, razorpayAuth);
        payment = selectBestOrderPayment(orderPayments);
      }

      if (!payment?.id) {
        summary.skipped += 1;
        console.log(`[skip] ${row.id} ${row.email} - no Razorpay payment found`);
        continue;
      }

      if (row.razorpay_order_id && payment.order_id && row.razorpay_order_id !== payment.order_id) {
        summary.skipped += 1;
        console.log(`[skip] ${row.id} ${row.email} - order mismatch`);
        continue;
      }

      const nextValues = {
        amount_paid: normalizeAmount(payment.amount),
        payment_currency: payment.currency || "INR",
        payment_gateway_status: payment.status || "unknown",
        payment_status: "verified",
        razorpay_order_id: payment.order_id || row.razorpay_order_id,
        transaction_id: payment.id || row.transaction_id,
      };

      const changed =
        row.amount_paid !== nextValues.amount_paid ||
        row.payment_currency !== nextValues.payment_currency ||
        row.payment_gateway_status !== nextValues.payment_gateway_status ||
        row.payment_status !== nextValues.payment_status ||
        row.razorpay_order_id !== nextValues.razorpay_order_id ||
        row.transaction_id !== nextValues.transaction_id;

      if (!changed) {
        summary.unchanged += 1;
        console.log(`[ok] ${row.id} ${row.email} - already in sync`);
        continue;
      }

      if (options.commit) {
        const { error: updateError } = await supabase
          .from("registrations")
          .update(nextValues)
          .eq("id", row.id);
        if (updateError) throw updateError;
      }

      summary.updated += 1;
      console.log(
        `[${options.commit ? "updated" : "preview"}] ${row.id} ${row.email} - amount=${nextValues.amount_paid} status=${nextValues.payment_gateway_status} payment_id=${nextValues.transaction_id}`,
      );
    } catch (error) {
      summary.failed += 1;
      console.log(`[error] ${row.id} ${row.email} - ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log("");
  console.log("Summary");
  console.log(`scanned: ${summary.scanned}`);
  console.log(`updated: ${summary.updated}`);
  console.log(`unchanged: ${summary.unchanged}`);
  console.log(`skipped: ${summary.skipped}`);
  console.log(`failed: ${summary.failed}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
