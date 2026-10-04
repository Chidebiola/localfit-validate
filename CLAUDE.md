# Localfit Validate (hackathon build, ~1 hour)

Localfit.events helps vendors find in-person events and validate their product there.
This repo is ONE agent-callable service: booth feedback in -> structured validation verdict out.

## Shape
- `POST /api/validate` (app/api/validate/route.ts): input/output schemas in lib/schema.ts. Uses AI SDK `generateObject` via Vercel AI Gateway (`AI_GATEWAY_API_KEY`, model in `LOCALFIT_MODEL`).
- `GET /api/validate`: self-description for agents.
- lib/responses.ts: loads booth responses from Supabase `booth_responses` if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, else lib/seed.ts.
- app/page.tsx: observer UI in Localfit colors (teal #0e7c7b, gold #eec748, cream #f1e9da, Fraunces + Inter).
- scripts/agent.ts: demo agent (AI SDK `generateText` + tool) that calls the deployed API. `npm run agent`.

## Priorities (in order)
1. Endpoint works locally and on Vercel. 2. Agent demo runs against the Vercel URL. 3. Supabase (optional). 4. Polish.
Keep scope tight. Don't add event matching or link parsing unless the above is done.

## Booth recorder (capture layer)
The user's AI Studio app (Express + Gemini, runs on :3000 by default) records booth conversations and returns
`{ id, title, status, transcription, persona, products, sentiment }` from `GET /api/recordings`.
`/api/validate` accepts these directly as `recordings[]` (see `fromRecordings` in lib/schema.ts).
Pipeline: record at booth -> recorder transcribes + tags -> /api/validate judges hypotheses -> agent answers the vendor.
Run the recorder on a different port (e.g. PORT edit to 3001) when both run locally.
