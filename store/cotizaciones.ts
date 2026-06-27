import { create } from 'zustand';
import type { Cotizacion } from '@/types';
import { suscribirCotizaciones } from '@/lib/firestore';

interface CotizacionesState {
  cotizaciones: Cotizacion[];
  loading: boolean;
  unsub: (() => void) | null;
  iniciar: (userId: string) => void;
  detener: () => void;
}

export const useCotizacionesStore = create<CotizacionesState>((set, get) => ({
  cotizaciones: [],
  loading: true,
  unsub: null,

  iniciar: (userId) => {
    get().detener();
    const unsub = suscribirCotizaciones(userId, (data) => {
      set({ cotizaciones: data, loading: false });
    });
    set({ unsub, loading: true });
  },

  detener: () => {
    get().unsub?.();
    set({ unsub: null, cotizaciones: [], loading: true });
  },
}));
