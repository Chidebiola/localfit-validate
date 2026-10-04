/**
 * Demo agent: a vendor asks a question, the agent decides to call Localfit's deployed API,
 * reads the structured result, and answers. Run: npm run agent
 */
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";

const API = process.env.LOCALFIT_API_URL ?? "http://localhost:3000";
/** Optional: the booth recorder app (AI Studio). If set, the agent validates against real recorded conversations. */
const RECORDER = process.env.RECORDER_URL;
const MODEL = process.env.LOCALFIT_MODEL ?? "google/gemini-2.5-flash";

const validateBoothFeedback = tool({
  description:
    "Localfit: analyze in-person booth feedback from an event the vendor attended and return a per-hypothesis validation report " +
    "(verdict, confidence, quotes, willingness to pay, objections, next change). Use when a vendor asks whether an event validated their product.",
  inputSchema: z.object({
    event_id: z.string().describe("Localfit event id"),
    event_name: z.string().optional(),
    product: z.string().describe("What the vendor tested"),
    hypotheses: z.array(z.string()).min(1).max(5).describe("Beliefs the vendor went in with"),
  }),
  execute: async (input) => {
    let recordings: unknown[] | undefined;
    if (RECORDER) {
      const list = await fetch(`${RECORDER}/api/recordings`).then((r) => r.json());
      recordings = (list as { status?: string }[]).filter((r) => r.status === "completed");
      console.log(`\x1b[36m  pulled ${recordings.length} recorded booth conversations from the recorder\x1b[0m`);
    }
    const res = await fetch(`${API}/api/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(recordings?.length ? { ...input, recordings } : input),
    });
    return res.json();
  },
});

const vendorMessage = `Hi! I'm Saltwater Botanicals. I tabled at the Jack London Square Makers Market in Oakland today
(Localfit event id: jls-market-2026-10-03) to test my new 15ml travel-size lip and cuticle balm at $18.
Going in I believed three things:
1) people will pay $18 for the travel size,
2) first-time buyers would rather get the travel size than the $34 full size,
3) unscented will outsell lavender.
Was I right? And what should I change before my next market in two weeks? Keep it short.`;

async function main() {
  console.log(`\n\x1b[1mVendor:\x1b[0m ${vendorMessage}\n`);
  const result = await generateText({
    model: MODEL,
    system:
      "You are Localfit's vendor assistant. Use your tools to ground every claim in the vendor's real booth data. " +
      "After calling a tool, answer with: a verdict per belief, the price to charge, and a 3-item checklist for the next event.",
    prompt: vendorMessage,
    tools: { validate_booth_feedback: validateBoothFeedback },
    stopWhen: stepCountIs(4),
    onStepFinish({ toolCalls, toolResults }) {
      for (const c of toolCalls) {
        console.log(`\x1b[36m→ tool call:\x1b[0m ${c.toolName} ${JSON.stringify(c.input)}`);
      }
      for (const r of toolResults) {
        const out = r.output as { response_count?: number; hypotheses?: { verdict: string; confidence: number }[] };
        console.log(
          `\x1b[36m← result:\x1b[0m ${out.response_count} responses · ` +
            (out.hypotheses ?? []).map((h) => `${h.verdict} (${Math.round(h.confidence * 100)}%)`).join(", ")
        );
      }
    },
  });
  console.log(`\n\x1b[1mLocalfit agent:\x1b[0m\n${result.text}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
