'use client';

import { useCurrencyStore } from '@/store/currency';
import type { Currency } from '@/types';

const CURRENCIES: { value: Currency; label: string; flag: string }[] = [
  { value: 'COP', label: 'COP', flag: '🇨🇴' },
  { value: 'USD', label: 'USD', flag: '🇺🇸' },
  { value: 'EUR', label: 'EUR', flag: '🇪🇺' },
  { value: 'GBP', label: 'GBP', flag: '🇬🇧' },
];

export function CurrencyToggle() {
  const { currency, setCurrency, loading } = useCurrencyStore();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {CURRENCIES.map((c) => (
        <button
          key={c.value}
          onClick={() => setCurrency(c.value)}
          disabled={loading}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
            currency === c.value
              ? 'bg-white dark:bg-zinc-800 shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>{c.flag}</span>
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  );
}
