import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

// Instantiate YahooFinance class (v3 requirement)
const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Alpha Vantage API - Free tier: 5 calls/min, 500/day
// Get your free API key at: https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Fetch price from Alpha Vantage
async function fetchFromAlphaVantage(ticker: string): Promise<number | null> {
  if (!ALPHA_VANTAGE_API_KEY) {
    return null;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Alpha Vantage returns data in "Global Quote" object
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      return isNaN(price) ? null : price;
    }

    // Check for error messages
    if (data['Error Message'] || data['Note']) {
      console.log(`  Alpha Vantage error for ${ticker}:`, data['Error Message'] || data['Note']);
      return null;
    }

    return null;
  } catch (error) {
    console.error(`  Alpha Vantage fetch error for ${ticker}:`, error);
    return null;
  }
}

// Fetch price from Yahoo Finance (fallback)
async function fetchFromYahooFinance(ticker: string): Promise<number | null> {
  try {
    const result = await yahooFinance.quote(ticker);
    const quote = Array.isArray(result) ? result[0] : result;
    return quote?.regularMarketPrice ?? null;
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
      throw new Error('RATE_LIMIT');
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('=== Stock Price API Request Started ===');
  
  try {
    const { tickers } = await request.json();

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      console.error('Invalid tickers array provided');
      return NextResponse.json(
        { error: 'Invalid tickers array' },
        { status: 400 }
      );
    }

    const useAlphaVantage = !!ALPHA_VANTAGE_API_KEY;
    const dataSource = useAlphaVantage ? 'Alpha Vantage' : 'Yahoo Finance (fallback)';
    
    console.log(`Processing ${tickers.length} tickers using ${dataSource}`);
    if (!useAlphaVantage) {
      console.log('⚠️  No ALPHA_VANTAGE_API_KEY found. Using Yahoo Finance (may hit rate limits).');
      console.log('💡 Get a free API key at: https://www.alphavantage.co/support/#api-key');
    }
    
    const prices: { [key: string]: number | null } = {};
    
    // Alpha Vantage: 5 calls/min = 12 seconds between calls
    // Yahoo Finance: More aggressive delays needed
    const DELAY_BETWEEN_REQUESTS = useAlphaVantage ? 13000 : 2000; // 13s for Alpha Vantage, 2s for Yahoo
    const DELAY_AFTER_BATCH = useAlphaVantage ? 0 : 5000; // No batch delay for Alpha Vantage
    const BATCH_SIZE = useAlphaVantage ? 5 : 10; // Alpha Vantage: 5 per batch (5/min limit)

    // Process tickers sequentially (one at a time) to avoid rate limits
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];
      const tickerNumber = i + 1;
      const isBatchEnd = (tickerNumber % BATCH_SIZE === 0) || (tickerNumber === tickers.length);

      try {
        console.log(`[${tickerNumber}/${tickers.length}] Fetching ${ticker}...`);
        
        let price: number | null = null;
        let source = '';

        // Try Alpha Vantage first if API key is available
        if (useAlphaVantage) {
          price = await fetchFromAlphaVantage(ticker);
          source = 'Alpha Vantage';
          
          // If Alpha Vantage fails, try Yahoo Finance as fallback
          if (price === null) {
            console.log(`  ⚠ ${ticker}: Alpha Vantage failed, trying Yahoo Finance...`);
            try {
              price = await fetchFromYahooFinance(ticker);
              source = 'Yahoo Finance (fallback)';
            } catch (fallbackError: any) {
              if (fallbackError.message === 'RATE_LIMIT') {
                console.error(`  ✗ ${ticker}: Yahoo Finance rate limited`);
              } else {
                console.error(`  ✗ ${ticker}: Yahoo Finance error - ${fallbackError.message}`);
              }
            }
          }
        } else {
          // Use Yahoo Finance only
          price = await fetchFromYahooFinance(ticker);
          source = 'Yahoo Finance';
        }
        
        if (price !== null) {
          prices[ticker] = price;
          console.log(`  ✓ ${ticker}: $${price.toFixed(2)} (${source})`);
        } else {
          prices[ticker] = null;
          console.log(`  ⚠ ${ticker}: No price data available from any source`);
        }
      } catch (error: any) {
        prices[ticker] = null;
        
        // Check if it's a rate limit error
        if (error.message === 'RATE_LIMIT' || error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
          console.error(`  ✗ ${ticker}: Rate limit hit. Waiting longer...`);
          await delay(10000); // Wait 10 seconds on rate limit
        } else {
          console.error(`  ✗ ${ticker}: Error - ${error.message || 'Unknown error'}`);
        }
      }

      // Add delay between requests (except after the last ticker)
      if (i < tickers.length - 1) {
        if (isBatchEnd && tickerNumber < tickers.length && DELAY_AFTER_BATCH > 0) {
          // Longer delay after each batch
          console.log(`  ⏸ Pausing ${DELAY_AFTER_BATCH}ms after batch of ${BATCH_SIZE}...`);
          await delay(DELAY_AFTER_BATCH);
        } else {
          // Normal delay between individual requests
          await delay(DELAY_BETWEEN_REQUESTS);
        }
      }
    }

    const totalDuration = Date.now() - startTime;
    const finalSuccessCount = Object.values(prices).filter(p => p !== null).length;
    const finalFailureCount = tickers.length - finalSuccessCount;

    console.log(`\n=== Request Completed ===`);
    console.log(`Total time: ${(totalDuration / 1000).toFixed(1)}s`);
    console.log(`Success: ${finalSuccessCount}/${tickers.length}`);
    console.log(`Failures: ${finalFailureCount}/${tickers.length}`);
    console.log(`Success rate: ${((finalSuccessCount / tickers.length) * 100).toFixed(1)}%`);

    return NextResponse.json({ prices });
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    console.error(`\n=== Request Failed after ${totalDuration}ms ===`);
    console.error('Error in stock-price API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock prices', details: error.message },
      { status: 500 }
    );
  }
}

