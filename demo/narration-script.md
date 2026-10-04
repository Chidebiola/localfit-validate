# Localfit Validate demo: narration script

Record **one clip per scene** and save them in `demo/voice/` with the file names below
(`.m4a` from Voice Memos/QuickTime, or `.wav`/`.mp3`, all fine).
The video re-times itself to your clips, so you don't need to hit the times exactly.
The times are just the current pace (~1:55 total). Talk naturally and pause briefly at the end of each clip.

---

### 1. `01-title`  (~6 sec)
*On screen: "Booth feedback in. Validation verdict out."*

> This is Localfit Validate: an agent-callable service that turns in-person booth feedback into a clear validation verdict.

### 2. `02-problem`  (~13 sec)
*On screen: three feedback cards, then "So… did the market validate the product?"*

> Vendors use Localfit to find in-person events where they can test a product. But booth feedback ends up scattered across notes, QR form answers, and voice memos. So did the market actually validate the product? It's hard to tell.

### 3. `03-pipeline`  (~16 sec)
*On screen: Booth recorder → POST /api/validate → Any agent → Vendor answer (each box lights up in turn)*

> Here's the pipeline. A booth recorder, built in Google AI Studio with Gemini, transcribes conversations and tags persona and sentiment. That feedback goes to one endpoint, POST /api/validate, deployed on Vercel. Then any agent can call it and answer the vendor.

### 4. `04-toolkit`  (~24 sec)
*On screen: six tiles appear one by one: generateObject, generateText + tool, AI Gateway, Zod, GET /api/validate, Supabase*

> The agent toolkit. The Vercel AI SDK runs both sides. On the server, generateObject forces a typed report. In the agent, generateText with a tool lets the model decide when to call us. Every model call goes through the Vercel AI Gateway, currently Gemini 2.5 Flash. Zod schemas define the contract, a GET request lets agents discover the tool, and Supabase can store the responses.

### 5. `05-ask`  (~9 sec)
*On screen: terminal, the vendor's message types out*

> Let's watch it run. Saltwater Botanicals tested an eighteen-dollar travel-size balm at the Jack London Square Makers Market, with three beliefs going in.

### 6. `06-call`  (~7 sec)
*On screen: "→ tool call: validate_booth_feedback" and its JSON input*

> The agent decides to call validate booth feedback, passing the event ID, the product, and all three hypotheses.

### 7. `07-report`  (~11 sec)
*On screen: three verdict cards with confidence bars, $12–$18, top objections*

> The live API reads fifteen booth responses. It returns a verdict for each belief with confidence, real shopper quotes, willingness to pay between twelve and eighteen dollars, and the top objections.

### 8. `08-answer`  (~10 sec)
*On screen: the agent's full reply*

> The agent turns that into a short answer. Pricing is mixed, the travel size wins with first-time buyers, and unscented clearly outsells lavender. Plus a checklist for the next market.

### 9. `09-close`  (~8 sec)
*On screen: "Record at the booth. Validate with one API call." + live URL*

> Record at the booth. Validate with one API call. Walk into your next event knowing what to change. Localfit Validate is live on Vercel now.

---

**Tips:** quiet room, phone or laptop mic ~20 cm away, same distance for every clip.
Feel free to reword lines in your own voice; keep scene 4 naming the tools in the same order, because the tiles light up in that order.
