'use client';

import { useCurrencyStore } from '@/store/currency';
import { CURRENCY_META, flagUrl } from '@/lib/currencies';
import type { Currency } from '@/types';

const CURRENCIES: Currency[] = ['COP', 'USD', 'EUR', 'GBP'];

export function CurrencyToggle() {
  const { currency, setCurrency, loading } = useCurrencyStore();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {CURRENCIES.map((c) => {
        const { label } = CURRENCY_META[c];
        return (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              currency === c
                ? 'bg-white dark:bg-zinc-800 shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flagUrl(c)}
              alt={label}
              width={20}
              height={15}
              className="rounded-sm object-cover"
            />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
