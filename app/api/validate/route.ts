import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { ValidateInput, ValidationReport, fromRecordings } from "@/lib/schema";
import { getResponses } from "@/lib/responses";

export const maxDuration = 60;

const MODEL = process.env.LOCALFIT_MODEL ?? "google/gemini-2.5-flash";

/** GET: self-description so any agent can discover how to call this tool. */
export async function GET() {
  return NextResponse.json({
    name: "localfit.validate_booth_feedback",
    description:
      "Turns raw in-person booth feedback into a per-hypothesis validation report (verdict, confidence, quotes, willingness to pay, objections, next change).",
    method: "POST",
    input: {
      product: "string, what was tested",
      hypotheses: "string[] (1-5), beliefs to test",
      event_id: "string, optional; loads stored booth responses",
      event_name: "string, optional",
      responses: "optional [{ text, source?: qr_form|booth_note|voice_memo, would_buy?: yes|maybe|no, price_said?: number }]",
      recordings: "optional; completed recordings from the booth recorder app as returned by its GET /api/recordings",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ValidateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  const passed = [...(input.responses ?? []), ...fromRecordings(input.recordings ?? [])];
  const responses = passed.length ? passed : await getResponses(input.event_id);
  if (!responses.length) {
    return NextResponse.json({ error: "no_responses", hint: "Pass responses[], recordings[], or a known event_id" }, { status: 404 });
  }

  const feedback = responses
    .map((r, i) => {
      const meta = [r.source, r.would_buy && `would_buy=${r.would_buy}`, r.price_said != null && `price_said=$${r.price_said}`]
        .filter(Boolean)
        .join(", ");
      return `${i + 1}. [${meta}] ${r.text}`;
    })
    .join("\n");

  const { object } = await generateObject({
    model: MODEL,
    schema: ValidationReport,
    system:
      "You are Localfit's validation analyst. Vendors table at in-person events to test product beliefs. " +
      "Judge each hypothesis ONLY from the booth evidence given. Quote shoppers verbatim. Count sales notes as strong evidence, " +
      "stated intent as weaker evidence. If fewer than 3 responses bear on a hypothesis, use not_enough_signal. Be concrete and brief.",
    prompt: `Event: ${input.event_name ?? input.event_id ?? "unnamed event"}
Product tested: ${input.product}

Hypotheses:
${input.hypotheses.map((h, i) => `H${i + 1}. ${h}`).join("\n")}

Booth feedback (${responses.length} responses):
${feedback}`,
  });

  return NextResponse.json({
    event_id: input.event_id ?? null,
    response_count: responses.length,
    model: MODEL,
    ...object,
  });
}
