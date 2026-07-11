# Phase 2: News Feed + Classifier + ntfy.sh

## Goal
Real-time news feed with AI impact classification. Breaking news pushes to mobile via ntfy.sh. Filter by asset. Store classified headlines in Supabase for later phases.

## Depends on
Phase 1 (prices + Supabase working)

## Files to MODIFY
- src/lib/finnhub.ts — implement getNews() to fetch from Finnhub news API
- src/app/news/page.tsx — replace stub with real news feed UI
- src/lib/opencode.ts — already implemented in Phase 0 (verify, add retry logic if needed)

## Files to CREATE
- src/lib/headline-classifier.ts — calls DeepSeek-Flash to classify each headline into {assetTags, sentiment, impact, oneLiner}
- src/lib/ntfy.ts — pushes BREAKING impact headlines to ntfy.sh topic
- src/lib/news-poller.ts — fetches news from Finnhub + RSS feeds, deduplicates, classifies, stores in Supabase
- src/app/api/news/poll/route.ts — Vercel cron endpoint for news polling
- src/app/api/news/latest/route.ts — returns latest classified headlines (filterable by asset tag)
- src/components/NewsCard.tsx — news item card with impact badge, brain icon, one-liner
- src/components/NewsFeed.tsx — scrollable news list with filter tabs (All | Breaking | High Impact | Gold | NQ | BTC)

## Supabase tables to CREATE

### headlines
| Column | Type | Description |
|---|---|---|
| id | text | Hash of title+published_at |
| title | text | Headline title |
| summary | text | Headline summary |
| source | text | Source name |
| url | text | Source URL |
| asset_tags | text[] | Array of asset tags |
| impact | text | BREAKING/HIGH/MODERATE/LOW |
| sentiment | text | bullish/bearish/neutral |
| one_liner | text | AI one-sentence summary |
| published_at | timestamptz | Original publish time |
| fetched_at | timestamptz | Default now() |
| classified | bool | Default false |
| brain_analyzed | bool | Default false |

## API routes
- GET /api/news/latest?asset=Gold&limit=20 — returns Headline[]
- POST /api/news/poll — called by Vercel cron every 1 min, fetches new headlines, classifies with DeepSeek-Flash, stores in Supabase, pushes BREAKING to ntfy.sh

## ntfy.sh setup
Create a topic at ntfy.sh (e.g., mrktnewsedge_YOUR_SECRET). Set NTFY_TOPIC env var. Install ntfy app on phone. Breaking news pushes instantly.

## Vercel cron
Add to vercel.json:
```json
{ "crons": [{ "path": "/api/news/poll", "schedule": "* * * * *" }] }
```

## Verification
- [ ] npx tsc --noEmit passes
- [ ] /news page shows headlines with colored impact badges
- [ ] Filter by asset tag works (clicking "Gold" filter shows only gold-tagged headlines)
- [ ] BREAKING headlines push to ntfy.sh
- [ ] DeepSeek-Flash classifier correctly tags assets and sentiment
- [ ] Check Supabase: headlines table has classified records
