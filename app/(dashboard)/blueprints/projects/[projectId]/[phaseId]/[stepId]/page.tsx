"use client";

import { createElement, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Flag,
  Lightbulb,
  Loader2,
  Lock,
  Map,
  Plus,
  Send,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Wrench,
  X,
  Undo,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatEstimatedTime, formatRelativeTime } from "@/lib/utils";
import { resolveStepIcon } from "@/lib/step-icon";
import { useAuthStore } from "@/store/auth";
import { getProject } from "@/lib/services/projects";
import {
  addComment,
  calculateProjectProgress,
  findNextStep,
  findStepById,
  isStepBlocked,
  isStepDoneNow,
  listComments,
  listStepStates,
  setStepStatus,
  togglePeriodCompletion,
  toggleChecklistItem,
  updateStepRegistroField,
} from "@/lib/services/step-state";
import { getCurrentPeriodKey, periodLabel } from "@/lib/period";
import type {
  BlueprintStep,
  Comment,
  Project,
  ProjectStepState,
  StepRegistroField,
  StepStatus,
} from "@/types";

const STEP_STATUS_META: Record<
  StepStatus,
  { label: string; variant: "outline" | "default" | "secondary" | "destructive" }
> = {
  pending: { label: "Pendiente", variant: "outline" },
  in_progress: { label: "En progreso", variant: "default" },
  completed: { label: "Completado", variant: "secondary" },
  blocked: { label: "Bloqueado", variant: "destructive" },
};

