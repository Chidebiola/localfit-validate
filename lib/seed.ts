import type { BoothResponse } from "./schema";

/** Demo vendor + one market's worth of messy booth feedback. Swap in your own. */
export const DEMO = {
  event_id: "jls-market-2026-10-03",
  event_name: "Jack London Square Makers Market, Oakland",
  product: "Saltwater Botanicals travel-size (15ml) lip and cuticle balm, $18",
  hypotheses: [
    "Shoppers will pay $18 for the 15ml travel size",
    "First-time buyers prefer the travel size over the $34 full size",
    "The unscented version will outsell the lavender version",
  ],
};

const RAW: BoothResponse[] = [
  { source: "qr_form", text: "love that it fits in my jacket pocket. 18 feels fair for something this nice", would_buy: "yes", price_said: 18 },
  { source: "booth_note", text: "older woman, tried unscented, bought 2 as gifts. said 'finally one that doesn't smell like a candle'", would_buy: "yes" },
  { source: "qr_form", text: "Would buy at like $12-14. 18 is a lot for something this small", would_buy: "maybe", price_said: 13 },
  { source: "voice_memo", text: "guy asked if the tin was refillable. said he'd pay more for refills he could keep the tin", would_buy: "maybe" },
  { source: "qr_form", text: "the lavender is so good!! bought the big one tho, small one runs out too fast for me", would_buy: "yes", price_said: 34 },
  { source: "booth_note", text: "couple tried both scents, picked unscented, said lavender too strong for lips", would_buy: "yes" },
  { source: "qr_form", text: "Cute but I have like 5 lip balms already", would_buy: "no" },
  { source: "booth_note", text: "nurse said cuticles are destroyed from handwashing, travel size perfect for scrubs pocket. bought 3", would_buy: "yes", price_said: 18 },
  { source: "qr_form", text: "would pay 15 max", would_buy: "maybe", price_said: 15 },
  { source: "voice_memo", text: "lots of people picked it up, sniffed the lavender, put it down. unscented tester basically empty by 2pm", would_buy: undefined },
  { source: "qr_form", text: "Bought the travel size to try it first. if I like it Ill get the big one online", would_buy: "yes", price_said: 18 },
  { source: "booth_note", text: "two people asked if it's vegan / beeswax-free. it isn't. both walked", would_buy: "no" },
  { source: "qr_form", text: "great gift size! got one for my sister. 18 is ok for a gift, wouldn't spend that on myself", would_buy: "yes", price_said: 18 },
  { source: "qr_form", text: "unscented pls. fragrance gives me headaches", would_buy: "yes" },
  { source: "booth_note", text: "sold 11 travel, 3 full size, 9 of the travel were unscented", would_buy: undefined },
];

export const SEED_RESPONSES: (BoothResponse & { id: string; event_id: string })[] = RAW.map((r, i) => ({
  ...r,
  id: `r${i + 1}`,
  event_id: DEMO.event_id,
}));
