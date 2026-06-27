import { NextResponse } from 'next/server';

// Cache en memoria del servidor — se refresca cada hora
let cached: { rates: Record<string, number>; updatedAt: number } | null = null;

export async function GET() {
  const ONE_HOUR = 60 * 60 * 1000;

  if (cached && Date.now() - cached.updatedAt < ONE_HOUR) {
    return NextResponse.json(buildResponse(cached.rates, cached.updatedAt));
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey || apiKey === 'TU_EXCHANGE_RATE_API_KEY') {
    // Tasas de fallback aproximadas (actualizadas manualmente)
    const fallback = { COP: 4100, USD: 1, EUR: 0.92, GBP: 0.79 };
    return NextResponse.json(buildResponse(fallback, Date.now()), {
      headers: { 'X-Rates-Source': 'fallback' },
    });
  }

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    const rates = {
      COP: data.conversion_rates.COP,
      USD: 1,
      EUR: data.conversion_rates.EUR,
      GBP: data.conversion_rates.GBP,
    };

    cached = { rates, updatedAt: Date.now() };
    return NextResponse.json(buildResponse(rates, cached.updatedAt));
  } catch {
    const fallback = { COP: 4100, USD: 1, EUR: 0.92, GBP: 0.79 };
    return NextResponse.json(buildResponse(fallback, Date.now()), {
      headers: { 'X-Rates-Source': 'fallback' },
    });
  }
}

function buildResponse(rates: Record<string, number>, updatedAt: number) {
  return { ...rates, updatedAt };
}
