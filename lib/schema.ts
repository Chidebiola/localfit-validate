import { z } from "zod";

/** One piece of feedback captured at the booth (QR form answer, typed note, or transcribed voice memo). */
export const BoothResponse = z.object({
  id: z.string().optional(),
  source: z.enum(["qr_form", "booth_note", "voice_memo"]).default("booth_note"),
  text: z.string().min(1),
  would_buy: z.enum(["yes", "maybe", "no"]).optional(),
  price_said: z.number().optional(),
});
export type BoothResponse = z.infer<typeof BoothResponse>;

/** A completed recording from the Localfit booth recorder (AI Studio app: transcription + persona + sentiment). */
export const RecorderRecording = z.object({
  id: z.string(),
  title: z.string().optional(),
  status: z.string().optional(),
  transcription: z.string().optional(),
  persona: z.string().optional(),
  products: z.array(z.string()).optional(),
  sentiment: z.object({ label: z.string(), score: z.number(), explanation: z.string().optional() }).optional(),
});
export type RecorderRecording = z.infer<typeof RecorderRecording>;

/** Turn recorder output into booth responses the validator understands. */
export function fromRecordings(recs: RecorderRecording[]): BoothResponse[] {
  return recs
    .filter((r) => r.transcription && r.status !== "error")
    .map((r) => {
      const tags = [
        r.persona && `persona: ${r.persona}`,
        r.sentiment && `sentiment: ${r.sentiment.label} (${r.sentiment.score})`,
        r.products?.length && `products: ${r.products.join(", ")}`,
      ].filter(Boolean);
      return {
        id: r.id,
        source: "voice_memo" as const,
        text: `${tags.length ? `[${tags.join("; ")}] ` : ""}${r.transcription}`,
      };
    });
}

/** What an agent sends to POST /api/validate. */
export const ValidateInput = z.object({
  product: z.string().min(3).describe("What the vendor was testing at the booth"),
  hypotheses: z.array(z.string().min(3)).min(1).max(5).describe("Beliefs the vendor wanted to test"),
  event_id: z.string().optional().describe("Localfit event id; responses are loaded for it if none are passed"),
  event_name: z.string().optional(),
  responses: z.array(BoothResponse).optional().describe("Raw booth feedback; omit to load by event_id"),
  recordings: z.array(RecorderRecording).optional().describe("Completed recordings from the booth recorder app (GET /api/recordings)"),
});
export type ValidateInput = z.infer<typeof ValidateInput>;

/** What /api/validate returns: the structured result an agent acts on. */
export const ValidationReport = z.object({
  summary: z.string().describe("Two sentences, plain English: what the booth taught the vendor"),
  hypotheses: z.array(
    z.object({
      hypothesis: z.string(),
      verdict: z.enum(["validated", "mixed", "rejected", "not_enough_signal"]),
      confidence: z.number().describe("0 to 1"),
      evidence_count: z.number().int().describe("How many responses bear on this hypothesis"),
      supporting_quotes: z.array(z.string()).describe("Up to 3 verbatim quotes that support it"),
      counter_quotes: z.array(z.string()).describe("Up to 3 verbatim quotes against it"),
    })
  ),
  willingness_to_pay: z.object({
    low: z.number().nullable(),
    high: z.number().nullable(),
    currency: z.string(),
    mentions: z.number().int(),
  }),
  top_objections: z.array(z.object({ objection: z.string(), count: z.number().int() })).describe("At most 3"),
  next_change: z.string().describe("The single most important change before the next event"),
  next_event_question: z.string().describe("One question to ask shoppers at the next event"),
});
export type ValidationReport = z.infer<typeof ValidationReport>;
