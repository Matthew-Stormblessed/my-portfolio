import type { SupabaseClient } from "@supabase/supabase-js";

export type ChatLogRecord = {
  requestId: string;
  question: string;
  answer: string;
  status: "completed" | "failed" | "aborted";
  durationMs: number;
  errorCategory?: string;
};

// Keep transcript writes and notifications outside the request route so their privacy boundaries are explicit.
export async function saveChatLog(supabase: SupabaseClient, record: ChatLogRecord) {
  let storageFailed = false;
  try {
    // Persist only the latest user turn and its answer so previous context is not copied into every row.
    const { error } = await supabase.from("chat_transcripts").insert({
      request_id: record.requestId,
      question: record.question,
      answer: record.answer,
      status: record.status,
      duration_ms: record.durationMs,
      error_category: record.errorCategory ?? null,
    });
    storageFailed = Boolean(error);
  } catch {
    // Keep database network failures from interrupting an otherwise completed response stream.
    storageFailed = true;
  }

  // Report database failures without including transcript text or provider error payloads in platform logs.
  if (storageFailed) {
    console.error(JSON.stringify({ event: "chat.transcript_store_failed", requestId: record.requestId }));
    return;
  }

  // Notify only after a successful write so an alert always corresponds to a reviewable stored interaction.
  if (record.status === "completed") await sendUsageNotification(record.requestId);
}

// Send a content-free email so usage alerts do not duplicate private transcripts into another service.
async function sendUsageNotification(requestId: string) {
  // Skip email cleanly until the deployment has a Mailgun sending key, sending domain, and sender address.
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.CHAT_USAGE_NOTIFICATION_FROM;
  const to = process.env.CHAT_USAGE_NOTIFICATION_TO;
  if (!apiKey || !domain || !from || !to) return;

  try {
    // Allow only Mailgun's official US or EU API hosts so a misconfigured URL cannot receive the API key.
    const apiBase = new URL(process.env.MAILGUN_API_BASE_URL ?? "https://api.mailgun.net");
    if (apiBase.protocol !== "https:" || !["api.mailgun.net", "api.eu.mailgun.net"].includes(apiBase.hostname) || !/^[a-z0-9.-]+$/i.test(domain)) {
      console.warn(JSON.stringify({ event: "chat.usage_notification_failed", requestId, status: "invalid_configuration" }));
      return;
    }

    // Use Mailgun's multipart Messages API and keep the message body free of transcript content.
    const form = new FormData();
    form.set("from", from);
    form.set("to", to);
    form.set("subject", "Someone used your portfolio AI assistant");
    form.set("text", `A chat interaction completed at ${new Date().toISOString()}. Review request ${requestId} in the private chat_transcripts table.`);

    // Bound the provider call so a notification outage cannot hold a completed chat stream open indefinitely.
    const response = await fetch(`${apiBase.origin}/v3/${encodeURIComponent(domain)}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}` },
      body: form,
      signal: AbortSignal.timeout(3_000),
    });

    // Record only delivery status so provider responses cannot leak into application logs.
    if (!response.ok) console.warn(JSON.stringify({ event: "chat.usage_notification_failed", requestId, status: response.status }));
  } catch {
    // Treat notification delivery as best effort because transcript storage is the durable usage record.
    console.warn(JSON.stringify({ event: "chat.usage_notification_failed", requestId, status: "network_error" }));
  }
}
