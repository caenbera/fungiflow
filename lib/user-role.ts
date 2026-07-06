import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'superadmin' | 'admin' | 'operador' | 'lector';

export interface UserProfile {
  role: UserRole;
  orgId: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
  const snap = await getDoc(doc(db, 'users', uid));
  const data = snap.data();
  return {
    role: (data?.role as UserRole) ?? 'admin',
    orgId: data?.orgId ?? uid,
  };
}

export async function getUserRole(uid: string): Promise<UserRole> {
  const profile = await getUserProfile(uid);
  return profile.role;
}

export async function setUserRole(uid: string, role: UserRole) {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true });
}

export async function setUserProfile(uid: string, profile: Partial<UserProfile>) {
  await setDoc(doc(db, 'users', uid), profile, { merge: true });
}
