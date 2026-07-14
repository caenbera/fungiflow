import {
  addDoc,
  collection,
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
import { getBlueprint } from "@/lib/services/blueprints";
import type { Project } from "@/types";

function projectsPath(orgId: string) {
  return `organizations/${orgId}/projects`;
}

function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return typeof value === "string" ? value : new Date().toISOString();
}

function fromFirestore(id: string, data: Record<string, unknown>): Project {
  return {
    ...data,
    id,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  } as Project;
}

export async function createProjectFromBlueprint(
  orgId: string,
  blueprintId: string,
  name?: string,
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa.");

  const blueprint = await getBlueprint(blueprintId);
  if (!blueprint) throw new Error("El Blueprint no existe.");

  const projectName = name?.trim() || blueprint.name;
  const ref = await addDoc(collection(db, projectsPath(orgId)), {
    orgId,
    blueprintId,
    blueprintSnapshot: blueprint,
    name: projectName,
    icon: blueprint.icon,
    deletionStatus: "active",
    createdBy: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function listProjects(orgId: string): Promise<Project[]> {
  const snap = await getDocs(
    query(collection(db, projectsPath(orgId)), orderBy("createdAt", "desc")),
  );
  return snap.docs
    .map((d) => fromFirestore(d.id, d.data()))
    .filter((p) => p.deletionStatus === "active" && isValidProject(p));
}

export async function getProject(orgId: string, projectId: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, projectsPath(orgId), projectId));
  if (!snap.exists()) return null;
  const project = fromFirestore(snap.id, snap.data());
  return isValidProject(project) ? project : null;
}

function isValidProject(project: Project): boolean {
  return Boolean(project.blueprintSnapshot);
}

export async function renameProject(orgId: string, projectId: string, name: string): Promise<void> {
  await updateDoc(doc(db, projectsPath(orgId), projectId), { name, updatedAt: serverTimestamp() });
}

export async function archiveProject(orgId: string, projectId: string): Promise<void> {
  await updateDoc(doc(db, projectsPath(orgId), projectId), {
    deletionStatus: "archived",
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(orgId: string, projectId: string): Promise<void> {
  await updateDoc(doc(db, projectsPath(orgId), projectId), {
    deletionStatus: "deleted",
    updatedAt: serverTimestamp(),
  });
}

export async function syncProjectBlueprint(orgId: string, projectId: string): Promise<void> {
  const projectSnap = await getDoc(doc(db, projectsPath(orgId), projectId));
  if (!projectSnap.exists()) throw new Error("El proyecto no existe.");
  const blueprintId = (projectSnap.data() as Project).blueprintId;

  const blueprint = await getBlueprint(blueprintId);
  if (!blueprint) throw new Error("El Blueprint original ya no existe.");

  await updateDoc(doc(db, projectsPath(orgId), projectId), {
    blueprintSnapshot: blueprint,
    updatedAt: serverTimestamp(),
  });
}
