# Phase 4: Daily Bias Engine + OI Signal + Daily Report Email

## Goal
GLM 5.2 generates daily directional bias for all 3 markets. OI day-over-day signal included in bias output. DeepSeek-Pro composes daily digest email (10 sections). Resend delivers email. Event-day T+1 verification (GLM 5.2) runs after FOMC/NFP/CPI only.

## Depends on
Phase 1 (prices), Phase 2 (headlines), Phase 3 (COT + OI + calendar)

## Files to CREATE
- src/lib/bias-engine.ts — orchestrates the 5-input bias synthesis: reads latest prices, OI, COT (latest weekly), headlines sentiment, cross-asset data. Calls GLM 5.2 for synthesis. Calls DeepSeek-Flash for OI higher/lower one-liner. Stores in Supabase biases table.
- src/lib/daily-report.ts — assembles the 10-section daily report from Supabase data. Calls DeepSeek-Pro for digest prose. Sends via Resend.
- src/lib/resend.ts — Resend email client
- src/app/api/bias/daily/route.ts — returns today's bias for all 3 markets
- src/app/api/bias/history/route.ts — returns historical bias data (for backtesting in Phase 6)
- src/app/api/cron/daily-bias/route.ts — Vercel cron endpoint: runs at 9:00 AM ET, generates bias, sends digest email
- src/app/api/cron/event-verify/route.ts — Vercel cron endpoint: called manually or on event-day schedule, runs GLM 5.2 T+1 verification

## Supabase tables to CREATE

### biases
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| market | text | Market symbol |
| date | date | Bias date |
| direction | text | bullish/bearish/neutral |
| confidence | text | high/medium/low |
| primary_driver | text | Main catalyst |
| change_condition | text | What would flip the bias |
| position_size | text | normal/reduced/none |
| oi_summary | jsonb | OI block with current_oi, prior_day_oi, delta_pct, direction_vs_prior, signal, interpretation |
| cross_asset_signals | jsonb | DXY, VIX, yield, correlation |
| bias_narrative | text | Full narrative |
| verified | bool | Default false |
| verified_by | text | Model name if verified |
| created_at | timestamptz | Default now() |

## Daily bias 5-input engine (in order)
1. Latest macro data + surprise direction (from econ_events table)
2. Central bank stance (parsed from recent FOMC/ECB headlines)
3. Weekly COT positioning + daily OI delta (from cot_positions + oi_daily tables)
4. Cross-asset correlation (DXY direction, US10Y direction, BTC direction, NQ direction — read from market_prices and bias tables)
5. News sentiment summary (from headlines table, last 24h, filtered by asset)

## OI daily signal (done by DeepSeek-Flash, minimal)
- Task: "Gold OI: HIGHER than prior day (+5,400 contracts, +1.13%)" or "NQ OI: LOWER than prior day (-1,200, -0.8%)"
- Deterministic OI signal classification (code, not LLM):
  - rising OI + rising price = NEW LONGS
  - rising OI + falling price = NEW SHORTS
  - falling OI + rising price = SHORT COVERING
  - falling OI + falling price = LONG LIQUIDATION
  - flat OI (±0.5%) = NEUTRAL OI

## Daily digest email (10 sections)
1. Header (date, session map in ET+PKT)
2. Daily Bias verdict — 3 rows (Gold/NQ/BTC)
3. OI snapshot — minimal, one-line per market (HIGHER/LOWER than prior day)
4. Economic calendar today
5. Overnight headlines (top 5-10 HIGH IMPACT with AI one-liner)
6. Cross-asset snapshot (DXY, US10Y, BTC, VIX)
7. Weekly COT context (Fri-Mon-Tue, then fades)
8. Risk events this week
9. Event-day clear direction (ONLY T+1 after FOMC/NFP/CPI — GLM 5.2)
10. Footer (data sources, timestamp, disclaimer)

## Event-day T+1 verification (GLM 5.2, ~8 days/month)
- Triggers: T+1 day after FOMC/NFP/CPI (and PPI/retail sales optionally)
- GLM 5.2 re-synthesizes direction considering yesterday's event data + market reaction
- Overwrites the event-day bias with verified "clear direction" narrative
- Callout box in daily digest email: "Yesterday's CPI → clear direction for next 24-48h"

## Verification
- [ ] npx tsc --noEmit passes
- [ ] /api/bias/daily returns JSON with bias for all 3 markets
- [ ] Bias output includes OI summary block (current_oi, prior_day_oi, delta_pct, direction_vs_prior, signal, interpretation)
- [ ] Daily digest email arrives in inbox
- [ ] Event-day verification: call /api/cron/event-verify on a day after FOMC/NFP/CPI → bias verified field = true
- [ ] Check Supabase biases table for records
