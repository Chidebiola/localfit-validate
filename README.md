# Localfit Validate

> Localfit tells you which table to book, then tells you what the table taught you.

An agent-callable API that turns raw in-person booth feedback into a per-hypothesis validation verdict.

## Run it (10 min)
1. `npm install`
2. `cp .env.example .env.local` and paste your `AI_GATEWAY_API_KEY`
3. `npm run dev` → open http://localhost:3000 → **Validate this event**
4. In a second terminal: `npm run agent` (the agent calls the API and answers the vendor)

## Deploy (10 min)
`npx vercel` → add `AI_GATEWAY_API_KEY` (and `LOCALFIT_MODEL`) in Project → Settings → Environment Variables → `npx vercel --prod`.
Then set `LOCALFIT_API_URL=https://<your-app>.vercel.app` in `.env.local` and rerun `npm run agent`.

## Optional: Supabase
Run `supabase/schema.sql` in the SQL editor, then add `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` to env.
The QR form at the booth can insert straight into `booth_responses` with the anon key.

## Call it from any agent
```bash
curl -X POST $LOCALFIT_API_URL/api/validate -H 'content-type: application/json' -d '{
  "event_id": "jls-market-2026-10-03",
  "product": "15ml travel balm, $18",
  "hypotheses": ["Shoppers will pay $18", "Unscented outsells lavender"]
}'
```

## Demo script (3 min)
1. The problem: vendors spend $75–300 and a weekend on a booth and leave with vibes, not evidence.
2. Show the observer page: 15 messy responses on the left.
3. Run `npm run agent` against the Vercel URL: watch the tool call, the structured result, the vendor answer.
4. Click **Show JSON the agent sees**: this is the capability, any agent can use it.
