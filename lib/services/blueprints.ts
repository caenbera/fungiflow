import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { validateBlueprintJson } from "@/lib/blueprint-schema";
import type { Blueprint, BlueprintPhase, BlueprintStatus } from "@/types";

const COLLECTION = "blueprints";

function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return typeof value === "string" ? value : new Date().toISOString();
}

function fromFirestore(id: string, data: Record<string, unknown>): Blueprint {
  return {
    ...data,
    id,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  } as Blueprint;
}

/** Blueprints visibles para cualquier organizacion (pantalla "Elegir Blueprint"). */
export async function listPublishedBlueprints(): Promise<Blueprint[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("status", "==", "published" satisfies BlueprintStatus)),
  );
  return snap.docs.map((d) => fromFirestore(d.id, d.data()));
}

/** Todos los Blueprints sin filtrar por status (Panel de Super Admin). */
export async function listAllBlueprints(): Promise<Blueprint[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => fromFirestore(d.id, d.data()));
}

export async function getBlueprint(blueprintId: string): Promise<Blueprint | null> {
  const snap = await getDoc(doc(db, COLLECTION, blueprintId));
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data());
}

/**
 * Valida un archivo JSON contra el schema oficial y crea o actualiza el Blueprint.
 * Si ya existe un Blueprint con el mismo slug se actualiza.
 */
export async function importBlueprintFromJson(json: unknown): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa.");

  const blueprint = validateBlueprintJson(json);

  const existing = await getDocs(
    query(collection(db, COLLECTION), where("slug", "==", blueprint.slug)),
  );
  if (!existing.empty) {
    const existingRef = existing.docs[0].ref;
    await updateDoc(existingRef, { ...blueprint, updatedAt: serverTimestamp() });
    return existingRef.id;
  }

  const ref = await addDoc(collection(db, COLLECTION), {
    ...blueprint,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Borrado real del blueprint de la base de datos.
 */
export async function deleteBlueprint(blueprintId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, blueprintId));
}

export async function updateBlueprintStatus(
  blueprintId: string,
  status: BlueprintStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, blueprintId), { status, updatedAt: serverTimestamp() });
}

/** Editor del Blueprint - metadata general. */
export async function updateBlueprintMeta(
  blueprintId: string,
  data: Partial<
    Pick<
      Blueprint,
      "name" | "description" | "category" | "industry" | "difficulty" | "estimatedDuration" | "tags"
    >
  >,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, blueprintId), { ...data, updatedAt: serverTimestamp() });
}

/** Guarda el roadmap completo. */
export async function updateBlueprintRoadmap(
  blueprintId: string,
  roadmap: BlueprintPhase[],
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, blueprintId), { roadmap, updatedAt: serverTimestamp() });
}
