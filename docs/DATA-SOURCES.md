# Data Sources — Free APIs, Endpoints, Rate Limits

## Source table

| Source | Purpose | Free tier limit | Endpoint | Auth | Polling |
|---|---|---|---|---|---|
| Twelve Data | Prices: XAUUSD, NQ futures, DXY | 8 calls/min, 800/day | api.twelvedata.com/time_series?symbol=XAUUSD&interval=15min | API key in TWELVEDATA_API_KEY | Every 15 min (server cron) |
| Finnhub | Prices: QQQ (NQ proxy), SPY (ES proxy), VIX; News; Economic calendar | 60 calls/min, no daily cap (news+quotes separate) | finnhub.io/api/v1/quote?symbol=QQQ, /api/v1/news?category=general, /api/v1/calendar/economic | API key in FINNHUB_API_KEY | Prices: every 5 min, News: every 1 min, Calendar: daily |
| Binance public API | BTC spot price (24/7 including weekends) | Unlimited | api.binance.com/api/v3/ticker/price?symbol=BTCUSDT | None | Every 1 min |
| CFTC Socrata API | COT positioning: Gold + BTC from Disaggregated (dataset 72hh-3qpy), NQ from TFF (dataset gpe5-46if) | Unlimited, no token needed per FAQ #13 | publicreporting.cftc.gov/resource/72hh-3qpy.json?$where=market_and_exchange_names like '%GOLD%' | None | Weekly (Friday 8 PM ET, retry Sat 12 PM if holiday) |
| CME settlements (via GitHub Actions + Playwright) | Daily open interest: Gold, NQ, BTC futures | Free (GH Actions: 2000 min/mo) | Navigate to cmegroup.com/markets, search for contract, click through to settlements page | None (public page) | Daily (8:30 AM ET), runs in GitHub Actions since Vercel serverless can't run Playwright |
| cmefedwatch.org community API | Fed funds rate probabilities | Unlimited | cmefedwatch.org/json or scrape CME FedWatch page | None | Daily (9 AM ET) or on-demand |
| Alternative.me | Fear & Greed Index (BTC sentiment) | Unlimited | api.alternative.me/fng/ | None | Hourly |
| ntfy.sh | Breaking news push notifications | 250 notifications/day | ntfy.sh/{your_topic} | None (topic acts as auth) | On BREAKING headline |
| Resend | Daily digest email | 100 emails/day | api.resend.com/email | API key in RESEND_API_KEY | Once daily (9:15 AM ET) |

## Notes
- **Twelve Data is the bottleneck** at 800/day. Polling 5 markets every 15 min = 480 calls/day. DO NOT poll more frequently.
- Use Finnhub for US-listed proxies (QQQ, SPY) at 5-min intervals (free, 60/min, no daily cap).
- Resend free tier requires verified domain for FROM address OR use onboarding@resend.dev for development. Alternative: Brevo free (300 emails/day, no domain verification).
- CFTC data URLs (verified): Disaggregated = publicreporting.cftc.gov/resource/72hh-3qpy.json, TFF = publicreporting.cftc.gov/resource/gpe5-46if.json. No auth needed. COT released Friday 3:30 PM ET. Add $order=report_date_as_yyyy_mm_dd DESC and $limit=1 to get latest. Check that returned date is within 2 days of polling date (data delay). If not, retry.
