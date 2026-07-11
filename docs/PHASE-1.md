# Phase 1: Data Fetching + Supabase Schema + Live Dashboard

## Goal
Make the dashboard show real prices from Twelve Data + Finnhub + Binance (not mock). Create Supabase tables for market_prices and candles_daily. Wire up server-side cron (Vercel) for price fetching.

## Depends on
Phase 0 (foundation)

## Files to MODIFY
- src/lib/twelvedata.ts — implement getPrice() and getCandles() using Twelve Data API
- src/lib/finnhub.ts — implement getQuote() using Finnhub API for QQQ, SPY, VIX
- src/app/dashboard/page.tsx — replace mock prices with SWR call to /api/market-prices
- src/app/api/market-prices/route.ts — return real prices from TwelveData + Finnhub
- src/app/api/candlestick-data/route.ts — return real OHLC from TwelveData

## Files to CREATE
- src/lib/binance.ts — Binance public API client for BTC (no auth needed, unlimited)
- src/lib/price-fetcher.ts — orchestrator that fetches all markets and stores in Supabase
- src/app/api/cron/fetch-prices/route.ts — Vercel cron endpoint (called by Vercel cron)
- src/hooks/useMarketPrices.ts — SWR hook for dashboard
- src/components/PriceCard.tsx — reusable price card component
- src/components/MarketsGrid.tsx — grid of PriceCards

## Supabase tables to CREATE

### market_prices
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| symbol | text | Market symbol (e.g. XAUUSD) |
| name | text | Human-readable name |
| price | float8 | Current price |
| change | float8 | Price change |
| change_percent | float8 | Percent change |
| updated_at | timestamptz | Last update time |
| created_at | timestamptz | Default now() |

### candles_daily
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| market | text | Market symbol |
| time | int8 | Unix epoch |
| open | float8 | Open price |
| high | float8 | High price |
| low | float8 | Low price |
| close | float8 | Close price |
| volume | float8 | Volume |
| created_at | timestamptz | Default now() |

## API routes this phase creates
- GET /api/market-prices — returns { prices: MarketPrice[] }
- GET /api/candlestick-data?market=XAUUSD&timeframe=1h&count=100 — returns CandleData[]
- POST /api/cron/fetch-prices — called by Vercel cron every 15 min, fetches all markets and updates Supabase

## Polling cadence (respecting free tier limits)
- TwelveData (XAUUSD, NQ, DXY): every 15 min (480 calls/day of 800 cap)
- Finnhub (QQQ, SPY, VIX): every 5 min (60/min, no daily cap)
- Binance (BTC): every 1 min (unlimited)

## Verification
- [ ] npx tsc --noEmit passes
- [ ] npm run dev compiles
- [ ] Dashboard at http://localhost:3000 shows real prices (not mock)
- [ ] /api/market-prices returns valid JSON with prices for all 7 markets
- [ ] /api/candlestick-data?market=XAUUSD&timeframe=1h&count=100 returns 100 candles
