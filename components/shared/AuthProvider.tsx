'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';
import { useCurrencyStore } from '@/store/currency';
import { useCotizacionesStore } from '@/store/cotizaciones';
import { getUserRole } from '@/lib/user-role';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setRole } = useAuthStore();
  const { fetchRates } = useCurrencyStore();
  const { iniciar, detener } = useCotizacionesStore();

  useEffect(() => {
    fetchRates();
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        iniciar(user.uid);
        const role = await getUserRole(user.uid);
        setRole(role);
      } else {
        detener();
        setRole(null);
      }
    });
    return unsub;
  }, [setUser, setRole, fetchRates, iniciar, detener]);

  return <>{children}</>;
}
