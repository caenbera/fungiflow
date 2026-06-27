import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency, ExchangeRates } from '@/types';

interface CurrencyState {
  currency: Currency;
  rates: ExchangeRates | null;
  loading: boolean;
  setCurrency: (c: Currency) => void;
  fetchRates: () => Promise<void>;
  convert: (amountCOP: number) => number;
  formatAmount: (amountCOP: number) => string;
}

const SYMBOLS: Record<Currency, string> = {
  COP: '$',
  USD: 'US$',
  EUR: '€',
  GBP: '£',
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'COP',
      rates: null,
      loading: false,

      setCurrency: (currency) => {
        set({ currency });
        get().fetchRates();
      },

      fetchRates: async () => {
        const { rates } = get();
        const ONE_HOUR = 60 * 60 * 1000;
        if (rates && Date.now() - rates.updatedAt < ONE_HOUR) return;
        set({ loading: true });
        try {
          const res = await fetch('/api/exchange-rates');
          if (!res.ok) throw new Error('fetch failed');
          const data: ExchangeRates = await res.json();
          set({ rates: data, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      convert: (amountCOP) => {
        const { currency, rates } = get();
        if (currency === 'COP' || !rates) return amountCOP;
        return amountCOP / rates.COP * rates[currency];
      },

      formatAmount: (amountCOP) => {
        const { currency, convert } = get();
        const amount = convert(amountCOP);
        const sym = SYMBOLS[currency];
        if (currency === 'COP') {
          return sym + Math.round(amount).toLocaleString('es-CO');
        }
        return sym + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      },
    }),
    { name: 'orella-currency', partialize: (s) => ({ currency: s.currency }) }
  )
);
