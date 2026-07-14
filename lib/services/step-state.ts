import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getCurrentPeriodKey } from "@/lib/period";
import { BLUEPRINT_BLOCKS, type BlockMeta } from "@/lib/phase-block";
import type {
  Blueprint,
  BlueprintPhase,
  BlueprintStep,
  Comment,
  ProgressStatus,
  Project,
  ProjectStepState,
  StepNote,
  StepStatus,
} from "@/types";

function stepStatesPath(orgId: string, projectId: string) {
  return `organizations/${orgId}/projects/${projectId}/stepStates`;
}

function notesPath(orgId: string, projectId: string, stepId: string) {
  return `${stepStatesPath(orgId, projectId)}/${stepId}/notes`;
}

function commentsPath(orgId: string, projectId: string, stepId: string) {
  return `${stepStatesPath(orgId, projectId)}/${stepId}/comments`;
}

function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return typeof value === "string" ? value : new Date().toISOString();
}

function fromFirestore(id: string, data: Record<string, unknown>): ProjectStepState {
  return {
    stepId: id,
    status: (data.status as StepStatus) ?? "pending",
    checklistDone: Array.isArray(data.checklistDone) ? (data.checklistDone as string[]) : [],
    timeInvestedMinutes:
      typeof data.timeInvestedMinutes === "number" ? data.timeInvestedMinutes : 0,
    completedAt: data.completedAt ? toIso(data.completedAt) : null,
    completedBy: (data.completedBy as string | null) ?? null,
    updatedAt: toIso(data.updatedAt),
    registroData:
      data.registroData && typeof data.registroData === "object"
        ? (data.registroData as Record<string, string>)
        : undefined,
    periodCompletions:
      data.periodCompletions && typeof data.periodCompletions === "object"
        ? Object.fromEntries(
            Object.entries(
              data.periodCompletions as Record<
                string,
                { completedAt: unknown; completedBy: string }
              >,
            ).map(([key, val]) => [
              key,
              { completedAt: toIso(val.completedAt), completedBy: val.completedBy },
            ]),
          )
        : undefined,
  };
}

export function findStepById(blueprint: Blueprint, stepId: string): BlueprintStep | null {
  for (const phase of blueprint.roadmap) {
    const step = phase.steps.find((s) => s.id === stepId);
    if (step) return step;
  }
  return null;
}

export function countBlueprintSteps(blueprint: Blueprint): number {
  return blueprint.roadmap.reduce((sum, phase) => sum + phase.steps.length, 0);
}

export function countBlueprintResources(blueprint: Blueprint): number {
  return blueprint.roadmap.reduce(
    (sum, phase) => sum + phase.steps.reduce((s, step) => s + step.content.resources.length, 0),
    0,
  );
}

export async function listStepStates(
  orgId: string,
  projectId: string,
): Promise<ProjectStepState[]> {
  const snap = await getDocs(collection(db, stepStatesPath(orgId, projectId)));
  return snap.docs.map((d) => fromFirestore(d.id, d.data()));
}

export async function getStepState(
  orgId: string,
  projectId: string,
  stepId: string,
): Promise<ProjectStepState | null> {
  const snap = await getDoc(doc(db, stepStatesPath(orgId, projectId), stepId));
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data());
}

export async function setStepStatus(
  orgId: string,
  projectId: string,
  step: BlueprintStep,
  status: StepStatus,
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa.");

  await setDoc(
    doc(db, stepStatesPath(orgId, projectId), step.id),
    {
      status,
      updatedAt: serverTimestamp(),
      ...(status === "completed"
        ? { completedAt: serverTimestamp(), completedBy: user.uid }
        : { completedAt: null, completedBy: null }),
    },
    { merge: true },
  );
}

