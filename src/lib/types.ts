export type MarketSymbol = "XAUUSD" | "NQ" | "BTC" | "ES" | "DXY" | "US10Y" | "VIX";

export interface MarketPrice {
  symbol: string; name: string; price: number;
  change: number; changePercent: number; updatedAt: string;
}

export interface CandleData {
  time: number; open: number; high: number; low: number; close: number; volume?: number;
}

export interface Headline {
  id: string; title: string; summary: string; source: string; url: string;
  assetTags: string[]; impact: "breaking" | "high" | "medium" | "low";
  sentiment: "bullish" | "bearish" | "neutral"; oneLiner: string;
  publishedAt: string; fetchedAt: string;
}

export interface OIDaily {
  id: string; market: MarketSymbol; date: string;
  openInterest: number; priorDayOI: number; delta: number; deltaPct: number;
  price: number; priceChgPct: number; oiSignal: string; zScore20d: number; extremeFlag: boolean;
}

export interface DailyBias {
  id: string; market: MarketSymbol; date: string;
  direction: "bullish" | "bearish" | "neutral";
  confidence: "strong" | "moderate" | "developing";
  primaryDriver: string; changeCondition: string;
  positionSize: "standard" | "75pct" | "pilot" | "wait";
  oiSummary: { currentOI: number; priorDayOI: number; deltaPercent: number;
    directionVsPrior: "higher" | "lower" | "flat"; signal: string; interpretation: string; } | null;
}

export interface COTPosition {
  id: string; market: MarketSymbol; reportDate: string;
  netLongs: number; netLongsChgPct: number; openInterest: number;
  oiChgPct: number; zScore5y: number; narrative: string; verified: boolean;
}
