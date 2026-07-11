# Candle Analysis Logic — Hybrid Flash/GLM Router

## Overview
When user clicks a candle on the chart, POST /api/candle-analysis receives {market, timeframe, candleOpenTime, candleCloseTime, open, high, low, close, volume}. The server routes to the right LLM based on headline count in the candle's time window.

## Router logic (modelRouter.ts)

```typescript
function routeCandleAnalysis(headlines: Headline[], candle: CandleData): { model: 'flash' | 'glm' | 'none', reason: string, complexity: 'simple' | 'complex' | 'none' } {
  if (headlines.length === 0) return { model: 'none', reason: 'No headlines in window', complexity: 'none' };
  const totalWords = headlines.reduce((sum, h) => sum + h.title.split(/\s+/).length + h.summary.split(/\s+/).length, 0);
  if (headlines.length === 1 && totalWords > 200) return { model: 'glm', reason: 'Single FOMC-length headline', complexity: 'complex' };
  if (headlines.length === 1) return { model: 'flash', reason: 'Single simple headline', complexity: 'simple' };
  return { model: 'glm', reason: `${headlines.length} headlines need multi-source synthesis`, complexity: 'complex' };
}
```

## Time window
- [candleOpenTime, candleCloseTime + 15min buffer]
- BTC weekends: 30min buffer

## 10 Bug fixes from review

| # | Bug | Fix |
|---|---|---|
| 1 | Cache staleness from late-arriving news | Cache stores lastHeadlineId. On hit, query for newer headlines. If found, invalidate. |
| 2 | Timezone drift (exchange ET vs headlines UTC) | Force UTC everywhere. lightweight-charts uses epoch seconds → convert to ISO UTC for Supabase. |
| 3 | H4 candle can have 30+ headlines | Cap at 10 headlines passed to GLM (ORDER BY impact DESC, published_at DESC LIMIT 10). Mention "and N other headlines" in prompt. |
| 4 | Spam-clicking 50 candles = 50 LLM calls | Client debounce (2s between clicks). Server rate limit: 30/min, 200/hr per IP. |
| 5 | Warning flag cached permanently | Strip warning field before cache write. |
| 6 | 429 rate limit from opencode-go not handled | Detect 429, exponential backoff (1s, 2s, 4s) before fallback. Show "Rate limited, retrying..." UI. |
| 7 | 10 × 500-word FOMC headlines = 5000-word prompt | Truncate each headline to 100 words. Total prompt cap: 1500 words. |
| 8 | Headline not tagged 'BTC' but about BTC regulation | DON'T filter headlines by asset tag for candle window. Include all headlines in window, let LLM judge relevance. |
| 9 | CME scrape may miss volume for BTC futures | Mark volume as optional. If null → "Volume data unavailable". |
| 10 | Weekend BTC: 0-headline case gets generic message | Market check: if 0 headlines AND market=BTC AND day=Sat/Sun → "Weekend session — low news flow. Price move likely crypto-native (ETF discount/premium, whale moves, on-chain events)." |

## Fallback chain
Primary fails → opposite model (Flash→GLM or GLM→Flash). Both fail → return raw headlines array (user can read manually).

## Caching
Cache key = `${market}_${timeframe}_${candleOpenTime}`. TTL = 24 hours. Stale check on every cache hit: store lastHeadlineId, query for newer headlines on hit, invalidate if found.

## Prompt templates (TODO: implement in src/lib/candle-prompts.ts)

### Flash simple prompt
```
Explain why {market} moved during {candleOpenTime}–{candleCloseTime}:
Open: {open}, Close: {close}, High: {high}, Low: {low}
Headline at that time: "{headline_title}: {headline_summary}"
Return: {{"summary": string (2-3 sentences), "market": string}}
```

### GLM complex prompt
```
Analyze {market} price action during {candleOpenTime}–{candleCloseTime}:
Open: {open}, Close: {close}, High: {high}, Low: {low}, Volume: {volume}
Headlines in window ({headline_count} total, top 10 shown):
{headlines_top_10}
{headline_overflow}
Return: {{"summary": string (3-5 sentences), "primary_catalyst": string, "secondary_factors": string[], "market": string, "headline_count": number}}
```
