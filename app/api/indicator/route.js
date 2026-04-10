import YahooFinance from 'yahoo-finance2';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey', 'ripHistorical'] });

    const mstrQuote = await yahooFinance.quote('MSTR');
    const sharesOutstanding = mstrQuote.sharesOutstanding || 325954147;
    const btcHoldings = 766970;

    const date = new Date();
    date.setDate(date.getDate() - 60);
    const period1 = date.toISOString().split('T')[0];
    const period2 = new Date();

    const mstrChart = await yahooFinance.chart('MSTR', { period1, period2 });
    const btcChart = await yahooFinance.chart('BTC-USD', { period1, period2 });

    const mstrHistory = mstrChart.quotes || [];
    const btcHistory = btcChart.quotes || [];

    const btcMap = {};
    btcHistory.forEach(day => {
      if (!day.date) return;
      const dateStr = day.date.toISOString().split('T')[0];
      btcMap[dateStr] = day.adjclose || day.close;
    });

    const data = [];

    mstrHistory.forEach(day => {
      if (!day.date) return;
      const dateStr = day.date.toISOString().split('T')[0];
      const btcPrice = btcMap[dateStr];
      const mstrPrice = day.adjclose || day.close;
      if (btcPrice && mstrPrice) {
        const marketCap = mstrPrice * sharesOutstanding;
        const nav = btcPrice * btcHoldings;
        const premium = (marketCap / nav) - 1;
        
        data.push({
          date: dateStr,
          mstrPrice,
          btcPrice,
          premium: premium * 100
        });
      }
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching indicator data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
