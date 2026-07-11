# Integration Guide — Phase Boundaries & Cross-Phase Contracts

## Phase ownership table

| Phase | Owns these files | Creates these Supabase tables | Creates these API routes | Other phases read via |
|---|---|---|---|---|
| 1 | src/lib/twelvedata.ts, src/lib/finnhub.ts (fill stubs), src/lib/supabase/, src/app/dashboard/, src/app/api/market-prices/, src/app/api/candlestick-data/ | market_prices, candles_daily | GET /api/market-prices, GET /api/candlestick-data | Supabase market_prices table, /api/market-prices |
| 2 | src/lib/finnhub.ts (news), src/lib/opencode.ts (classifier), src/lib/ntfy.ts, src/app/news/, src/app/api/news/ | headlines | GET /api/news/poll, GET /api/news/latest | Supabase headlines table |
| 3 | src/lib/cftc.ts, src/lib/cme-oi.ts, src/lib/cmefedwatch.ts, src/app/calendar/, src/app/cot/, src/app/api/cot/, src/app/api/oi/, src/app/api/fedwatch/ | cot_positions, oi_daily, econ_events | GET /api/cot, GET /api/oi, GET /api/fedwatch | Supabase cot_positions + oi_daily + econ_events tables |
| 4 | src/lib/bias-engine.ts, src/lib/daily-report.ts, src/lib/resend.ts, src/app/api/bias/ | biases | GET /api/bias/daily | Supabase biases table |
| 5 | src/app/gold/, src/app/nq/, src/app/btc/, src/components/AssetPage.tsx, src/components/BiasPanel.tsx, src/components/NewsonChart.tsx, src/components/UpcomingEvents.tsx, src/components/PullbackTarget.tsx | none (reads all above) | none | reads all Supabase tables + all API routes |
| 6 | src/app/api/candle-analysis/, src/lib/candle-router.ts, src/lib/candle-prompts.ts, src/components/CandleClickCard.tsx, src/components/LevelToggle.tsx | none | POST /api/candle-analysis | reads headlines + candle_data tables |

## Rules
- No phase writes to another phase's owned files
- Cross-phase data sharing uses Supabase tables or API routes
- If you need to fix a bug in another phase's file, document it in your PHASE-N.md and notify — do NOT edit directly
- Modifying src/lib/types.ts is ALLOWED by any phase (additive only, never remove fields)
