import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'superadmin' | 'admin';

export async function getUserRole(uid: string): Promise<UserRole> {
  const snap = await getDoc(doc(db, 'users', uid));
  return (snap.data()?.role as UserRole) ?? 'admin';
}

export async function setUserRole(uid: string, role: UserRole) {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true });
}
