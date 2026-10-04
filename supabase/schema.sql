-- Run in Supabase SQL editor (optional: the API falls back to lib/seed.ts without Supabase)
create table if not exists public.booth_responses (
  id bigint generated always as identity primary key,
  event_id text not null,
  source text not null default 'booth_note' check (source in ('qr_form','booth_note','voice_memo')),
  text text not null,
  would_buy text check (would_buy in ('yes','maybe','no')),
  price_said numeric,
  created_at timestamptz not null default now()
);
create index if not exists booth_responses_event_idx on public.booth_responses (event_id);
alter table public.booth_responses enable row level security;
-- Anyone with the booth QR link can submit feedback; only the server (service role) reads it.
create policy "public can submit booth feedback" on public.booth_responses for insert to anon with check (true);

insert into public.booth_responses (event_id, source, text, would_buy, price_said) values
('jls-market-2026-10-03','qr_form','love that it fits in my jacket pocket. 18 feels fair for something this nice','yes',18),
('jls-market-2026-10-03','booth_note','older woman, tried unscented, bought 2 as gifts. said ''finally one that doesn''t smell like a candle''','yes',null),
('jls-market-2026-10-03','qr_form','Would buy at like $12-14. 18 is a lot for something this small','maybe',13),
('jls-market-2026-10-03','voice_memo','guy asked if the tin was refillable. said he''d pay more for refills he could keep the tin','maybe',null),
('jls-market-2026-10-03','qr_form','the lavender is so good!! bought the big one tho, small one runs out too fast for me','yes',34),
('jls-market-2026-10-03','booth_note','couple tried both scents, picked unscented, said lavender too strong for lips','yes',null),
('jls-market-2026-10-03','qr_form','Cute but I have like 5 lip balms already','no',null),
('jls-market-2026-10-03','booth_note','nurse said cuticles are destroyed from handwashing, travel size perfect for scrubs pocket. bought 3','yes',18),
('jls-market-2026-10-03','qr_form','would pay 15 max','maybe',15),
('jls-market-2026-10-03','voice_memo','lots of people picked it up, sniffed the lavender, put it down. unscented tester basically empty by 2pm',null,null),
('jls-market-2026-10-03','qr_form','Bought the travel size to try it first. if I like it Ill get the big one online','yes',18),
('jls-market-2026-10-03','booth_note','two people asked if it''s vegan / beeswax-free. it isn''t. both walked','no',null),
('jls-market-2026-10-03','qr_form','great gift size! got one for my sister. 18 is ok for a gift, wouldn''t spend that on myself','yes',18),
('jls-market-2026-10-03','qr_form','unscented pls. fragrance gives me headaches','yes',null),
('jls-market-2026-10-03','booth_note','sold 11 travel, 3 full size, 9 of the travel were unscented',null,null);
