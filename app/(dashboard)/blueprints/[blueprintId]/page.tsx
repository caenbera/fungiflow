"use client";

import { createElement, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Flag,
  ListChecks,
  ListTodo,
  Loader2,
  Map,
  Target,
  Wrench,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn, formatEstimatedTime } from "@/lib/utils";
import { resolveLucideIcon } from "@/lib/lucide-icon";
import { resolveStepIcon } from "@/lib/step-icon";
import { resolvePhaseIcon } from "@/lib/phase-icon";
import { getBlueprint } from "@/lib/services/blueprints";
import type { Blueprint, BlueprintDifficulty, BlueprintStep, StepResourceType } from "@/types";

const DIFFICULTY_META: Record<BlueprintDifficulty, { label: string; dots: number }> = {
  beginner: { label: "Principiante", dots: 1 },
  intermediate: { label: "Intermedio", dots: 2 },
  advanced: { label: "Avanzado", dots: 3 },
};

const PHASE_COLORS = [
  "bg-[#5a3c1b] text-white",
  "bg-[#879652] text-white",
  "bg-[#CA9318] text-white",
  "bg-[#A56F40] text-white",
];

const RESOURCE_TYPE_LABELS: Partial<Record<StepResourceType, string>> = {
  pdf: "PDF",
  word: "Documento Word",
  excel: "Plantilla Excel",
  powerpoint: "Presentación",
  template: "Plantilla",
  manual: "Manual",
  form: "Formulario",
  google_docs: "Google Doc",
  google_sheets: "Google Sheet",
};

function resourceLabel(type: StepResourceType): string {
  return RESOURCE_TYPE_LABELS[type] ?? "Recurso";
}

function countSteps(blueprint: Blueprint): number {
  return blueprint.roadmap.reduce((sum, phase) => sum + phase.steps.length, 0);
}

function phaseHours(blueprint: Blueprint, phaseId: string): number {
  const phase = blueprint.roadmap.find((p) => p.id === phaseId);
  return phase?.steps.reduce((sum, step) => sum + step.estimatedHours, 0) ?? 0;
}

