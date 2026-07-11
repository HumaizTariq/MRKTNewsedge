# Phase 5: Asset Pages with Charts + News Overlay + Levels

## Goal
Build the main trading interface — /gold, /nq, /btc pages with interactive candlestick charts, news markers on candles, pullback/target level lines, filtered news feed, bias section, upcoming events below chart. This implements the DASHBOARD-SPEC.md layout.

## Depends on
Phase 1 (prices + candles API), Phase 2 (news feed), Phase 3 (COT + OI), Phase 4 (daily bias)

## Files to CREATE
- src/components/AssetPage.tsx — the full-page layout wrapper: chart area + news sidebar + bias section below
- src/components/ChartView.tsx — lightweight-charts candlestick chart with overlays (news markers, pullback/target lines, session markers, timeframe pills, asset header)
- src/components/NewsOnChart.tsx — renders purple dot markers on candle positions where news occurred; click triggers brain-candle analysis (Phase 6)
- src/components/PullbackTarget.tsx — renders dashed pullback line + solid target line on chart with labels. Toggle between Tech (swing highs/lows + Fib + ATR) and Fund (LLM-generated from daily bias) levels. Confluence auto-highlight (when both sources agree within tolerance).
- src/components/BiasPanel.tsx — two-column bias display (supports vs flip factors) with colored dots, embedded news cards, SEE IMPACT links
- src/components/UpcomingEvents.tsx — below-chart future events table: event name, time, expected, previous, impact tier, which assets it affects
- src/components/AssetSelector.tsx — dropdown to switch markets (Gold/NQ/BTC) — used within AssetPage or as standalone navigation
- src/components/NewsSidebar.tsx — right sidebar: news feed filtered to current asset, filter tabs, ASSETS TO WATCH pill tags

## Files to MODIFY
- src/app/gold/page.tsx — replace stub with <AssetPage market="XAUUSD" />
- src/app/nq/page.tsx — replace stub with <AssetPage market="NQ" />
- src/app/btc/page.tsx — replace stub with <AssetPage market="BTC" />

## Chart overlays (implemented on lightweight-charts)
1. **Session markers**: vertical dashed lines at Asian (22:00 UTC), London (07:00 UTC), NY (12:00 UTC) opens. Labels on x-axis.
2. **News event markers**: purple dots at candle positions where headlines exist. Query: SELECT publish_time FROM headlines WHERE asset_tags contains current market AND publish_time BETWEEN candle_open AND candle_close. Render as purple circle markers on the chart at each matching candle time.
3. **Pullback area**: horizontal dashed line at the pullback price level (from daily bias LLM output). Label "Pullback Area: $X" shown to the right of the line.
4. **Target level**: solid red horizontal line at target price level. Label "Target Level: $X".
5. **Level toggle buttons**: "Tech" | "Fund" buttons above chart. Click Tech → show only technical levels (swing high/low, Fib, ATR). Click Fund → show only fundamental levels (LLM bias zones). Both clean renders. Confluence: when a tech level and fund level overlap within ±$5 (gold) / ±50 pts (NQ) / ±$200 (BTC) → highlighted on BOTH views.

## Components referenced from DASHBOARD-SPEC.md
- Asset header row: XAUUSD dropdown + current price + day change% + Swing Trading badge + Day Trading badge + toggle buttons (+Labels, +Calendar Events, +Targets, +News Feed)
- Timeframe selector pills: 1h | 30m | 15m | 5m
- Drawing toolbar (vertical icon strip) on chart right edge
- News feed sidebar with filter tabs and asset filter pills
- Bias section with Bias | Calendar Events | General Markets | Rates & Central Bank tabs

## Verification
- [ ] npx tsc --noEmit passes
- [ ] /gold page shows candlestick chart with gold prices
- [ ] Purple dots appear on candles where news events occurred
- [ ] Pullback line and target line render with labels
- [ ] Tech/Fund toggle shows only the selected level type
- [ ] Confluence highlights where levels overlap
- [ ] News sidebar shows headlines filtered to current asset (Gold page → gold headlines)
- [ ] Bias section shows two-column layout with drivers
- [ ] Upcoming events table renders below chart
