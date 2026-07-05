'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth';
import { useCurrencyStore } from '@/store/currency';
import { useCotizacionesStore } from '@/store/cotizaciones';
import type { UserRole } from '@/lib/user-role';

async function ensureUserDoc(user: User): Promise<UserRole> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName,
      role: 'admin',
      createdAt: Date.now(),
    });
    return 'admin';
  }
  return (snap.data()?.role ?? 'admin') as UserRole;
}

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
        const role = await ensureUserDoc(user);
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
