"use client";

import { createElement, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Map,
  Sparkles,
  Target,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatEstimatedTime } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { PHASE_STATUS_META, resolvePhaseIcon } from "@/lib/phase-icon";
import { resolveStepIcon, STEP_STATUS_META } from "@/lib/step-icon";
import { getProject } from "@/lib/services/projects";
import {
  calculatePhaseProgress,
  calculatePhaseStatus,
  calculateStepRowStatus,
  findNextStep,
  listStepStates,
} from "@/lib/services/step-state";
import type { Project, ProjectStepState } from "@/types";

export default function PhaseView() {
  const { projectId, phaseId } = useParams<{ projectId: string; phaseId: string }>();
  const router = useRouter();
  const { orgId } = useAuthStore();

  const [project, setProject] = useState<Project | null>(null);
  const [stepStates, setStepStates] = useState<ProjectStepState[] | null>(null);

  useEffect(() => {
    if (!orgId) return;
    Promise.all([getProject(orgId, projectId), listStepStates(orgId, projectId)]).then(
      ([p, states]) => {
        setProject(p);
        setStepStates(states);
      },
    );
  }, [orgId, projectId]);

  if (!orgId || project === null || stepStates === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  const phase = project.blueprintSnapshot.roadmap.find((p) => p.id === phaseId);
  if (!phase) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState title="Fase no encontrada" />
      </div>
    );
  }

  const progress = calculatePhaseProgress(phase, stepStates);
  const next = findNextStep(project.blueprintSnapshot, stepStates);
  const nextPhaseId = next?.phase.id ?? null;
  const status = calculatePhaseStatus(phase, stepStates, nextPhaseId);
  const statusMeta = PHASE_STATUS_META[status];
  const activeStepId = next && next.phase.id === phase.id ? next.step.id : null;
  const sortedSteps = [...phase.steps].sort((a, b) => a.order - b.order);

  const totalEstimatedHours = sortedSteps.reduce((sum, s) => sum + s.estimatedHours, 0);
  const completedCount = sortedSteps.filter(
    (s) => stepStates.find((st) => st.stepId === s.id)?.status === "completed",
  ).length;
  const inProgressCount = activeStepId ? 1 : 0;
  const pendingCount = sortedSteps.length - completedCount - inProgressCount;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/blueprints/projects/${projectId}`)}
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
          <button onClick={() => router.push(`/blueprints/projects/${projectId}`)} className="hover:text-[#2b1b10]">
            {project.name}
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#2b1b10] font-bold">{phase.title}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phase Header Card */}
          <div className="surface-raised rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-[#879652]/10 text-[#879652] flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
                {createElement(resolvePhaseIcon(phase.title), { className: "h-7 w-7" })}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>{phase.title}</h1>
                  <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                </div>
                <p className="text-sm text-[#705e4b] mt-1">{phase.description}</p>
                
                <p className="text-xs font-semibold text-[#705e4b] mt-4 mb-1">Progreso de la fase</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={progress.percent} />
                  </div>
                  <span className="text-sm font-bold text-[#2b1b10] shrink-0">{progress.percent}%</span>
                </div>
                <span className="text-xs text-[#705e4b]">
                  {progress.completed} de {progress.total} pasos completados
                </span>
              </div>
            </div>
          </div>

          {/* Phase Objective */}
          {phase.objective && (
            <div className="bg-[#879652]/5 border border-[rgba(135,150,82,0.18)] rounded-2xl p-4 flex gap-3">
              <Target className="text-[#879652] h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#879652] uppercase tracking-wider">Objetivo de la fase</h4>
                <p className="text-sm text-[#2b1b10] mt-1 font-medium">{phase.objective}</p>
              </div>
            </div>
          )}

          {/* Steps List */}
          <Tabs defaultValue="pasos">
            <TabsList variant="line">
              <TabsTrigger value="pasos">Pasos de la fase</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>

            <TabsContent value="pasos" className="mt-3">
              <div className="surface-raised rounded-2xl overflow-hidden border border-[#84582a]/12">
                <div className="border-b border-[#84582a]/12 px-4 py-3 bg-[#FAF7F2]/50">
                  <p className="text-sm font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
                    Lista de Pasos ({sortedSteps.length})
                  </p>
                </div>
                <div className="flex flex-col divide-y divide-[#84582a]/12">
                  {sortedSteps.map((step, i) => {
                    const rowStatus = calculateStepRowStatus(step, stepStates, activeStepId);
                    const rowMeta = STEP_STATUS_META[rowStatus];
                    const StepIcon = resolveStepIcon(step);
                    const blocked = rowStatus === "bloqueado";
                    return (
                      <button
                        key={step.id}
                        onClick={() => !blocked && router.push(`/blueprints/projects/${projectId}/${phaseId}/${step.id}`)}
                        disabled={blocked}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 text-left transition-all border-l-2",
                          rowStatus === "en_progreso" ? "bg-[#CA9318]/5 border-[#CA9318]" : "hover:bg-[#FFFDF9]/60 border-transparent",
                          blocked && "opacity-55 cursor-not-allowed",
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold",
                            rowStatus === "completado" && "bg-[#879652] text-white",
                            rowStatus === "en_progreso" && "bg-[#CA9318] text-white",
                            (rowStatus === "pendiente" || rowStatus === "bloqueado") &&
                              "bg-[#ECE4DA] text-[#705e4b]",
                          )}
                        >
                          {rowStatus === "completado" ? <Check className="h-4 w-4" /> : i + 1}
                        </span>
                        <div className="bg-[#FAF7F2] text-[#A36C35] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#84582a]/12">
                          <StepIcon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#2b1b10]">{step.title}</p>
                          <p className="text-xs text-[#705e4b] truncate mt-0.5">
                            {step.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <Badge variant={rowMeta.variant}>{rowMeta.label}</Badge>
                          <span className="text-[10px] text-[#705e4b] font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formatEstimatedTime(step.estimatedHours)}
                          </span>
                        </div>
                        {!blocked && (
                          <ChevronRight className="text-[#705e4b]/70 h-4 w-4 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" className="mt-3">
              <div className="surface-raised rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#2a1408] uppercase tracking-wider">Descripción completa</h3>
                  <p className="text-sm text-[#705e4b] mt-1.5 leading-relaxed">{phase.description}</p>
                </div>
                {phase.objective && (
                  <div>
                    <h3 className="text-sm font-bold text-[#2a1408] uppercase tracking-wider">Meta / Objetivo</h3>
                    <p className="text-sm text-[#705e4b] mt-1.5 leading-relaxed">{phase.objective}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Summary */}
        <aside className="space-y-4">
          <div className="surface-raised rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>Resumen de Fase</h3>
            <div className="flex flex-col gap-2.5 text-xs text-[#705e4b]">
              <div className="flex items-center justify-between border-b border-[#84582a]/8 pb-2">
                <span>Pasos totales</span>
                <span className="font-bold text-[#2b1b10]">{sortedSteps.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#84582a]/8 pb-2">
                <span>Completados</span>
                <span className="font-bold text-[#879652]">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#84582a]/8 pb-2">
                <span>En progreso</span>
                <span className="font-bold text-[#CA9318]">{inProgressCount}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#84582a]/8 pb-2">
                <span>Pendientes</span>
                <span className="font-bold text-[#2b1b10]">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#84582a]/8 pb-2">
                <span>Tiempo estimado</span>
                <span className="font-bold text-[#2b1b10]">
                  {formatEstimatedTime(totalEstimatedHours)}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-[#705e4b] font-semibold">
                <span>Progreso</span>
                <span>{progress.percent}%</span>
              </div>
              <Progress value={progress.percent} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
