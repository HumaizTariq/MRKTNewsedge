# Phase 6: Brain-Candle Analysis + Level Toggle + Backtesting

## Goal
Click any candle → AI explains the fundamental catalyst. Hybrid Flash/GLM routing. Backtesting: check if daily bias was correct vs actual close direction.

## Depends on
Phase 5 (charts with news markers), Phase 2 (headlines in Supabase), Phase 4 (bias history)

## Files to CREATE
- src/app/api/candle-analysis/route.ts — POST handler. Receives {market, timeframe, candleOpenTime, candleCloseTime, open, high, low, close, volume}. Fetches headlines in time window, routes to Flash or GLM (see CANDLE-ANALYSIS-LOGIC.md), returns {catalyst: 'simple'|'complex'|'none', summary: string, headlines: [...], model: string, cached: boolean}
- src/lib/candle-router.ts — the modelRouter function from CANDLE-ANALYSIS-LOGIC.md. Deterministic routing logic (no LLM in routing layer).
- src/lib/candle-prompts.ts — Flash simple prompt + GLM complex prompt templates
- src/lib/candle-cache.ts — Supabase-based cache: get(sessionKey), set(sessionKey, result, TTL), isStale(key, candleCloseTime)
- src/components/CandleClickCard.tsx — floating card that appears near the clicked candle. Shows: colored status dot (green=simple/Flash, yellow=complex/GLM, gray=no catalyst), 2-4 sentence explanation, expandable "View N headlines" section, "Deep retry" button (re-runs on GLM if Flash was used). Clicks outside card or click another candle → closes.
- src/components/LevelToggle.tsx — the Tech/Fund toggle with confluence highlighting logic
- src/components/BacktestPanel.tsx — historical bias log table: date, market, bias direction, confidence, actual close direction, match/miss, running win-rate %. Filters by market and date range.

## Integration with Phase 5 charts
- lightweight-charts click handler on candle → POST /api/candle-analysis
- NewsOnChart purple dots also trigger same handler when clicked
- CandleClickCard renders floating above/beside the clicked candle position

## Hybrid routing (from CANDLE-ANALYSIS-LOGIC.md)
- 0 headlines in window → "No fundamental catalyst" (no LLM call)
- 1 headline <200 words → DeepSeek-Flash (fast, ~1-2s)
- 1 headline ≥200 words → GLM 5.2 (FOMC-length, needs reasoning)
- 2+ headlines → GLM 5.2 (multi-source synthesis)

## Backtesting logic
- Query biases table for last 90 days
- For each bias: fetch actual close price for that day from market_prices or candles_daily
- Direction match: bullish bias + close > open = hit. bearish bias + close < open = hit. neutral = excluded.
- Win rate = hits / (hits + misses) × 100
- Display as table + bar chart
- Filter by market, confidence level, date range

## Verification
- [ ] npx tsc --noEmit passes
- [ ] Click a candle on /gold page → CandleClickCard appears with analysis
- [ ] Candle with 0 headlines → "No fundamental catalyst" message
- [ ] Candle with 1 simple headline → Flash analysis (fast, ~1-2s)
- [ ] Candle with 2+ headlines → GLM analysis (~3-5s, higher quality)
- [ ] "Deep retry" button on Flash result re-runs with GLM
- [ ] Caching: same candle clicked twice → instant (no LLM call)
- [ ] LevelToggle: Tech shows Fibonacci/swing levels, Fund shows bias zones, confluence highlights overlap
- [ ] BacktestPanel shows win rate for last 90 days per market
