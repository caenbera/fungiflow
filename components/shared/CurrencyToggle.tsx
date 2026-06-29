'use client';

import { useCurrencyStore } from '@/store/currency';
import { CURRENCY_META, flagUrl } from '@/lib/currencies';
import type { Currency } from '@/types';

const CURRENCIES: Currency[] = ['COP', 'USD', 'EUR', 'GBP'];

export function CurrencyToggle({ dark = false }: { dark?: boolean }) {
  const { currency, setCurrency, loading } = useCurrencyStore();

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg p-1 flex-wrap"
      style={dark
        ? { background: 'rgba(255,255,255,0.06)' }
        : { background: 'var(--muted)' }
      }
    >
      {CURRENCIES.map((c) => {
        const { label } = CURRENCY_META[c];
        const active = currency === c;
        return (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            disabled={loading}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all"
            style={active
              ? dark
                ? { background: 'rgba(202,147,24,0.2)', color: '#F2C85F', boxShadow: 'inset 0 0 0 1px rgba(202,147,24,0.3)' }
                : { background: 'white', color: 'var(--foreground)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
              : dark
                ? { color: '#907966' }
                : { color: 'var(--muted-foreground)' }
            }
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
