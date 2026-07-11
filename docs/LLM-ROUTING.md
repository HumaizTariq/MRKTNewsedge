# LLM Routing — Models, Quotas, Prompts

## Models and caps

| Model | Monthly cap | Role |
|---|---|---|
| DeepSeek-v4-Flash | 31,650 | Bulk headline classification (~2700/mo), simple candle analysis (~240/mo) |
| DeepSeek-v4-Pro | 3,450 | Econ data interpretation (~30/mo), daily digest email prose (~30/mo) |
| GLM-5.2 | 880 | Daily bias synthesis (~74/mo), weekly COT narrative + verify (~28/mo), event-day T+1 verify (~8/mo), complex candle analysis (~60/mo) |

## Task-to-model routing

| Task | Model | Calls/day | Calls/month | Notes |
|---|---|---|---|---|
| Headline impact classification | DeepSeek-Flash | ~90 | ~2700 | Classify each headline into asset+sentiment+impact+one_liner |
| Econ data interpretation on release | DeepSeek-Pro | ~1 | ~30 | CPI/NFP/FOMC releases — numeric reasoning |
| Daily digest email prose | DeepSeek-Pro | ~1 | ~30 | 10-section structured digest, formulaic |
| Daily bias synthesis (3 markets) | GLM-5.2 | ~3 | ~74 | Gold/NQ/BTC — qualitative synthesis with cross-asset context |
| Weekly COT narrative generate | GLM-5.2 | 3x/wk | ~12 | 3 markets × 1 pass/week |
| Weekly COT narrative verify | GLM-5.2 | 3x/wk | ~12 | Editor pass — checks factual accuracy |
| Cross-market COT synthesis | GLM-5.2 | 1x/wk | ~4 | Compares positioning across Gold/NQ/BTC |
| Event-day T+1 verification | GLM-5.2 | event days only | ~8 | FOMC/NFP/CPI only — find clear direction |
| Simple candle analysis (1 headline <200 words) | DeepSeek-Flash | ~8 | ~240 | 80% of candle clicks |
| Complex candle analysis (2+ headlines or FOMC-length) | GLM-5.2 | ~2 | ~60 | 20% of candle clicks |

## Fallback chain
- Flash → escalate to GLM
- GLM → degrade to Flash (with warning)
- Both fail → return raw headlines (no AI interpretation but data is still useful)

## Prompt templates

### Flash bias prompt
```
Classify this headline for {market} trading:
"{headline_title}: {headline_summary}"
Return JSON: {{"asset_tags": string[], "sentiment": "bullish"|"bearish"|"neutral", "impact": "BREAKING"|"HIGH"|"MODERATE"|"LOW", "one_liner": string}}
Rules: impact HIGH if central bank, CPI, NFP, FOMC, war, rate decision. BREAKING if unexpected event.
```

### GLM bias prompt
```
Synthesize daily directional bias for {market} given:

- Latest prices: {prices}
- OI Day-over-day: {oi_delta_pct} ({oi_signal})
- COT weekly: managed money net {cot_managed_money_net}, z-score {cot_z_score_1y}
- Headlines last 24h: {headlines_json}
- Cross-asset: DXY {dxy_direction}, US10Y {bond_yield_direction}, VIX {vix_trend}
- Calendar events today: {econ_events_today}

Return JSON: {{"market": string, "direction": "bullish"|"bearish"|"neutral", "confidence": "high"|"medium"|"low", "primary_driver": string, "change_condition": string, "position_size": "normal"|"reduced"|"none", "oi_summary": {{"current_oi": number, "prior_day_oi": number, "delta_pct": number, "direction_vs_prior": "higher"|"lower"|"flat", "signal": "NEW LONGS"|"NEW SHORTS"|"SHORT COVERING"|"LONG LIQUIDATION"|"NEUTRAL OI", "interpretation": string}}, "cross_asset_signals": {{"dxy": string, "vix": string, "yield": string, "correlation": string}}, "bias_narrative": string, "supporting_factors": string[], "flip_factors": string[]}}
Consider: correlation regime (risk-on/risk-off), divergence between COT and price, OI confirming or contradicting price direction.
```

### Flash simple candle prompt
```
Explain why {market} moved during {candleOpenTime}–{candleCloseTime}:
Open: {open}, Close: {close}, High: {high}, Low: {low}
Headline at that time: "{headline_title}: {headline_summary}"
Return: {{"summary": string (2-3 sentences), "market": string}}
```

### GLM complex candle prompt
```
Analyze {market} price action during {candleOpenTime}–{candleCloseTime}:
Open: {open}, Close: {close}, High: {high}, Low: {low}, Volume: {volume}
Headlines in window ({headline_count} total, top 10 shown):
{headlines_top_10}
{headline_overflow}
Return: {{"summary": string (3-5 sentences), "primary_catalyst": string, "secondary_factors": string[], "market": string, "headline_count": number}}
```

## Quota percentage table

| Model | Cap | Est. monthly use | % used |
|---|---|---|---|
| DeepSeek-Flash | 31,650 | ~2,940 | 9.3% |
| DeepSeek-Pro | 3,450 | ~60 | 1.7% |
| GLM-5.2 | 880 | ~186 | 21.1% |

## Implementation notes
- All models called via src/lib/opencode.ts (OpenAI-compatible endpoint at api.opencode.ai/v1/chat/completions)
- API key in OPENCODE_API_KEY env var (extracted from ~/.local/share/opencode/auth.json)
- Always use temperature 0.3 for classification, 0.5 for prose
- Max tokens: 150 for classification, 500 for synthesis, 800 for narratives
- Cache LLM results where possible (same candle clicked twice → cache hit)
