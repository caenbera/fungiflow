import type { Currency } from '@/types';

export const CURRENCY_META: Record<Currency, { label: string; flagCode: string; symbol: string }> = {
  COP: { label: 'COP', flagCode: 'co', symbol: '$' },
  USD: { label: 'USD', flagCode: 'us', symbol: 'US$' },
  EUR: { label: 'EUR', flagCode: 'eu', symbol: '€' },
  GBP: { label: 'GBP', flagCode: 'gb', symbol: '£' },
};

export function flagUrl(currency: Currency) {
  return `https://flagcdn.com/w20/${CURRENCY_META[currency].flagCode}.png`;
}

export function currencyLabel(currency: Currency) {
  return CURRENCY_META[currency].label;
}
