import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

// Instantiate YahooFinance class (v3 requirement)
const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});

export async function POST(request: NextRequest) {
  try {
    const { tickers } = await request.json();

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tickers array' },
        { status: 400 }
      );
    }

    const prices: { [key: string]: number | null } = {};

    // Fetch prices for all tickers
    for (const ticker of tickers) {
      try {
        const quote = await yahooFinance.quote(ticker);
        prices[ticker] = quote?.regularMarketPrice ?? null;
      } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error);
        prices[ticker] = null;
      }
    }

    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Error in stock-price API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock prices' },
      { status: 500 }
    );
  }
}

