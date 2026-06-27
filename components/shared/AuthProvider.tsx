'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';
import { useCurrencyStore } from '@/store/currency';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const { fetchRates } = useCurrencyStore();

  useEffect(() => {
    fetchRates();
    const unsub = onAuthStateChanged(auth, (user) => setUser(user));
    return unsub;
  }, [setUser, fetchRates]);

  return <>{children}</>;
}
