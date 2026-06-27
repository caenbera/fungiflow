import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, where, onSnapshot, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Cotizacion, CategoriaCotizacion, CotizacionItem } from '@/types';

const COL = 'cotizaciones';

export function suscribirCotizaciones(
  userId: string,
  onChange: (cotizaciones: Cotizacion[]) => void
) {
  const q = query(collection(db, COL), where('userId', '==', userId));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Cotizacion, 'id'>),
    }));
    onChange(data);
  });
}

export async function guardarCotizacion(
  userId: string,
  categoria: CategoriaCotizacion,
  nombre: string,
  items: Omit<CotizacionItem, 'id' | 'subtotal'>[],
  notas: string
): Promise<string> {
  const itemsConId: CotizacionItem[] = items.map((item, i) => ({
    ...item,
    id: `item-${Date.now()}-${i}`,
    subtotal: (Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0),
  }));

  const total = itemsConId.reduce((acc, it) => acc + it.subtotal, 0);

  const ref = await addDoc(collection(db, COL), {
    userId,
    categoria,
    nombre: nombre || categoria,
    items: itemsConId,
    total,
    notas,
    creadoEn: Date.now(),
    actualizadoEn: Date.now(),
  });

  return ref.id;
}

export async function actualizarCotizacion(
  id: string,
  nombre: string,
  items: Omit<CotizacionItem, 'id' | 'subtotal'>[],
  notas: string
) {
  const itemsConId: CotizacionItem[] = items.map((item, i) => ({
    ...item,
    id: `item-${Date.now()}-${i}`,
    subtotal: (Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0),
  }));
  const total = itemsConId.reduce((acc, it) => acc + it.subtotal, 0);

  await updateDoc(doc(db, COL, id), {
    nombre,
    items: itemsConId,
    total,
    notas,
    actualizadoEn: Date.now(),
  });
}

export async function eliminarCotizacion(id: string) {
  await deleteDoc(doc(db, COL, id));
}
