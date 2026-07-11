import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "Real prices wired in Phase 1 via TwelveData + Finnhub" });
}