export async function toggleChecklistItem(
  orgId: string,
  projectId: string,
  stepId: string,
  itemId: string,
  done: boolean,
): Promise<void> {
  await setDoc(
    doc(db, stepStatesPath(orgId, projectId), stepId),
    {
      checklistDone: done ? arrayUnion(itemId) : arrayRemove(itemId),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateStepRegistroField(
  orgId: string,
  projectId: string,
  stepId: string,
  fieldId: string,
  value: string,
): Promise<void> {
  await setDoc(
    doc(db, stepStatesPath(orgId, projectId), stepId),
    {
      [`registroData.${fieldId}`]: value,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function togglePeriodCompletion(
  orgId: string,
  projectId: string,
  stepId: string,
  periodKey: string,
  done: boolean,
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa.");

  await setDoc(
    doc(db, stepStatesPath(orgId, projectId), stepId),
    {
      [`periodCompletions.${periodKey}`]: done
        ? { completedAt: serverTimestamp(), completedBy: user.uid }
        : deleteField(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export interface ProjectProgress {
  total: number;
  completed: number;
  percent: number;
  status: ProgressStatus;
}

export function isCountableStep(step: BlueprintStep): boolean {
  return step.type === "one_time";
}

function isPeriodicStep(step: BlueprintStep): boolean {
  return getCurrentPeriodKey(step.type) !== null;
}

function deriveProgressStatus(completed: number, total: number): ProgressStatus {
  return completed === 0
    ? "no_iniciado"
    : completed >= total && total > 0
      ? "aprobado"
      : "en_progreso";
}

export function calculateProjectProgress(
  project: Project,
  stepStates: ProjectStepState[],
): ProjectProgress {
  const countableIds = new Set(
    project.blueprintSnapshot.roadmap
      .flatMap((phase) => phase.steps)
      .filter(isCountableStep)
      .map((s) => s.id),
  );
  const total = countableIds.size;
  const completed = stepStates.filter(
    (s) => s.status === "completed" && countableIds.has(s.stepId),
  ).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const status: ProgressStatus =
    completed === 0 ? "no_iniciado" : completed >= total && total > 0 ? "aprobado" : "en_progreso";
  return { total, completed, percent, status };
}

export function calculatePhaseProgress(
  phase: BlueprintPhase,
  stepStates: ProjectStepState[],
): ProjectProgress {
  const countableIds = new Set(phase.steps.filter(isCountableStep).map((s) => s.id));
  const relevant = stepStates.filter((s) => countableIds.has(s.stepId));
  const total = countableIds.size;
  const completed = relevant.filter((s) => s.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const status: ProgressStatus =
    completed === 0 ? "no_iniciado" : completed >= total && total > 0 ? "aprobado" : "en_progreso";
  return { total, completed, percent, status };
}

export function calculatePhaseOperationsProgress(
  phase: BlueprintPhase,
  stepStates: ProjectStepState[],
  now: Date = new Date(),
): ProjectProgress {
  const periodicSteps = phase.steps.filter(isPeriodicStep);
  const total = periodicSteps.length;
  const completed = periodicSteps.filter((step) => {
    const state = stepStates.find((s) => s.stepId === step.id);
    return isStepDoneNow(step, state, now);
  }).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent, status: deriveProgressStatus(completed, total) };
}

export function isStepBlocked(step: BlueprintStep, stepStates: ProjectStepState[]): boolean {
  if (step.dependencies.length === 0) return false;
  const doneIds = new Set(stepStates.filter((s) => s.status === "completed").map((s) => s.stepId));
  return step.dependencies.some((depId) => !doneIds.has(depId));
}

export type PhaseRowStatus =
  "pendiente" | "disponible" | "en_progreso" | "completada" | "bloqueada";

export function calculatePhaseStatus(
  phase: BlueprintPhase,
  stepStates: ProjectStepState[],
  nextPhaseId: string | null,
): PhaseRowStatus {
  const progress = calculatePhaseProgress(phase, stepStates);
  if (progress.status === "aprobado") return "completada";
  if (progress.status === "en_progreso") return "en_progreso";
  const allBlocked =
    phase.steps.length > 0 && phase.steps.every((s) => isStepBlocked(s, stepStates));
  if (allBlocked) return "bloqueada";
  if (phase.id === nextPhaseId) return "disponible";
  return "pendiente";
}

export function isStepDoneNow(
  step: BlueprintStep,
  stepState: ProjectStepState | undefined,
  now: Date = new Date(),
): boolean {
  const periodKey = getCurrentPeriodKey(step.type, now);
  if (periodKey === null) return stepState?.status === "completed";
  return Boolean(stepState?.periodCompletions?.[periodKey]);
}

export type StepRowStatus = "completado" | "en_progreso" | "pendiente" | "bloqueado";

export function calculateStepRowStatus(
  step: BlueprintStep,
  stepStates: ProjectStepState[],
  activeStepId: string | null,
): StepRowStatus {
  const state = stepStates.find((s) => s.stepId === step.id);
  if (isStepDoneNow(step, state)) return "completado";
  if (step.id === activeStepId) return "en_progreso";
  if (isStepBlocked(step, stepStates)) return "bloqueado";
  return "pendiente";
}

export function findNextStep(
  blueprint: Blueprint,
  stepStates: ProjectStepState[],
): { phase: BlueprintPhase; step: BlueprintStep } | null {
  const doneIds = new Set(stepStates.filter((s) => s.status === "completed").map((s) => s.stepId));
  const sortedPhases = [...blueprint.roadmap].sort((a, b) => a.order - b.order);
  for (const phase of sortedPhases) {
    const sortedSteps = [...phase.steps].sort((a, b) => a.order - b.order);
    for (const step of sortedSteps) {
      if (step.type === "one_time" && !doneIds.has(step.id)) return { phase, step };
    }
  }
  return null;
}

// --- Arbol del Roadmap ---

export type RoadmapTreeKind = "construction" | "operations";

export interface RoadmapTreePhaseNode {
  phase: BlueprintPhase;
  steps: BlueprintStep[];
  progress: ProjectProgress;
  hasNextStep: boolean;
}

export interface RoadmapTreeBlockNode {
  meta: BlockMeta;
  phases: RoadmapTreePhaseNode[];
  progress: ProjectProgress;
  hasNextStep: boolean;
}

export interface RoadmapTreeTypeNode {
  kind: RoadmapTreeKind;
  blocks: RoadmapTreeBlockNode[];
  ungroupedPhases: RoadmapTreePhaseNode[];
  progress: ProjectProgress;
  hasNextStep: boolean;
}

function aggregateProgress(nodes: { progress: ProjectProgress }[]): ProjectProgress {
  const total = nodes.reduce((sum, n) => sum + n.progress.total, 0);
  const completed = nodes.reduce((sum, n) => sum + n.progress.completed, 0);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent, status: deriveProgressStatus(completed, total) };
}

export function buildRoadmapTree(
  project: Project,
  stepStates: ProjectStepState[],
  now: Date = new Date(),
): { construction: RoadmapTreeTypeNode; operations: RoadmapTreeTypeNode } {
  const next = findNextStep(project.blueprintSnapshot, stepStates);
  const nextStepId = next?.step.id ?? null;
  const sortedPhases = [...project.blueprintSnapshot.roadmap].sort((a, b) => a.order - b.order);

  function buildTypeNode(kind: RoadmapTreeKind): RoadmapTreeTypeNode {
    const phaseNodes: RoadmapTreePhaseNode[] = [];
    for (const phase of sortedPhases) {
      const steps = [...phase.steps]
        .filter(kind === "construction" ? isCountableStep : isPeriodicStep)
        .sort((a, b) => a.order - b.order);
      if (steps.length === 0) continue;

      const progress =
        kind === "construction"
          ? calculatePhaseProgress(phase, stepStates)
          : calculatePhaseOperationsProgress(phase, stepStates, now);

      const hasNextStep =
        kind === "construction"
          ? steps.some((s) => s.id === nextStepId)
          : steps.some((s) => {
              const state = stepStates.find((st) => st.stepId === s.id);
              return !isStepDoneNow(s, state, now);
            });

      phaseNodes.push({ phase, steps, progress, hasNextStep });
    }

    const blocks: RoadmapTreeBlockNode[] = BLUEPRINT_BLOCKS.map((meta) => {
      const phases = phaseNodes.filter((n) => n.phase.block === meta.value);
      return {
        meta,
        phases,
        progress: aggregateProgress(phases),
        hasNextStep: phases.some((p) => p.hasNextStep),
      };
    }).filter((b) => b.phases.length > 0);

    const ungroupedPhases = phaseNodes.filter((n) => !n.phase.block);
    const allPhases = [...blocks.flatMap((b) => b.phases), ...ungroupedPhases];

    return {
      kind,
      blocks,
      ungroupedPhases,
      progress: aggregateProgress(allPhases),
      hasNextStep: allPhases.some((p) => p.hasNextStep),
    };
  }

  return {
    construction: buildTypeNode("construction"),
    operations: buildTypeNode("operations"),
  };
}

// --- Notas privadas ---

export async function listNotes(
  orgId: string,
  projectId: string,
  stepId: string,
): Promise<StepNote[]> {
  const user = auth.currentUser;
  if (!user) return [];
  const snap = await getDocs(
    query(collection(db, notesPath(orgId, projectId, stepId)), orderBy("createdAt", "asc")),
  );
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id, createdAt: toIso(d.data().createdAt) }) as StepNote)
    .filter((n) => n.authorUid === user.uid);
}

export async function addNote(
  orgId: string,
  projectId: string,
  stepId: string,
  text: string,
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa.");
  await addDoc(collection(db, notesPath(orgId, projectId, stepId)), {
    authorUid: user.uid,
    text,
    createdAt: serverTimestamp(),
  });
}

// --- Comentarios colaborativos ---

export async function listComments(
  orgId: string,
  projectId: string,
  stepId: string,
): Promise<Comment[]> {
  const snap = await getDocs(
    query(collection(db, commentsPath(orgId, projectId, stepId)), orderBy("createdAt", "asc")),
  );
  return snap.docs.map(
    (d) => ({ ...d.data(), id: d.id, createdAt: toIso(d.data().createdAt) }) as Comment,
  );
}

export async function addComment(
  orgId: string,
  projectId: string,
  stepId: string,
  text: string,
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa.");
  await addDoc(collection(db, commentsPath(orgId, projectId, stepId)), {
    authorUid: user.uid,
    authorName: user.displayName || user.email || "Usuario",
    text,
    createdAt: serverTimestamp(),
  });
}
