# MRKT NewsEdge — Project Plan

## Goal
Personal trading dashboard clone of MRKT (mrktedge.ai) for Gold (XAUUSD), NQ (Nasdaq-100), and BTC. Free APIs only. Personal use.

## Current state
Fresh Next.js 16 scaffold with TypeScript + Tailwind dark theme, Supabase clients, stubs for all pages. Live at github.com/HumaizTariq/MRKTNewsedge.

## Stack
Next.js 16 + React 19 + TypeScript + Tailwind CSS + Supabase (free) + lightweight-charts + SWR. Hosted on Vercel free tier.

## LLMs
All via opencode-go subscription (api.opencode.ai/v1). Models: DeepSeek-v4-Flash (bulk classification), DeepSeek-v4-Pro (econ data + daily digest), GLM-5.2 (bias synthesis + COT narrative + event verification).

## Monthly quota
Flash 31,650 | Pro 3,450 | GLM-5.2 880. Target usage: Flash ~10%, Pro ~2%, GLM ~22%.

## 6 phases (each built in independent sessions)

| Phase | Description | Depends on |
|---|---|---|
| 0 | Foundation — scaffold, GitHub remote, docs | — |
| 1 | Data fetching libs + Supabase schema + live dashboard | 0 |
| 2 | News feed aggregator + DeepSeek-Flash classifier + ntfy.sh alerts | 1 |
| 3 | Economic calendar + COT fetcher + FedWatch + CME OI scraper | 1 |
| 4 | Daily bias engine (GLM 5.2) + daily OI signal + daily report email (DeepSeek-Pro) | 1, 2, 3 |
| 5 | Asset pages (/gold, /nq, /btc) with charts, news markers, pullback/target zones | 1, 2, 3, 4 |
| 6 | Brain-candle analysis (hybrid Flash/GLM) + level toggle + backtesting | 5, 2, 4 |

## Doc index

| File | Description |
|---|---|
| QUICKSTART.md | What each session reads first |
| PLAN.md | This file — master project overview |
| INTEGRATION-GUIDE.md | Phase boundaries and cross-phase contracts |
| DASHBOARD-SPEC.md | Visual layout, colors, components |
| LLM-ROUTING.md | Model-task assignments, quotas, prompt templates |
| DATA-SOURCES.md | Free API endpoints, auth, rate limits |
| CANDLE-ANALYSIS-LOGIC.md | Hybrid Flash/GLM router + bug fixes |
| PHASE-0.md | Foundation (completed) |
| PHASE-1.md | Data fetching + Supabase schema + live dashboard |
| PHASE-2.md | News feed + classifier + ntfy.sh |
| PHASE-3.md | Economic calendar + COT + FedWatch + CME OI |
| PHASE-4.md | Daily bias engine + OI signal + email report |
| PHASE-5.md | Asset pages with charts + news overlay + levels |
| PHASE-6.md | Brain-candle analysis + level toggle + backtesting |

## Quicklinks
- **GitHub**: https://github.com/HumaizTariq/MRKTNewsedge
- **README**: https://github.com/HumaizTariq/MRKTNewsedge/blob/main/README.md
- **.env.local.example**: `C:\Users\Humaiz\MRKTNewsedge\.env.local.example`
