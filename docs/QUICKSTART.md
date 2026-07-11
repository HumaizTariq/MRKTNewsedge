# MRKT NewsEdge — Quick Start for Phase Sessions

Each phase is built in an independent session. To minimize context, read exactly these files for your phase:

## For EVERY session (start here)
1. **PLAN.md** — 3-min overview: what this project is, stack, phases
2. **INTEGRATION-GUIDE.md** — what you CAN and CANNOT touch

## For YOUR phase
3. **PHASE-N.md** — your specific build instructions (N = your phase number)

## Only if YOUR phase needs them
4. **DASHBOARD-SPEC.md** — visual layout, colors, components (phases building UI)
5. **LLM-ROUTING.md** — model-task assignments, quota, prompts (phases using AI)
6. **DATA-SOURCES.md** — free APIs, endpoints, rate limits (phases fetching data)
7. **CANDLE-ANALYSIS-LOGIC.md** — hybrid Flash/GLM router + bug fixes (Phase 6 only)

## Workflow per session
1. Read the 3 mandatory files above
2. Run: `npx tsc --noEmit` (must pass before starting)
3. Run: `npm run dev` (must compile)
4. Build files listed in your PHASE-N.md
5. Run verification commands in PHASE-N.md
6. Stop — Do NOT touch files owned by other phases (see INTEGRATION-GUIDE.md)
