import { OpenAI } from "openai";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let openAIClient: OpenAI | undefined;
// Reuse the OpenAI client for warm server instances so chat calls do not recreate HTTP client state.
export function getOpenAIClient() {
  openAIClient ??= new OpenAI();
  return openAIClient;
}

let supabaseClient: SupabaseClient | undefined;
// Reuse the privileged server client while keeping its service key out of client bundles.
export function getSupabaseServerClient() {
  if (supabaseClient) return supabaseClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("Missing Supabase server configuration.");

  // Disable persisted sessions because this service-role client is stateless server infrastructure.
  supabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseClient;
}
