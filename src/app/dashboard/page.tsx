"use client";
import { useState, useEffect } from "react";
import type { MarketPrice } from "@/lib/types";

const BASE_PRICES = { XAUUSD: 4105, NQ: 24100, BTC: 72200, ES: 6805, DXY: 98.75, US10Y: 4.36, VIX: 18.4 };
const BASE_NAMES = { XAUUSD: "Gold Spot", NQ: "Nasdaq 100", BTC: "Bitcoin", ES: "S&P 500", DXY: "US Dollar Index", US10Y: "US 10Y Yield", VIX: "VIX" };

export default function DashboardPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = () => {
      const data = Object.entries(BASE_PRICES).map(([s, p]) => {
        const j = 1 + (Math.random() - 0.5) * 0.006;
        const np = p * j; const ch = np - p;
        return { symbol: s, name: BASE_NAMES[s as keyof typeof BASE_NAMES], price: Math.round(np * 100) / 100, change: Math.round(ch * 100) / 100, changePercent: Math.round((ch / p) * 10000) / 100, updatedAt: new Date().toISOString() };
      });
      setPrices(data); setLoading(false);
    };
    fetchPrices(); const int = setInterval(fetchPrices, 60000);
    return () => clearInterval(int);
  }, []);

  const isPos = (n: number) => n >= 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Global Markets</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-32 bg-gray-800 animate-pulse rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prices.map((p) => (
            <div key={p.symbol} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:scale-[1.02] transition-transform">
              <div className="text-sm text-gray-400 mb-1">{p.name}</div>
              <div className="text-2xl font-mono font-bold mb-1">{p.symbol === "US10Y" ? p.price.toFixed(2) + "%" : p.price.toLocaleString()}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${isPos(p.change) ? "text-green-400" : "text-red-400"}`}>
                <span>{isPos(p.change) ? "▲" : "▼"}</span>
                <span>{p.change.toFixed(2)}</span>
                <span>({isPos(p.changePercent) ? "+" : ""}{p.changePercent.toFixed(2)}%)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
