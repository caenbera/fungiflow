import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, where, getDocs, getDoc, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserRole } from './user-role';

export interface Invitation {
  id: string;
  orgId: string;
  email: string;
  role: Exclude<UserRole, 'superadmin'>;
  createdBy: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  status: 'pending' | 'accepted' | 'expired';
  acceptedBy?: string;
}

const COL = 'invitations';
const EXPIRY_DAYS = 7;

function generateToken(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function crearInvitacion(
  orgId: string,
  createdBy: string,
  email: string,
  role: Exclude<UserRole, 'superadmin'>
): Promise<string> {
  const token = generateToken();
  const now = Date.now();
  const expiresAt = Timestamp.fromMillis(now + EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await addDoc(collection(db, COL), {
    token,
    orgId,
    email,
    role,
    createdBy,
    createdAt: serverTimestamp(),
    expiresAt,
    status: 'pending',
  });

  return token;
}

export async function getInvitacionByToken(token: string): Promise<(Invitation & { token: string }) | null> {
  const q = query(collection(db, COL), where('token', '==', token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, token, ...(d.data() as Omit<Invitation, 'id'>) };
}

export async function aceptarInvitacion(token: string, acceptedBy: string): Promise<Invitation & { token: string }> {
  const inv = await getInvitacionByToken(token);
  if (!inv) throw new Error('Invitación no encontrada');
  if (inv.status !== 'pending') throw new Error('La invitación ya fue usada o expiró');
  if (inv.expiresAt.toMillis() < Date.now()) {
    await updateDoc(doc(db, COL, inv.id), { status: 'expired' });
    throw new Error('La invitación ha expirado');
  }
  await updateDoc(doc(db, COL, inv.id), { status: 'accepted', acceptedBy });
  return { ...inv, status: 'accepted', acceptedBy };
}

export async function listarInvitaciones(orgId: string): Promise<(Invitation & { token: string })[]> {
  const q = query(collection(db, COL), where('orgId', '==', orgId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    token: d.data().token as string,
    ...(d.data() as Omit<Invitation, 'id'>),
  }));
}

export async function revocarInvitacion(invId: string): Promise<void> {
  await deleteDoc(doc(db, COL, invId));
}
