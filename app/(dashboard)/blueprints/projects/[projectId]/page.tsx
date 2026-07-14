"use client";

import { createElement, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Hammer,
  Loader2,
  Map,
  Repeat,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatEstimatedTime } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { resolveLucideIcon } from "@/lib/lucide-icon";
import { resolveStepIcon, STEP_STATUS_META } from "@/lib/step-icon";
import { PHASE_STATUS_META, resolvePhaseIcon } from "@/lib/phase-icon";
import { periodLabel } from "@/lib/period";
import { getProject, syncProjectBlueprint } from "@/lib/services/projects";
import {
  buildRoadmapTree,
  calculatePhaseStatus,
  calculateProjectProgress,
  calculateStepRowStatus,
  findNextStep,
  isCountableStep,
  isStepDoneNow,
  listStepStates,
  type RoadmapTreePhaseNode,
  type RoadmapTreeKind,
  type RoadmapTreeBlockNode,
  type RoadmapTreeTypeNode,
} from "@/lib/services/step-state";
import type {
  Project,
  ProjectStepState,
  BlueprintStep,
  BlueprintPhase,
} from "@/types";

export default function ProjectRoadmapPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const { orgId } = useAuthStore();

  const [project, setProject] = useState<Project | null>(null);
  const [stepStates, setStepStates] = useState<ProjectStepState[] | null>(null);
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({
    construction: true, // Abre por defecto Construcción
    operations: true,  // Abre por defecto Operación
  });
  const [syncing, setSyncing] = useState(false);

  function reload() {
    if (!orgId) return;
    Promise.all([getProject(orgId, projectId), listStepStates(orgId, projectId)])
      .then(([p, states]) => {
        setProject(p);
        setStepStates(states);
      })
      .catch((err) => {
        toast.error("Error al cargar la hoja de ruta.");
        console.error(err);
      });
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, projectId]);

  if (!orgId || project === null || stepStates === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  const progress = calculateProjectProgress(project, stepStates);
  const next = findNextStep(project.blueprintSnapshot, stepStates);
  const nextPhaseId = next?.phase.id ?? null;
  const tree = buildRoadmapTree(project, stepStates);

  function toggleKey(key: string) {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await syncProjectBlueprint(orgId!, projectId);
      toast.success("Sincronizado con el plano original.");
      reload();
    } catch (err) {
      toast.error("No se pudo sincronizar.");
    } finally {
      setSyncing(false);
    }
  }

  function StepRow({
    step,
    phaseId,
    status,
    caption,
  }: {
    step: BlueprintStep;
    phaseId: string;
    status: "completado" | "en_progreso" | "pendiente" | "bloqueado";
    caption?: string;
  }) {
    const StepIcon = resolveStepIcon(step);
    const rowMeta = STEP_STATUS_META[status];
    return (
      <Link
        href={`/blueprints/projects/${projectId}/${phaseId}/${step.id}`}
        className={cn(
          "flex items-center gap-3 py-2.5 pr-4 pl-12 transition-colors border-b last:border-b-0 border-[#84582a]/8",
          status === "en_progreso" ? "bg-[#CA9318]/5" : "hover:bg-[#FFFDF9]/60",
        )}
      >
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            status === "completado" && "bg-[#879652] text-white",
            status === "en_progreso" && "bg-[#CA9318] text-white",
            (status === "pendiente" || status === "bloqueado") && "bg-[#ECE4DA] text-[#705e4b]",
          )}
        >
          {status === "completado" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <StepIcon className="h-3.5 w-3.5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#2b1b10]">{step.title}</p>
          {caption && <p className="text-[10px] text-[#705e4b] mt-0.5">{caption}</p>}
        </div>
        <Badge variant={rowMeta.variant} className="shrink-0">
          {rowMeta.label}
        </Badge>
        <ChevronRight className="text-[#705e4b]/70 h-3.5 w-3.5 shrink-0" />
      </Link>
    );
  }

  function renderPhaseNode(node: RoadmapTreePhaseNode, kind: RoadmapTreeKind, key: string) {
    const open = openKeys[key] ?? false;
    const PhaseIcon = resolvePhaseIcon(node.phase.title);
    const statusMeta =
      kind === "construction"
        ? PHASE_STATUS_META[calculatePhaseStatus(node.phase, stepStates!, nextPhaseId)]
        : null;
    const activeStepId =
      kind === "construction" && next && next.phase.id === node.phase.id ? next.step.id : null;

    return (
      <div key={key} className="border-t border-[#84582a]/12 bg-[#FAF7F2]/30">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleKey(key)}
            className={cn(
              "hover:bg-[#ECE4DA]/20 flex flex-1 items-center gap-3 py-2.5 pr-2 pl-8 text-left",
              node.hasNextStep && "ring-[#CA9318]/25 ring-2 ring-inset",
            )}
          >
            <div className="bg-[#ECE4DA] text-[#705e4b] flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <PhaseIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#2a1408]">{node.phase.title}</p>
              <span className="text-xs text-[#705e4b]">
                {node.progress.percent}% · {node.progress.completed} de {node.progress.total} pasos
              </span>
            </div>
            {node.hasNextStep && (
              <Badge variant="secondary" className="shrink-0 bg-[#879652]/10 text-[#879652]">
                Siguiente
              </Badge>
            )}
            {statusMeta && (
              <Badge variant={statusMeta.variant} className="shrink-0">
                {statusMeta.label}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "text-[#705e4b] h-3.5 w-3.5 shrink-0 transition-transform",
                !open && "-rotate-90",
              )}
            />
          </button>
          <Link
            href={`/blueprints/projects/${projectId}/${node.phase.id}`}
            className="text-xs font-semibold text-[#CA9318] hover:underline shrink-0 pr-4 pl-2"
          >
            Ver fase
          </Link>
        </div>
        {open && (
          <div className="divide-y divide-[#84582a]/8 bg-[#FFFDF9]/40 border-t border-[#84582a]/12">
            {node.steps.map((step) => {
              const status =
                kind === "construction"
                  ? calculateStepRowStatus(step, stepStates!, activeStepId)
                  : isStepDoneNow(
                        step,
                        stepStates!.find((s) => s.stepId === step.id),
                      )
                    ? "completado"
                    : "pendiente";
              return (
                <StepRow
                  key={step.id}
                  step={step}
                  phaseId={node.phase.id}
                  status={status}
                  caption={kind === "operations" ? periodLabel(step.type) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function renderBlockNode(block: RoadmapTreeBlockNode, kind: RoadmapTreeKind, keyPrefix: string) {
    const key = `${keyPrefix}:${block.meta.value}`;
    const open = openKeys[key] ?? false;
    const BlockIcon = block.meta.icon;
    return (
      <div key={key} className="border-t border-[#84582a]/12 bg-[#FAF7F2]/50">
        <button
          type="button"
          onClick={() => toggleKey(key)}
          className={cn(
            "hover:bg-[#ECE4DA]/20 flex w-full items-center gap-2.5 py-2.5 pr-4 pl-6 text-left",
            block.hasNextStep && "ring-[#CA9318]/15 ring-2 ring-inset",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
              block.meta.tileColor,
            )}
          >
            <BlockIcon className="h-4 w-4" />
          </div>
          <span className="text-xs flex-1 text-left font-bold tracking-wider uppercase text-[#2a1408]">
            {block.meta.label}
          </span>
          <span className="text-xs text-[#705e4b] shrink-0 font-medium mr-1">
            {block.progress.percent}% · {block.progress.completed} de {block.progress.total}
          </span>
          <ChevronDown
            className={cn(
              "text-[#705e4b] h-3.5 w-3.5 shrink-0 transition-transform",
              !open && "-rotate-90",
            )}
          />
        </button>
        {open && (
          <div className="divide-y divide-[#84582a]/12 border-t border-[#84582a]/12">
            {block.phases.map((p) => renderPhaseNode(p, kind, `${key}:${p.phase.id}`))}
          </div>
        )}
      </div>
    );
  }

  function renderTypeNode(typeNode: RoadmapTreeTypeNode) {
    const key = typeNode.kind;
    const open = openKeys[key] ?? false;
    const isConstruction = typeNode.kind === "construction";
    return (
      <div key={key} className="surface-raised rounded-2xl overflow-hidden border border-[#84582a]/12">
        <button
          type="button"
          onClick={() => toggleKey(key)}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 text-left",
            isConstruction
              ? "bg-[#5a3c1b]/5 hover:bg-[#5a3c1b]/10"
              : "bg-[#879652]/5 hover:bg-[#879652]/10",
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              isConstruction ? "bg-[#5a3c1b]/15 text-[#5a3c1b]" : "bg-[#879652]/15 text-[#879652]",
            )}
          >
            {isConstruction ? (
              <Hammer className="h-5 w-5" />
            ) : (
              <Repeat className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-base font-bold", isConstruction ? "text-[#5a3c1b]" : "text-[#879652]")} style={{ fontFamily: 'var(--font-serif)' }}>
              {isConstruction ? "Construcción (Pasos únicos)" : "Operación (Tareas recurrentes)"}
            </p>
            <span className="text-xs text-[#705e4b]">
              {isConstruction ? "Pasos de implementación que se realizan una sola vez" : "Rutinas de mantenimiento y monitoreo periódico"}
            </span>
          </div>
          {typeNode.hasNextStep && (
            <Badge variant={isConstruction ? "secondary" : "default"} className="shrink-0">
              {isConstruction ? "Siguiente recomendado" : "Pendiente"}
            </Badge>
          )}
          <span className="text-xs text-[#705e4b] shrink-0 font-bold ml-1">
            {typeNode.progress.percent}% · {typeNode.progress.completed} de{" "}
            {typeNode.progress.total}
          </span>
          <ChevronDown
            className={cn(
              "text-[#705e4b] h-4 w-4 shrink-0 transition-transform",
              !open && "-rotate-90",
            )}
          />
        </button>
        {open && (
          <div className="divide-y divide-[#84582a]/12 border-t border-[#84582a]/12">
            {typeNode.blocks.map((b) => renderBlockNode(b, typeNode.kind, key))}
            {typeNode.ungroupedPhases.map((p) =>
              renderPhaseNode(p, typeNode.kind, `${key}:${p.phase.id}`),
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/blueprints")}
          className="hover:bg-[#ECE4DA]/70 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(130,92,55,0.16)] bg-[#FFF9F1]/72 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[#705e4b]" />
        </button>
        <nav className="text-xs flex items-center gap-1.5 text-[#705e4b] font-medium">
          <button onClick={() => router.push("/dashboard")} className="hover:text-[#2b1b10]">
            Inicio
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <button onClick={() => router.push("/blueprints")} className="hover:text-[#2b1b10]">
            Planes de Cultivo
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#2b1b10] font-bold">Hoja de Ruta</span>
        </nav>
      </div>

      {/* Hero Stats */}
      <div className="surface-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-start gap-4">
        <div className="bg-[#879652]/10 text-[#879652] flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
          <Map className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 flex-1 min-w-0">
          <Badge variant="secondary" className="mb-1 bg-[#879652]/10 text-[#879652]">
            Plan de Cultivo Activo
          </Badge>
          <h1 className="text-2xl font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
            {project.name}
          </h1>
          <p className="text-sm text-[#705e4b] max-w-3xl">
            Metodología base: {project.blueprintSnapshot.name} · Versión v{project.blueprintSnapshot.version}
          </p>

          <div className="pt-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#705e4b] font-semibold">
              <span>Progreso de implementación</span>
              <span>{progress.percent}% completado ({progress.completed} de {progress.total} pasos únicos)</span>
            </div>
            <Progress value={progress.percent} />
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
            {syncing && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Recomendar Siguiente Paso */}
      {next && (
        <div className="bg-[#879652]/5 border border-[rgba(135,150,82,0.18)] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="bg-[#879652]/10 text-[#879652] w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#879652] uppercase tracking-wider">Siguiente paso recomendado</p>
              <h3 className="text-sm font-bold text-[#2a1408] mt-0.5">{next.step.title}</h3>
              <p className="text-xs text-[#705e4b] line-clamp-1 mt-0.5">{next.step.description}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() =>
              router.push(`/blueprints/projects/${projectId}/${next.phase.id}/${next.step.id}`)
            }
          >
            Continuar con el paso <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Roadmap Tree Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#2a1408] flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
          <Layers className="h-5 w-5 text-[#879652]" /> Hoja de Ruta Detallada
        </h2>
        <div className="flex flex-col gap-4">
          {renderTypeNode(tree.construction)}
          {renderTypeNode(tree.operations)}
        </div>
      </div>
    </div>
  );
}
