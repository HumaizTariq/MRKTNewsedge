# Phase 3: Economic Calendar + COT + FedWatch + CME OI

## Goal
All macro/fundamental data pipes working. COT positioning (weekly, all 3 markets). Daily OI from CME (via GitHub Actions Playwright). Fed rate probabilities. Economic calendar. All data stored in Supabase, available for Phase 4 bias engine.

## Depends on
Phase 1 (Supabase), Phase 2 (news pipeline — not strictly required but good to have)

## Files to MODIFY
- src/app/calendar/page.tsx — replace stub with real economic calendar UI
- src/app/cot/page.tsx — replace stub with COT positioning dashboard (net longs chart + OI chart + narrative)

## Files to CREATE
- src/lib/cftc.ts — CFTC Socrata API client: fetch Gold + BTC from dataset 72hh-3qpy, NQ from dataset gpe5-46if. Parse into COTPosition struct. Store in Supabase.
- src/lib/cme-oi-scraper.ts — Node script that uses Playwright to navigate to CME settlements page, extract daily OI for GC/NQ/BTC futures. Runs VIA GITHUB ACTIONS (not Vercel — see below).
- src/lib/cmefedwatch.ts — fetch Fed rate probabilities from cmefedwatch.org or CME FedWatch page
- src/lib/econ-calendar.ts — fetch economic calendar from Finnhub, format as EconEvent[]
- src/app/api/cot/latest/route.ts — returns latest COT data for all 3 markets
- src/app/api/oi/daily/route.ts — returns latest daily OI for a market
- src/app/api/fedwatch/route.ts — returns current Fed rate probabilities
- src/app/api/calendar/events/route.ts — returns today's economic events
- .github/workflows/cme-oi-scraper.yml — GitHub Actions scheduled workflow that runs daily at 8:30 AM ET, installs Playwright, navigates to CME, scrapes OI, saves to Supabase

## Supabase tables to CREATE

### cot_positions
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| market | text | Market symbol |
| report_date | date | COT report date |
| managed_money_long | int8 | Managed money long positions |
| managed_money_short | int8 | Managed money short positions |
| managed_money_net | int8 | Net long/short |
| net_long_chg_pct | float8 | Change vs prior week |
| open_interest | int8 | Total open interest |
| oi_chg_pct | float8 | OI change vs prior week |
| z_score_1y | float8 | 1-year z-score of net position |
| z_score_5y | float8 | 5-year z-score of net position |
| narrative | text | LLM-generated narrative |
| verified | bool | Verified flag |
| created_at | timestamptz | Default now() |

### oi_daily
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| market | text | Market symbol |
| date | date | Trading date |
| open_interest | int8 | Daily OI |
| prior_day_oi | int8 | Previous day's OI |
| delta | int8 | OI change |
| delta_pct | float8 | OI change percent |
| settle_price | float8 | Settlement price |
| price_chg_pct | float8 | Price change percent |
| oi_signal | text | NEW LONGS / NEW SHORTS / SHORT COVERING / LONG LIQUIDATION / NEUTRAL OI |
| z_score_20d | float8 | 20-day z-score |
| extreme_flag | bool | Is OI at extreme? |
| created_at | timestamptz | Default now() |

### econ_events
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| event_name | text | Event name |
| country | text | Country code |
| date | timestamptz | Event time |
| impact | text | HIGH/MODERATE/LOW |
| actual | float8 | Actual value (nullable) |
| forecast | float8 | Forecast value (nullable) |
| previous | float8 | Previous value (nullable) |
| created_at | timestamptz | Default now() |

## GitHub Actions CME scraper (critical — Vercel can't run Playwright)
```yaml
name: CME OI Scraper
on:
  schedule:
    - cron: '30 12 * * 1-5'  # 8:30 AM ET = 12:30 UTC Mon-Fri
  workflow_dispatch:
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install chromium
      - run: node src/lib/cme-oi-scraper.js
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## CFTC data URLs (verified)
- Disaggregated Futures: publicreporting.cftc.gov/resource/72hh-3qpy.json?$where=market_and_exchange_names like '%GOLD%'
- TFF Futures: publicreporting.cftc.gov/resource/gpe5-46if.json?$where=market_and_exchange_names like '%NASDAQ%'
- No auth needed. COT released Friday 3:30 PM ET. Fetch Friday 8 PM ET. If no data, retry Saturday 12 PM ET.
- Add $order=report_date_as_yyyy_mm_dd DESC and $limit=1 to get latest. Check that returned date is within 2 days of polling date (data delay). If not, retry.

## Verification
- [ ] npx tsc --noEmit passes
- [ ] /cot page shows positioning data for Gold, NQ, BTC
- [ ] /calendar page shows this week's economic events
- [ ] Supabase cot_positions table has data for all 3 markets (check after running CFTC fetcher)
- [ ] GitHub Actions CME scraper runs successfully (check Actions tab)
- [ ] Supabase oi_daily table has daily records (check after scraper runs)
