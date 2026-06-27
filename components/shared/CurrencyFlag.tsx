'use client';

import { flagUrl, CURRENCY_META } from '@/lib/currencies';
import type { Currency } from '@/types';

export function CurrencyFlag({ currency, className = '' }: { currency: Currency; className?: string }) {
  const { label } = CURRENCY_META[currency];
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flagUrl(currency)}
        alt={label}
        width={18}
        height={13}
        className="rounded-sm object-cover inline-block"
      />
      <span>{label}</span>
    </span>
  );
}
