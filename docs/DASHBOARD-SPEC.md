# Dashboard Spec — Visual Layout & Components

## Layout
Three-region dashboard — left sidebar (40px icons), main chart area (~65%), right news feed sidebar (~30%). Below chart: bias tabs section.

## Color tokens

| Token | Value | Usage |
|---|---|---|
| bg-primary | #0d1117 | Chart background |
| bg-secondary | #1a1a2e | Panels |
| bg-tertiary | #252540 | Cards, tabs |
| text-primary | #ffffff | Primary text |
| text-secondary | #888888 | Secondary text |
| accent-green | #00c853 | Bullish |
| accent-red | #ff5252 | Bearish |
| accent-purple | #7c4dff | News markers, chat |
| accent-gold | #ffd600 | Swing badge |

## Components

### Asset header
- XAUUSD dropdown + price + change%
- Swing Trading (green pill) + Day Trading (red pill) badges
- Toggle buttons: Labels, Calendar Events, Targets, News Feed

### Timeframe pills
1h | 30m | 15m | 5m

### Candlestick chart
- Green/red candles on dark bg (#0d1117)
- Session markers on x-axis (Asian, London, London/NY)
- Built with lightweight-charts

### News markers
- Purple dots on individual candles (clickable → candle analysis)

### Pullback area
- Dashed horizontal line with label "Pullback Area: $4685.00"

### Target level
- Solid red horizontal line with label "Target Level: $4650.00"

### News annotations on chart
- Text blocks at candle positions with timestamp + session + headline summary

### Hover tooltip
- "Click to see what drove this move" + candle time + session

### Drawing toolbar
- Vertical icon strip on chart edge

### News feed sidebar
- Filter tabs: All | Popular | Breaking News 🔴 | High Impact 🔥 | Economic Data 📊
- News items with headline + summary + timestamp + brain icon 🧠
- ASSETS TO WATCH pill tags

### Bias section (below chart)
- Tab bar: ⚡ Bias | 📅 Calendar Events | 🌍 General Markets | 🏛 Rates & Central Bank
- Bias statement with colored badge
- Two-column layout: "What supports the bias?" (red dots) + "What could flip it?" (green dots)
- Embedded news cards with SEE IMPACT → links

## Important
This spec applies to Phase 5 (asset pages) and is referenced by Phase 6 (candle analysis UI). Phases 1-4 build backend/data — they don't need the visual spec.
