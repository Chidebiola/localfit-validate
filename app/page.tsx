"use client";
import { useState } from "react";
import { DEMO, SEED_RESPONSES } from "@/lib/seed";
import type { ValidationReport } from "@/lib/schema";

type Result = ValidationReport & { response_count: number; model: string };

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event_id: DEMO.event_id,
          event_name: DEMO.event_name,
          product: DEMO.product,
          hypotheses: DEMO.hypotheses,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bar">
        <b>localfit<span>.</span>events</b>
        <small>Validate · booth feedback in, verdict out</small>
      </div>
      <main className="wrap">
        <h1 style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 900 }}>What did the table teach you?</h1>
        <p className="lede">
          {DEMO.event_name}. Testing: {DEMO.product}. Agents call <code>POST /api/validate</code>; this page calls the same
          endpoint so you can watch the result.
        </p>

        <div className="grid">
          <section className="card">
            <div className="lab">Hypotheses</div>
            <ol style={{ margin: "8px 0 16px", paddingLeft: 20, lineHeight: 1.6 }}>
              {DEMO.hypotheses.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
            <div className="lab">Raw booth feedback ({SEED_RESPONSES.length})</div>
            <div style={{ marginTop: 6 }}>
              {SEED_RESPONSES.map((r) => (
                <div className="resp" key={r.id}>
                  <span className="src">{r.source.replace("_", " ")}</span>
                  {r.text}
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button className="btn" onClick={run} disabled={loading}>
                {loading ? "Reading the booth…" : result ? "Run again" : "Validate this event"}
              </button>
              {result && (
                <button className="btn" style={{ background: "var(--raised)", border: "1.5px solid var(--border)" }} onClick={() => setShowRaw(!showRaw)}>
                  {showRaw ? "Hide JSON" : "Show JSON the agent sees"}
                </button>
              )}
            </div>
            {error && <p className="err">{error}</p>}
            {!result && !error && (
              <p className="lede" style={{ fontSize: 14 }}>
                The verdict for each hypothesis, what shoppers would pay, what stopped them, and the one change to make before the
                next market.
              </p>
            )}
            {result && showRaw && <pre style={{ marginTop: 14 }}>{JSON.stringify(result, null, 2)}</pre>}
            {result && !showRaw && (
              <>
                <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.55 }}>{result.summary}</p>
                {result.hypotheses.map((h) => (
                  <div className="hyp" key={h.hypothesis}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                      <h3 style={{ fontSize: 17 }}>{h.hypothesis}</h3>
                      <span className={`pill ${h.verdict}`}>{h.verdict.replace(/_/g, " ")}</span>
                    </div>
                    <div className="meter" aria-label={`Confidence ${Math.round(h.confidence * 100)}%`}>
                      <i style={{ width: `${Math.round(h.confidence * 100)}%` }} />
                    </div>
                    <small style={{ color: "var(--muted)" }}>
                      {Math.round(h.confidence * 100)}% confidence · {h.evidence_count} responses
                    </small>
                    {h.supporting_quotes.slice(0, 2).map((q) => (
                      <p className="q" key={q}>“{q}”</p>
                    ))}
                    {h.counter_quotes.slice(0, 1).map((q) => (
                      <p className="q neg" key={q}>“{q}”</p>
                    ))}
                  </div>
                ))}
                <div className="tiles">
                  <div className="tile">
                    <span className="lab">Would pay</span>
                    <b>
                      {result.willingness_to_pay.low != null ? `$${result.willingness_to_pay.low}–$${result.willingness_to_pay.high}` : "—"}
                    </b>
                  </div>
                  {result.top_objections.slice(0, 2).map((o) => (
                    <div className="tile" key={o.objection}>
                      <span className="lab">Objection ×{o.count}</span>
                      <div style={{ marginTop: 4, fontWeight: 600, fontSize: 14 }}>{o.objection}</div>
                    </div>
                  ))}
                </div>
                <div className="next">
                  <b>Before the next market:</b> {result.next_change}
                  <br />
                  <b>Ask shoppers:</b> {result.next_event_question}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