export default function StepView() {
  const { projectId, phaseId, stepId } = useParams<{
    projectId: string;
    phaseId: string;
    stepId: string;
  }>();
  const router = useRouter();
  const { orgId, user } = useAuthStore();

  const [project, setProject] = useState<Project | null>(null);
  const [allStepStates, setAllStepStates] = useState<ProjectStepState[] | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [completing, setCompleting] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("guia");

  // Estado para el asistente IA simulado
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Estado para los campos de registro (auto-save status)
  const [saveStatus, setSaveStatus] = useState<Record<string, "idle" | "saving" | "saved" | "error">>({});

  function reloadData() {
    if (!orgId) return;
    Promise.all([
      getProject(orgId, projectId),
      listStepStates(orgId, projectId),
      listComments(orgId, projectId, stepId),
    ]).then(([p, states, c]) => {
      setProject(p);
      setAllStepStates(states);
      setComments(c);
      if (p) {
        const step = p.blueprintSnapshot.roadmap
          .find((ph) => ph.id === phaseId)
          ?.steps.find((s) => s.id === stepId);
        const existing = states.find((s) => s.stepId === stepId);
        if (step && (!existing || existing.status === "pending")) {
          void setStepStatus(orgId, projectId, step, "in_progress");
        }
      }
    });
  }

  useEffect(() => {
    reloadData();
    setJustCompleted(false);
    setActiveTab("guia");
    setAiMessages([]);
    setAiInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, projectId, phaseId, stepId]);

  if (!orgId || project === null || allStepStates === null) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  const phase = project.blueprintSnapshot.roadmap.find((p) => p.id === phaseId);
  const step = phase?.steps.find((s) => s.id === stepId);
  if (!phase || !step) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState title="Paso no encontrado" />
      </div>
    );
  }

  const stepState = allStepStates.find((s) => s.stepId === stepId);
  const checklistDone = new Set(stepState?.checklistDone ?? []);
  const blocked = isStepBlocked(step, allStepStates);
  const currentPeriodKey = getCurrentPeriodKey(step.type);
  const isRecurring = currentPeriodKey !== null;
  const isCompleted = isStepDoneNow(step, stepState) || justCompleted;

  if (blocked) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <EmptyState
          icon={Lock}
          title="Este paso está bloqueado"
          description="Primero completa los pasos de los que depende."
          actionLabel="Volver a la hoja de ruta"
          onAction={() => router.push(`/blueprints/projects/${projectId}`)}
        />
      </div>
    );
  }

  const sortedPhaseSteps = [...phase.steps].sort((a, b) => a.order - b.order);
  const stepPosition = sortedPhaseSteps.findIndex((s) => s.id === stepId) + 1;

  const flatSteps = [...project.blueprintSnapshot.roadmap]
    .sort((a, b) => a.order - b.order)
    .flatMap((p) =>
      [...p.steps].sort((a, b) => a.order - b.order).map((s) => ({ phaseId: p.id, stepId: s.id })),
    );
  const flatIndex = flatSteps.findIndex((s) => s.stepId === stepId);
  const prevEntry = flatIndex > 0 ? flatSteps[flatIndex - 1] : null;
  const nextEntry =
    flatIndex >= 0 && flatIndex < flatSteps.length - 1 ? flatSteps[flatIndex + 1] : null;

  const dependencyTitles = step.dependencies.map(
    (depId) => findStepById(project.blueprintSnapshot, depId)?.title ?? depId,
  );

  function upsertLocalStepState(patch: (current: ProjectStepState) => Partial<ProjectStepState>) {
    setAllStepStates((prev) => {
      const list = prev ?? [];
      const idx = list.findIndex((s) => s.stepId === stepId);
      const base: ProjectStepState =
        idx === -1
          ? {
              stepId,
              status: "pending",
              checklistDone: [],
              timeInvestedMinutes: 0,
              completedAt: null,
              completedBy: null,
              updatedAt: new Date().toISOString(),
            }
          : list[idx];
      const updated = { ...base, ...patch(base) };
      if (idx === -1) return [...list, updated];
      const nextList = [...list];
      nextList[idx] = updated;
      return nextList;
    });
  }

  async function handleToggleChecklist(itemId: string, done: boolean) {
    try {
      await toggleChecklistItem(orgId!, projectId, stepId, itemId, done);
      upsertLocalStepState((current) => ({
        checklistDone: done
          ? [...current.checklistDone, itemId]
          : current.checklistDone.filter((id) => id !== itemId),
      }));
    } catch (error) {
      toast.error("No se pudo actualizar el checklist.");
    }
  }

  async function handleSaveRegistroField(fieldId: string, value: string) {
    setSaveStatus((prev) => ({ ...prev, [fieldId]: "saving" }));
    try {
      await updateStepRegistroField(orgId!, projectId, stepId, fieldId, value);
      upsertLocalStepState((current) => ({
        registroData: { ...(current.registroData ?? {}), [fieldId]: value },
      }));
      setSaveStatus((prev) => ({ ...prev, [fieldId]: "saved" }));
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [fieldId]: "idle" }));
      }, 1500);
    } catch (error) {
      setSaveStatus((prev) => ({ ...prev, [fieldId]: "error" }));
      toast.error("Error al guardar el registro.");
    }
  }

  async function handleComplete() {
    setCompleting(true);
    try {
      if (isRecurring && currentPeriodKey) {
        await togglePeriodCompletion(orgId!, projectId, stepId, currentPeriodKey, true);
        upsertLocalStepState((current) => ({
          periodCompletions: {
            ...(current.periodCompletions ?? {}),
            [currentPeriodKey]: {
              completedAt: new Date().toISOString(),
              completedBy: user?.uid ?? "",
            },
          },
        }));
      } else {
        await setStepStatus(orgId!, projectId, step!, "completed");
        upsertLocalStepState(() => ({
          status: "completed",
          completedAt: new Date().toISOString(),
          completedBy: user?.uid ?? null,
        }));
      }
      setJustCompleted(true);
    } catch (error) {
      toast.error("No se pudo completar el paso.");
    } finally {
      setCompleting(false);
    }
  }

  async function handleAddComment() {
    if (!commentText.trim()) return;
    try {
      await addComment(orgId!, projectId, stepId, commentText.trim());
      setComments((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          authorUid: user?.uid ?? "",
          authorName: user?.displayName || user?.email || "Usuario",
          text: commentText.trim(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setCommentText("");
    } catch (err) {
      toast.error("Error al añadir comentario.");
    }
  }

  // Interacción simulada del asistente IA con contexto del paso
  async function handleAiPrompt(prompt: string) {
    if (aiLoading) return;
    setAiLoading(true);
    setAiMessages((prev) => [...prev, { role: "user", text: prompt }]);
    
    // Simular retraso y respuesta técnica
    setTimeout(() => {
      let reply = "";
      const lower = prompt.toLowerCase();
      if (lower.includes("idea") || lower.includes("ejemplo")) {
        reply = `Para el paso "${step!.title}", un ejemplo típico en cultivo de setas Orellana o Shiitake es monitorizar meticulosamente la pasteurización del sustrato (bagazo de caña o viruta de madera) a 80°C por 4 horas para asegurar la eliminación de competidores sin degradar los nutrientes.`;
      } else if (lower.includes("checklist") || lower.includes("completar")) {
        reply = `Para completar este checklist con éxito, asegúrate de desinfectar previamente todos los mesones con alcohol al 70% o cloro diluido, y encender la cabina de flujo laminar 15 minutos antes de la inoculación.`;
      } else {
        reply = `Basado en el contexto de "${step!.title}", te sugiero documentar los parámetros críticos en la pestaña de Registro (humedad relativa > 85%, temperatura entre 18-24°C y ventilación de 4 recambios de aire por hora en la sala de fructificación).`;
      }
      setAiMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setAiLoading(false);
    }, 1500);
  }

  // PANTALLA DE CELEBRACIÓN DEL PASO COMPLETADO
  if (isCompleted && justCompleted) {
    const nextStep = findNextStep(project.blueprintSnapshot, allStepStates);
    const completedAt = stepState?.completedAt ? new Date(stepState.completedAt) : new Date();
    const learnings = step.content.learnings ?? [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-1.5 text-xs text-[#705e4b] font-medium">
          <Map className="h-3.5 w-3.5" />
          <Link href={`/blueprints/projects/${projectId}`} className="hover:text-[#2b1b10]">
            Roadmap
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/blueprints/projects/${projectId}/${phaseId}`} className="hover:text-[#2b1b10]">
            {phase.title}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#2b1b10] font-bold">{step.title}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-body font-semibold">Paso completado</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            {/* Celebration Card */}
            <div className="bg-[#879652]/5 border border-[rgba(135,150,82,0.22)] rounded-2xl p-8 text-center relative overflow-hidden flex flex-col items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <Star className="text-[#CA9318] absolute -top-1 left-1 h-4 w-4 fill-[#CA9318]" />
                <Star className="text-[#CA9318] absolute top-3 -right-3 h-3 w-3 fill-[#CA9318]" />
                <Star className="text-[#CA9318] absolute bottom-0 -left-4 h-3.5 w-3.5 fill-[#CA9318]" />
                <div className="bg-[#879652] flex h-16 w-16 items-center justify-center rounded-full shadow-lg">
                  <Check className="h-8 w-8 text-white stroke-[3px]" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-[#2a1408] mt-4" style={{ fontFamily: 'var(--font-serif)' }}>
                ¡Paso Completado con Éxito!
              </h1>
              <p className="text-sm text-[#705e4b] mt-1 max-w-md">
                Has completado la tarea en la fase **"{phase.title}"**. ¡Buen trabajo de monitoreo!
              </p>
            </div>

            {/* Lessons Learned */}
            {learnings.length > 0 && (
              <div className="surface-raised rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
                  Aprendizajes Clave de este Paso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learnings.map((item, index) => {
                    const LearnIcon = [Target, Lightbulb, CheckCircle2][index % 3];
                    return (
                      <div key={index} className="surface-soft border border-[rgba(132,88,42,0.12)] p-4 rounded-xl flex gap-3">
                        <div className="bg-[#879652]/10 text-[#879652] flex h-8 w-8 items-center justify-center rounded-lg shrink-0">
                          <LearnIcon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#2b1b10]">{item.title}</h4>
                          <p className="text-xs text-[#705e4b] mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inspirational Quote */}
            {step.content.inspirationalQuote && (
              <div className="bg-[#FFF9F1]/60 border border-[rgba(130,92,55,0.16)] rounded-2xl p-5 italic text-[#302D28] text-sm text-center">
                "{step.content.inspirationalQuote}"
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <aside className="space-y-4">
            <div className="surface-raised rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#2a1408] uppercase tracking-wider">¿Qué sigue?</h3>
              {nextStep ? (
                <div className="space-y-3">
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#84582a]/12 space-y-1">
                    <p className="text-[10px] font-bold text-[#879652] uppercase tracking-widest">Siguiente Paso</p>
                    <h4 className="font-bold text-xs text-[#2b1b10] line-clamp-1">{nextStep.step.title}</h4>
                    <p className="text-[10px] text-[#705e4b] line-clamp-2 leading-relaxed">{nextStep.step.description}</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setJustCompleted(false);
                      router.push(
                        `/blueprints/projects/${projectId}/${nextStep.phase.id}/${nextStep.step.id}`,
                      );
                    }}
                  >
                    Continuar <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-[#705e4b]">
                    ¡Increíble! Has implementado todos los pasos únicos de este plan de cultivo.
                  </p>
                  <Button className="w-full" onClick={() => router.push(`/blueprints/projects/${projectId}`)}>
                    Volver a Hoja de Ruta
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // PÁGINA PRINCIPAL DE DETALLE DEL PASO (TABS + SIDEBAR)
  return (
    <div className="space-y-6">
      {/* Navigation header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
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
            <button onClick={() => router.push(`/blueprints/projects/${projectId}`)} className="hover:text-[#2b1b10] truncate max-w-[80px] md:max-w-none">
              {project.name}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button onClick={() => router.push(`/blueprints/projects/${projectId}/${phaseId}`)} className="hover:text-[#2b1b10] truncate max-w-[80px] md:max-w-none">
              {phase.title}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#2b1b10] font-bold truncate max-w-[80px] md:max-w-none">{step.title}</span>
          </nav>
        </div>

        {/* Completion button */}
        {!isCompleted && (
          <Button onClick={handleComplete} disabled={completing} className="shadow-md">
            {completing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            Marcar paso como completado
          </Button>
        )}
      </div>

      {/* Hero Title */}
      <div className="surface-raised rounded-2xl p-5 flex items-start gap-4">
        <div className="bg-[#5A3519]/8 text-[#A36C35] flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#84582a]/12">
          {createElement(resolveStepIcon(step), { className: "h-6 w-6" })}
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>{step.title}</h1>
            <Badge variant={isCompleted ? "secondary" : "default"}>
              {isCompleted ? "Completado" : "En progreso"}
            </Badge>
          </div>
          <p className="text-sm text-[#705e4b] leading-relaxed">{step.description}</p>
        </div>
      </div>

      {/* Main Grid: Tabs and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tabs area (col-span-2) */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="line">
              <TabsTrigger value="guia">Guía del Paso</TabsTrigger>
              <TabsTrigger value="registro">Registro del Paso</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="comentarios">Comentarios ({comments.length})</TabsTrigger>
            </TabsList>

            {/* TAB 1: GUÍA */}
            <TabsContent value="guia" className="mt-4 space-y-4">
              <div className="surface-raised rounded-2xl p-5 space-y-4">
                {/* Overview Summary */}
                {step.content.overview.summary && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#A56F40]">Resumen Ejecutivo</h3>
                    <p className="text-sm text-[#2b1b10] leading-relaxed font-semibold">
                      {step.content.overview.summary}
                    </p>
                  </div>
                )}

                {/* Body Text */}
                {step.content.overview.body && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#A56F40]">Instrucciones Detalladas</h3>
                    <p className="text-sm text-[#705e4b] leading-relaxed whitespace-pre-line">
                      {step.content.overview.body}
                    </p>
                  </div>
                )}

                {/* Objective */}
                {step.content.objective.description && (
                  <div className="space-y-1.5 border-t border-[#84582a]/8 pt-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#A56F40]">Objetivo Esperado</h3>
                    <div className="flex gap-2 text-sm text-[#2b1b10] font-medium">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#879652] shrink-0 mt-0.5" />
                      <p>{step.content.objective.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid: Why & Tip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step.content.whyItMatters && (
                  <div className="surface-raised rounded-2xl p-5 space-y-1 bg-[#ECE4DA]/15">
                    <h4 className="text-xs font-bold text-[#7a4010] flex items-center gap-1.5 uppercase tracking-wider">
                      <BookOpen className="h-4 w-4 text-[#A36C35]" /> ¿Por qué importa?
                    </h4>
                    <p className="text-xs text-[#705e4b] leading-relaxed">{step.content.whyItMatters}</p>
                  </div>
                )}
                {step.content.tip && (
                  <div className="surface-raised rounded-2xl p-5 space-y-1 bg-[#CA9318]/5 border border-[rgba(202,147,24,0.12)]">
                    <h4 className="text-xs font-bold text-[#CA9318] flex items-center gap-1.5 uppercase tracking-wider">
                      <Lightbulb className="h-4 w-4" /> Consejo Práctico
                    </h4>
                    <p className="text-xs text-[#2b1b10] leading-relaxed">{step.content.tip}</p>
                  </div>
                )}
              </div>

              {/* Best Practices and Mistakes */}
              {((step.content.bestPractices && step.content.bestPractices.length > 0) ||
                (step.content.commonMistakes && step.content.commonMistakes.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.content.bestPractices && step.content.bestPractices.length > 0 && (
                    <div className="surface-raised rounded-2xl p-5 bg-[#879652]/5 border border-[rgba(135,150,82,0.12)] space-y-2">
                      <h4 className="text-xs font-bold text-[#879652] uppercase tracking-wider">Buenas Prácticas</h4>
                      <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#705e4b] font-semibold">
                        {step.content.bestPractices.map((bp, index) => (
                          <li key={index}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.content.commonMistakes && step.content.commonMistakes.length > 0 && (
                    <div className="surface-raised rounded-2xl p-5 bg-[#A52C26]/5 border border-[rgba(165,44,38,0.12)] space-y-2">
                      <h4 className="text-xs font-bold text-[#A52C26] flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertTriangle className="h-4 w-4" /> Errores Comunes
                      </h4>
                      <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#705e4b]">
                        {step.content.commonMistakes.map((cm, index) => (
                          <li key={index}>{cm}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* TAB 2: REGISTRO (ÁREA DE TRABAJO - FORMULARIO DINÁMICO) */}
            <TabsContent value="registro" className="mt-4">
              <div className="surface-raised rounded-2xl p-6 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
                    Registro de Parámetros del Paso
                  </h3>
                  <p className="text-xs text-[#705e4b] mt-0.5">
                    Rellena la información de trabajo técnica del paso. Se guardará de manera automática.
                  </p>
                </div>

                {!step.content.registroFields || step.content.registroFields.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#705e4b] italic">
                    Este paso es puramente metodológico y no requiere registros específicos de datos.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {step.content.registroFields.map((field) => {
                      const value = stepState?.registroData?.[field.id] ?? "";
                      const status = saveStatus[field.id] || "idle";

                      return (
                        <div key={field.id} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`field-${field.id}`} className="font-bold">
                              {field.label} {field.required && <span className="text-[#a52c26]">*</span>}
                            </Label>
                            {status === "saving" && <span className="text-[10px] text-[#CA9318] animate-pulse">Guardando...</span>}
                            {status === "saved" && <span className="text-[10px] text-[#879652] font-semibold">Guardado</span>}
                            {status === "error" && <span className="text-[10px] text-[#a52c26] font-semibold">Error al guardar</span>}
                          </div>

                          {/* TEXT, EMAIL, PHONE, URL */}
                          {(field.type === "text" || field.type === "email" || field.type === "phone" || field.type === "url") && (
                            <Input
                              id={`field-${field.id}`}
                              type={field.type === "email" ? "email" : "text"}
                              value={value}
                              onChange={(e) =>
                                upsertLocalStepState((current) => ({
                                  registroData: { ...(current.registroData ?? {}), [field.id]: e.target.value },
                                }))
                              }
                              onBlur={(e) => handleSaveRegistroField(field.id, e.target.value)}
                              placeholder={field.placeholder}
                            />
                          )}

                          {/* TEXTAREA */}
                          {field.type === "textarea" && (
                            <Textarea
                              id={`field-${field.id}`}
                              value={value}
                              onChange={(e) =>
                                upsertLocalStepState((current) => ({
                                  registroData: { ...(current.registroData ?? {}), [field.id]: e.target.value },
                                }))
                              }
                              onBlur={(e) => handleSaveRegistroField(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="min-h-24"
                            />
                          )}

                          {/* NUMBER */}
                          {field.type === "number" && (
                            <div className="relative">
                              <Input
                                id={`field-${field.id}`}
                                type="number"
                                value={value}
                                onChange={(e) =>
                                  upsertLocalStepState((current) => ({
                                    registroData: { ...(current.registroData ?? {}), [field.id]: e.target.value },
                                  }))
                                }
                                onBlur={(e) => handleSaveRegistroField(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                className={cn(field.unit && "pr-12")}
                              />
                              {field.unit && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#705e4b]">
                                  {field.unit}
                                </span>
                              )}
                            </div>
                          )}

                          {/* DATE */}
                          {field.type === "date" && (
                            <Input
                              id={`field-${field.id}`}
                              type="date"
                              value={value}
                              onChange={(e) => {
                                upsertLocalStepState((current) => ({
                                  registroData: { ...(current.registroData ?? {}), [field.id]: e.target.value },
                                }));
                                handleSaveRegistroField(field.id, e.target.value);
                              }}
                            />
                          )}

                          {/* CHECKBOX */}
                          {field.type === "checkbox" && (
                            <div className="flex items-center gap-2 py-1">
                              <input
                                id={`field-${field.id}`}
                                type="checkbox"
                                checked={value === "true"}
                                onChange={(e) => {
                                  const val = String(e.target.checked);
                                  upsertLocalStepState((current) => ({
                                    registroData: { ...(current.registroData ?? {}), [field.id]: val },
                                  }));
                                  handleSaveRegistroField(field.id, val);
                                }}
                                className="h-4.5 w-4.5 rounded border-[#84582a]/40 bg-transparent text-[#879652] focus:ring-0"
                              />
                              <span className="text-xs text-[#705e4b]">{field.placeholder || "Marcar opción"}</span>
                            </div>
                          )}

                          {/* COLOR */}
                          {field.type === "color" && (
                            <div className="flex items-center gap-2">
                              <input
                                id={`field-${field.id}`}
                                type="color"
                                value={value || "#879652"}
                                onChange={(e) => {
                                  upsertLocalStepState((current) => ({
                                    registroData: { ...(current.registroData ?? {}), [field.id]: e.target.value },
                                  }));
                                  handleSaveRegistroField(field.id, e.target.value);
                                }}
                                className="h-8 w-14 rounded-lg border border-[rgba(130,92,55,0.16)] cursor-pointer"
                              />
                              <span className="text-xs text-[#705e4b]">{value || "#879652"}</span>
                            </div>
                          )}

                          {/* SELECT */}
                          {field.type === "select" && field.options && (
                            <Select
                              value={value}
                              onValueChange={(v) => handleSaveRegistroField(field.id, v || "")}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={field.placeholder || "Selecciona..."} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {field.helpText && <p className="text-[10px] text-[#705e4b] italic">{field.helpText}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 3: CHECKLIST */}
            <TabsContent value="checklist" className="mt-4">
              <div className="surface-raised rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
                    Checklist del Paso
                  </h3>
                  <p className="text-xs text-[#705e4b] mt-0.5">
                    Tacha las tareas obligatorias para completar este paso.
                  </p>
                </div>

                {step.content.checklist.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#705e4b] italic">
                    Este paso no incluye un checklist obligatorio.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {step.content.checklist.map((item) => {
                      const isDone = checklistDone.has(item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 bg-[#FAF7F2]/50 border border-[rgba(132,88,42,0.06)] rounded-xl p-3.5 hover:bg-[#FAF7F2] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={(e) => handleToggleChecklist(item.id, e.target.checked)}
                            className="mt-1 h-4.5 w-4.5 rounded border-[#84582a]/40 bg-transparent text-[#879652] focus:ring-0 cursor-pointer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className={cn("text-sm font-semibold text-[#2b1b10]", isDone && "line-through text-[#705e4b]")}>
                              {item.task}
                            </p>
                            {item.description && (
                              <p className="text-xs text-[#705e4b] mt-0.5 leading-relaxed">{item.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 4: COMENTARIOS */}
            <TabsContent value="comentarios" className="mt-4">
              <div className="surface-raised rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
                  Notas y Comentarios del Equipo
                </h3>

                {/* Comments List */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {comments.length === 0 ? (
                    <p className="text-xs text-[#705e4b] italic py-4 text-center">
                      No hay comentarios creados. Escribe una nota abajo.
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="bg-[#FAF7F2] border border-[#84582a]/8 rounded-xl p-3 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#2a1408]">{c.authorName}</span>
                          <span className="text-[10px] text-[#705e4b]">{formatRelativeTime(c.createdAt)}</span>
                        </div>
                        <p className="text-xs text-[#302D28] leading-relaxed whitespace-pre-wrap">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2 border-t border-[#84582a]/12 pt-3">
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escribe una nota para el equipo..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button size="icon-sm" onClick={handleAddComment} disabled={!commentText.trim()}>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation Steps Buttons (Prev / Next) */}
          <div className="flex items-center justify-between pt-4 border-t border-[#84582a]/12 mt-6">
            {prevEntry ? (
              <button
                onClick={() =>
                  router.push(`/blueprints/projects/${projectId}/${prevEntry.phaseId}/${prevEntry.stepId}`)
                }
                className="hover:bg-[#ECE4DA]/70 flex h-9 px-4 items-center justify-center rounded-lg border border-[rgba(130,92,55,0.16)] bg-[#FFF9F1]/72 text-xs font-bold text-[#705e4b] gap-1.5 transition-colors"
              >
                &larr; Paso anterior
              </button>
            ) : (
              <div />
            )}

            {nextEntry ? (
              <button
                onClick={() =>
                  router.push(`/blueprints/projects/${projectId}/${nextEntry.phaseId}/${nextEntry.stepId}`)
                }
                className="hover:bg-[#ECE4DA]/70 flex h-9 px-4 items-center justify-center rounded-lg border border-[rgba(130,92,55,0.16)] bg-[#FFF9F1]/72 text-xs font-bold text-[#705e4b] gap-1.5 transition-colors"
              >
                Siguiente paso &rarr;
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Support Sidebar area (col-span-1) */}
        <aside className="space-y-4">
          {/* Box 1: Recursos de Apoyo */}
          <div className="surface-raised rounded-2xl p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-[#2a1408] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-[#A56F40]" /> Recursos de Apoyo
            </h3>
            <div className="flex flex-col divide-y divide-[#84582a]/12">
              {step.content.resources.length === 0 ? (
                <p className="text-xs text-[#705e4b] italic py-2">
                  No hay archivos anexos en este paso.
                </p>
              ) : (
                step.content.resources.map((res) => (
                  <div key={res.id} className="py-2.5 flex items-center justify-between gap-2 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#2b1b10] truncate">{res.title}</p>
                      <p className="text-[10px] text-[#705e4b] uppercase font-semibold">{res.type}</p>
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
                ))
              )}
            </div>
          </div>

          {/* Box 2: Asistente de Ideas IA */}
          <div className="surface-raised rounded-2xl p-5 bg-[#CA9318]/5 border border-[rgba(202,147,24,0.12)] space-y-3.5">
            <h3 className="text-sm font-bold text-[#CA9318] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 fill-current" /> Asistente de Ideas
            </h3>

            {/* Sugerencias de prompt */}
            {step.content.assistant.suggestions.length > 0 && aiMessages.length === 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-[#705e4b]">Preguntas recomendadas:</p>
                <div className="flex flex-col gap-1.5">
                  {step.content.assistant.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleAiPrompt(suggestion)}
                      className="text-left bg-white border border-[#CA9318]/20 hover:bg-[#CA9318]/10 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#CA9318] transition-colors leading-relaxed shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversación del Asistente */}
            {aiMessages.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl p-2.5 text-xs leading-relaxed",
                      msg.role === "user"
                        ? "bg-[#FAF7F2] text-[#2b1b10] border border-[#84582a]/8 ml-4"
                        : "bg-white text-[#705e4b] border border-[#CA9318]/15 mr-4 font-medium"
                    )}
                  >
                    <p className="font-bold text-[9px] uppercase tracking-wider mb-0.5 text-[#A56F40]">
                      {msg.role === "user" ? "Tú" : "Asistente"}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-1 text-xs text-[#CA9318] italic animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" /> Pensando ideas...
                  </div>
                )}
              </div>
            )}

            {/* Input para hacer preguntas */}
            <div className="flex gap-1.5 border-t border-[#CA9318]/20 pt-2.5 mt-2">
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Preguntar al asistente..."
                className="flex-1 text-xs h-8 bg-white"
                onKeyDown={(e) => e.key === "Enter" && aiInput.trim() && handleAiPrompt(aiInput.trim())}
              />
              <Button
                size="icon-sm"
                className="h-8 w-8 bg-[#CA9318] hover:bg-[#8A6A08] text-white shrink-0"
                onClick={() => {
                  if (aiInput.trim()) {
                    handleAiPrompt(aiInput.trim());
                    setAiInput("");
                  }
                }}
                disabled={aiLoading || !aiInput.trim()}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
