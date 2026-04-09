import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { data } = await request.json();
    
    // We require the user to provide their API key from the frontend for testing to avoid hardcoding
    // Alternatively, it can be driven via process.env.GEMINI_API_KEY if configured in Vercel
    let apiKey = process.env.GEMINI_API_KEY;
    const authHeader = request.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const headerKey = authHeader.replace('Bearer ', '').trim();
      if (headerKey) apiKey = headerKey;
    }

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Server is missing GEMINI_API_KEY and No API Key provided from frontend' }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Limit data points to avoid huge payload, pick the last 15 days or relevant summarized data
    const recentData = data.slice(-15);
    const dataStr = JSON.stringify(recentData, null, 2);

    const prompt = `You are an expert financial analyst focusing on Digital Asset Treasury companies, particularly MicroStrategy (MSTR).
The user is tracking the MSTR Premium to NAV (Net Asset Value of their Bitcoin holdings). 
Here is the recent 15 days of data containing the date, MSTR price, BTC price, and the Premium %:
${dataStr}

Please provide a short, professional, and insightful summary (max 3-4 sentences) analyzing the recent trend of the premium. Mention if it's expanding or contracting, and what that might imply about market sentiment towards Bitcoin and MSTR.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ success: true, summary: response.text });
  } catch (error) {
    console.error('Error in AI summary generation:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
