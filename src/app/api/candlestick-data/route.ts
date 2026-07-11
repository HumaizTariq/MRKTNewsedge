import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") || "XAUUSD";
  const count = parseInt(searchParams.get("count") || "100");

  const basePrices: Record<string, number> = {
    XAUUSD: 4105, NQ: 24100, BTC: 72200, ES: 6805, DXY: 98.75, US10Y: 4.36, VIX: 18.4,
  };
  const volatility: Record<string, number> = {
    XAUUSD: 25, NQ: 150, BTC: 1200, ES: 40, DXY: 0.3, US10Y: 0.05, VIX: 1.5,
  };

  const base = basePrices[market] || 4100;
  const vol = volatility[market] || 20;
  const now = Math.floor(Date.now() / 1000);
  const candles = [];

  let price = base;
  for (let i = count; i >= 0; i--) {
    const time = now - i * 3600;
    const open = price;
    const change = (Math.random() - 0.5) * vol;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * vol * 0.3;
    const low = Math.min(open, close) - Math.random() * vol * 0.3;
    price = close;
    candles.push({ time, open, high, low, close, volume: Math.floor(Math.random() * 5000 + 1000) });
  }

  return NextResponse.json(candles);
}
