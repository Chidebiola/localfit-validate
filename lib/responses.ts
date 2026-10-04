import { createClient } from "@supabase/supabase-js";
import { SEED_RESPONSES } from "./seed";
import type { BoothResponse } from "./schema";

/** Load booth responses for an event: Supabase if configured, otherwise the seeded demo data. */
export async function getResponses(eventId?: string): Promise<BoothResponse[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key && eventId) {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("booth_responses")
      .select("id, source, text, would_buy, price_said")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Supabase: ${error.message}`);
    return (data ?? []).map((r) => ({
      id: String(r.id),
      source: r.source,
      text: r.text,
      would_buy: r.would_buy ?? undefined,
      price_said: r.price_said ?? undefined,
    }));
  }

  return SEED_RESPONSES.filter((r) => !eventId || r.event_id === eventId);
}