export default function BlueprintSummaryPage() {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const router = useRouter();

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [selectedStep, setSelectedStep] = useState<BlueprintStep | null>(null);

  useEffect(() => {
    getBlueprint(blueprintId).then(setBlueprint);
  }, [blueprintId]);

  if (blueprint === null) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  const difficulty = DIFFICULTY_META[blueprint.difficulty];
  const sortedPhases = [...blueprint.roadmap].sort((a, b) => a.order - b.order);

  // Genera listado de todos los recursos del blueprint
  const deliverables = sortedPhases.flatMap((phase) =>
    phase.steps.flatMap((step) =>
      step.content.resources.map((r) => ({
        title: r.title,
        badge: resourceLabel(r.type),
      })),
    ),
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
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
          <span className="text-[#2b1b10] font-bold">Resumen</span>
        </nav>
      </div>

      {/* Header Card */}
      <div className="surface-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-start gap-4">
        <div className="bg-[#CA9318]/10 text-[#CA9318] flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
          {createElement(resolveLucideIcon(blueprint.icon), { className: "h-8 w-8" })}
        </div>
        <div className="space-y-1.5 flex-1 min-w-0">
          <Badge variant="secondary" className="mb-1 bg-[#879652]/10 text-[#879652]">
            Plan de Fungicultura
          </Badge>
          <h1 className="text-2xl font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
            {blueprint.name}
          </h1>
          <p className="text-sm text-[#705e4b] max-w-3xl">
            {blueprint.description}
          </p>
          <div className="text-xs text-[#705e4b] pt-2 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5" /> Nivel: {difficulty.label}
            </span>
            <span className="flex items-center gap-1">
              Dificultad:
              <span className="flex gap-0.5 ml-1">
                {[1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      dot <= difficulty.dots ? "bg-[#CA9318]" : "bg-[#ECE4DA]",
                    )}
                  />
                ))}
              </span>
            </span>
            {blueprint.estimatedDuration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Duración: {blueprint.estimatedDuration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="surface-raised rounded-2xl p-4 flex flex-col items-center text-center">
          <Flag className="text-[#CA9318] h-5 w-5" />
          <p className="text-xl font-bold mt-1.5 text-[#2b1b10]">{sortedPhases.length}</p>
          <p className="text-xs font-semibold text-[#705e4b]">Fases metodológicas</p>
        </div>
        <div className="surface-raised rounded-2xl p-4 flex flex-col items-center text-center">
          <ListChecks className="text-[#879652] h-5 w-5" />
          <p className="text-xl font-bold mt-1.5 text-[#2b1b10]">{countSteps(blueprint)}</p>
          <p className="text-xs font-semibold text-[#705e4b]">Pasos prácticos</p>
        </div>
        <div className="surface-raised rounded-2xl p-4 flex flex-col items-center text-center col-span-2 md:col-span-1">
          <FileText className="text-[#A56F40] h-5 w-5" />
          <p className="text-xl font-bold mt-1.5 text-[#2b1b10]">{deliverables.length}</p>
          <p className="text-xs font-semibold text-[#705e4b]">Guías y plantillas</p>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Roadmap Tree (2 cols) */}
        <div className="lg:col-span-2 surface-raised rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
            Roadmap del Proceso
          </h2>
          <p className="text-xs text-[#705e4b] italic">
            Haz clic en cualquier paso para abrir el visualizador detallado con las guías, checklists y consejos.
          </p>
          
          <div className="space-y-4 mt-2 border-l border-[#84582a]/20 pl-4 ml-2">
            {sortedPhases.map((phase, i) => {
              const PhaseIcon = resolvePhaseIcon(phase.title);
              const hours = phaseHours(blueprint, phase.id);
              return (
                <div key={phase.id} className="relative space-y-3">
                  {/* Phase Marker */}
                  <div className="absolute -left-[25px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF7F2] border border-[#84582a]/40">
                    <span className="h-2 w-2 rounded-full bg-[#879652]" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold",
                          PHASE_COLORS[i % PHASE_COLORS.length],
                        )}
                      >
                        {i + 1}
                      </span>
                      <h3 className="font-bold text-[#2a1408] text-sm md:text-base">{phase.title}</h3>
                      {hours > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {hours}h estimadas
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#705e4b] pl-7">{phase.description}</p>
                  </div>

                  {/* Steps inside Phase */}
                  <div className="pl-7 space-y-2">
                    {[...phase.steps]
                      .sort((a, b) => a.order - b.order)
                      .map((step) => {
                        const StepIcon = resolveStepIcon(step);
                        return (
                          <button
                            key={step.id}
                            onClick={() => setSelectedStep(step)}
                            className="surface-soft border border-[rgba(132,88,42,0.12)] hover:bg-[#FFFDF9]/80 w-full flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-150 active:translate-y-px"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#5A3519]/8 text-[#A36C35]">
                                <StepIcon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-[#2a1408] text-xs md:text-sm truncate">{step.title}</p>
                                <p className="text-[10px] text-[#705e4b] mt-0.5">
                                  {step.estimatedHours > 0 ? `${step.estimatedHours}h` : "Paso rápido"} · {step.difficulty === 'easy' ? 'Fácil' : step.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-[#705e4b]/70" />
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deliverables Panel (1 col) */}
        <div className="surface-raised rounded-2xl p-5 space-y-3.5">
          <h2 className="text-base font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
            Plantillas y Documentos
          </h2>
          <div className="flex flex-col divide-y divide-[#84582a]/12">
            {deliverables.length === 0 ? (
              <p className="text-xs text-[#705e4b] italic py-2">
                Este Blueprint no incluye documentos externos.
              </p>
            ) : (
              deliverables.map((d, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                  <span className="text-xs font-semibold text-[#2b1b10] truncate">{d.title}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {d.badge}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Step Detail Modal */}
      {selectedStep && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedStep(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader className="border-b border-[#84582a]/12 pb-3 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A3519]/8 text-[#A36C35] flex items-center justify-center flex-shrink-0">
                {createElement(resolveStepIcon(selectedStep), { className: "h-5 w-5" })}
              </div>
              <div className="min-w-0">
                <DialogTitle>{selectedStep.title}</DialogTitle>
                <p className="text-[10px] text-[#705e4b] mt-0.5">
                  Dificultad: {selectedStep.difficulty === 'easy' ? 'Fácil' : selectedStep.difficulty === 'medium' ? 'Medio' : 'Difícil'} · Tiempo: {formatEstimatedTime(selectedStep.estimatedHours)}
                </p>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Overview */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A56F40]">Descripción General</h4>
                <p className="text-sm text-[#2b1b10] bg-[#FFF9F1]/60 rounded-xl p-3 border border-[rgba(132,88,42,0.06)] leading-relaxed">
                  {selectedStep.content.overview.body || selectedStep.description}
                </p>
              </div>

              {/* Objectives */}
              {selectedStep.content.objective.description && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A56F40]">Objetivo</h4>
                  <div className="flex gap-2 text-sm text-[#2b1b10]">
                    <CheckCircle2 className="h-4 w-4 text-[#879652] shrink-0 mt-0.5" />
                    <p>{selectedStep.content.objective.description}</p>
                  </div>
                </div>
              )}

              {/* Checklist */}
              {selectedStep.content.checklist.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A56F40]">Tareas a Realizar (Checklist)</h4>
                  <div className="space-y-1.5">
                    {selectedStep.content.checklist.map((item) => (
                      <div key={item.id} className="flex items-start gap-2.5 text-sm text-[#2b1b10]">
                        <input
                          type="checkbox"
                          disabled
                          checked={false}
                          className="mt-1 h-3.5 w-3.5 rounded border-[#84582a]/40 bg-transparent text-[#879652] focus:ring-0 cursor-not-allowed"
                        />
                        <div>
                          <p className="font-semibold text-xs md:text-sm">{item.task}</p>
                          {item.description && <p className="text-xs text-[#705e4b]">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guidelines Grid (Why / Tip) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {selectedStep.content.whyItMatters && (
                  <div className="space-y-1 bg-[#ECE4DA]/20 rounded-xl p-3 border border-[rgba(132,88,42,0.06)]">
                    <h5 className="text-xs font-bold text-[#705e4b] flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-[#A36C35]" /> ¿Por qué es clave?
                    </h5>
                    <p className="text-xs text-[#2b1b10] leading-relaxed">{selectedStep.content.whyItMatters}</p>
                  </div>
                )}
                {selectedStep.content.tip && (
                  <div className="space-y-1 bg-[#CA9318]/5 rounded-xl p-3 border border-[rgba(202,147,24,0.12)]">
                    <h5 className="text-xs font-bold text-[#CA9318] flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" /> Consejo de Productor
                    </h5>
                    <p className="text-xs text-[#2b1b10] leading-relaxed">{selectedStep.content.tip}</p>
                  </div>
                )}
              </div>

              {/* Best Practices & Mistakes */}
              {((selectedStep.content.bestPractices && selectedStep.content.bestPractices.length > 0) ||
                (selectedStep.content.commonMistakes && selectedStep.content.commonMistakes.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {selectedStep.content.bestPractices && selectedStep.content.bestPractices.length > 0 && (
                    <div className="space-y-1 bg-[#879652]/5 rounded-xl p-3 border border-[rgba(135,150,82,0.12)]">
                      <h5 className="text-xs font-bold text-[#879652]">Buenas Prácticas</h5>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#2b1b10]">
                        {selectedStep.content.bestPractices.map((bp, index) => (
                          <li key={index}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedStep.content.commonMistakes && selectedStep.content.commonMistakes.length > 0 && (
                    <div className="space-y-1 bg-[#A52C26]/5 rounded-xl p-3 border border-[rgba(165,44,38,0.12)]">
                      <h5 className="text-xs font-bold text-[#A52C26] flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Errores Comunes
                      </h5>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#2b1b10]">
                        {selectedStep.content.commonMistakes.map((cm, index) => (
                          <li key={index}>{cm}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tools & Resources */}
              {((selectedStep.content.recommendedTools && selectedStep.content.recommendedTools.length > 0) ||
                (selectedStep.content.resources && selectedStep.content.resources.length > 0)) && (
                <div className="space-y-2 border-t border-[#84582a]/12 pt-3">
                  {selectedStep.content.recommendedTools && selectedStep.content.recommendedTools.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#A56F40] flex items-center gap-1">
                        <Wrench className="h-3 w-3" /> Herramientas sugeridas
                      </h4>
                      <div className="flex flex-wrap gap-2 py-0.5">
                        {selectedStep.content.recommendedTools.map((tool, index) => (
                          <a
                            key={index}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#FAF7F2] border border-[rgba(132,88,42,0.16)] hover:bg-[#ECE4DA]/40 text-xs font-semibold text-[#705e4b] px-3 py-1 rounded-full transition-colors flex items-center gap-1.5"
                          >
                            {tool.name} &rarr;
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedStep.content.resources && selectedStep.content.resources.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#A56F40]">Recursos de Descarga</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedStep.content.resources.map((res) => (
                          <div
                            key={res.id}
                            className="surface-soft rounded-xl p-2.5 border border-[rgba(132,88,42,0.12)] flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-[#2b1b10] truncate">{res.title}</p>
                              <p className="text-[10px] text-[#705e4b]">{resourceLabel(res.type)}</p>
                            </div>
                            {res.downloadUrl && (
                              <a
                                href={res.downloadUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#879652] hover:underline shrink-0"
                              >
                                Descargar
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedStep(null)}>Cerrar Visualizador</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
