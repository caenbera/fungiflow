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

interface UserDocResult {
  role: UserRole;
  orgId: string;
}

async function ensureUserDoc(user: User): Promise<UserDocResult> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName,
      role: 'admin',
      orgId: user.uid,
      createdAt: Date.now(),
    });
    return { role: 'admin', orgId: user.uid };
  }
  const data = snap.data();
  const role = (data?.role ?? 'admin') as UserRole;
  // Back-fill orgId for existing users who registered before invitations
  const orgId = data?.orgId ?? user.uid;
  if (!data?.orgId) {
    await setDoc(ref, { orgId }, { merge: true });
  }
  return { role, orgId };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setRole, setOrgId } = useAuthStore();
  const { fetchRates } = useCurrencyStore();
  const { iniciar, detener } = useCotizacionesStore();

  useEffect(() => {
    fetchRates();
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        iniciar(user.uid);
        const { role, orgId } = await ensureUserDoc(user);
        setRole(role);
        setOrgId(orgId);
      } else {
        detener();
        setRole(null);
        setOrgId(null);
      }
    });
    return unsub;
  }, [setUser, setRole, setOrgId, fetchRates, iniciar, detener]);

  return <>{children}</>;
}
