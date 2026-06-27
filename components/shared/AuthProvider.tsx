'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';
import { useCurrencyStore } from '@/store/currency';
import { useCotizacionesStore } from '@/store/cotizaciones';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const { fetchRates } = useCurrencyStore();
  const { iniciar, detener } = useCotizacionesStore();

  useEffect(() => {
    fetchRates();
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) iniciar(user.uid);
      else detener();
    });
    return unsub;
  }, [setUser, fetchRates, iniciar, detener]);

  return <>{children}</>;
}
