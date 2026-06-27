import type { Currency } from '@/types';

export const CURRENCY_META: Record<Currency, { label: string; flag: string; symbol: string }> = {
  COP: { label: 'COP', flag: '🇨🇴', symbol: '$' },
  USD: { label: 'USD', flag: '🇺🇸', symbol: 'US$' },
  EUR: { label: 'EUR', flag: '🇪🇺', symbol: '€' },
  GBP: { label: 'GBP', flag: '🇬🇧', symbol: '£' },
};

export function currencyLabel(currency: Currency) {
  const { flag, label } = CURRENCY_META[currency];
  return `${flag} ${label}`;
}
