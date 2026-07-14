"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteBlueprint,
  getBlueprint,
  updateBlueprintMeta,
  updateBlueprintRoadmap,
  updateBlueprintStatus,
} from "@/lib/services/blueprints";
import type { Blueprint, BlueprintPhase, BlueprintStatus, BlueprintStep } from "@/types";

const STATUS_META: Record<
  BlueprintStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  draft: { label: "Borrador", variant: "outline" },
  published: { label: "Publicado", variant: "secondary" }, // secondary is olive in FungiFlow
  archived: { label: "Archivado", variant: "default" },
};

export default function BlueprintEditorPage() {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const router = useRouter();

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const [editingPhase, setEditingPhase] = useState<BlueprintPhase | null>(null);
  const [editingStep, setEditingStep] = useState<{ phaseId: string; step: BlueprintStep } | null>(
    null,
  );

  useEffect(() => {
    getBlueprint(blueprintId).then((b) => {
      setBlueprint(b);
      if (b) {
        setName(b.name);
        setDescription(b.description);
      }
    });
  }, [blueprintId]);

  if (blueprint === null) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  async function handleSaveMeta() {
    if (!name.trim()) return;
    setSavingMeta(true);
    try {
      await updateBlueprintMeta(blueprintId, { name: name.trim(), description });
      setBlueprint((prev) => (prev ? { ...prev, name: name.trim(), description } : prev));
      toast.success("Blueprint actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSavingMeta(false);
    }
  }

  async function handleChangeStatus(status: BlueprintStatus) {
    setChangingStatus(true);
    try {
      await updateBlueprintStatus(blueprintId, status);
      setBlueprint((prev) => (prev ? { ...prev, status } : prev));
      toast.success(`Blueprint cambiado a ${STATUS_META[status].label.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cambiar el estado.");
    } finally {
      setChangingStatus(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `¿Eliminar "${blueprint!.name}"? Esta acción no se puede deshacer y borrará la plantilla de base de datos.`,
      )
    )
      return;
    await deleteBlueprint(blueprintId);
    toast.success(`"${blueprint!.name}" eliminado.`);
    router.push("/superadmin/blueprints");
  }

  async function persistRoadmap(nextRoadmap: BlueprintPhase[]) {
    await updateBlueprintRoadmap(blueprintId, nextRoadmap);
    setBlueprint((prev) => (prev ? { ...prev, roadmap: nextRoadmap } : prev));
  }

  async function handleSavePhase(updated: BlueprintPhase) {
    const nextRoadmap = blueprint!.roadmap.map((p) => (p.id === updated.id ? updated : p));
    try {
      await persistRoadmap(nextRoadmap);
      toast.success("Fase actualizada");
      setEditingPhase(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la fase.");
    }
  }

  async function handleSaveStep(phaseId: string, updated: BlueprintStep) {
    const nextRoadmap = blueprint!.roadmap.map((phase) =>
      phase.id !== phaseId
        ? phase
        : { ...phase, steps: phase.steps.map((s) => (s.id === updated.id ? updated : s)) },
    );
    try {
      await persistRoadmap(nextRoadmap);
      toast.success("Paso actualizado");
      setEditingStep(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el paso.");
    }
  }

  const sortedPhases = [...blueprint.roadmap].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/superadmin/blueprints")}
        className="text-[#705e4b] hover:text-[#2a1408] mb-3 flex w-fit items-center gap-1.5 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Constructor
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h1
            className="text-3xl font-extrabold text-[#2a1408]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {blueprint.name}
          </h1>
          <Badge variant={STATUS_META[blueprint.status].variant}>
            {STATUS_META[blueprint.status].label}
          </Badge>
        </div>
        <div className="flex gap-2">
          {blueprint.status !== "published" && (
            <Button
              size="sm"
              onClick={() => handleChangeStatus("published")}
              disabled={changingStatus}
            >
              Publicar
            </Button>
          )}
          {blueprint.status !== "draft" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleChangeStatus("draft")}
              disabled={changingStatus}
            >
              Volver a borrador
            </Button>
          )}
          {blueprint.status !== "archived" && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleChangeStatus("archived")}
              disabled={changingStatus}
            >
              Archivar
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={handleDelete} className="text-[#a52c26]">
            <Trash2 className="h-4 w-4" /> Eliminar
          </Button>
        </div>
      </div>

      <div className="surface-raised rounded-2xl p-5 space-y-4">
        <h2
          className="text-lg font-bold text-[#2a1408]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Información General
        </h2>
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bp-name">Nombre</Label>
            <Input id="bp-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bp-description">Descripción</Label>
            <Textarea
              id="bp-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20"
            />
          </div>
          <Button
            onClick={handleSaveMeta}
            disabled={!name.trim() || savingMeta}
            className="self-start"
          >
            {savingMeta && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </div>

      <div className="surface-raised rounded-2xl p-5 space-y-4">
        <div className="border-b border-[#84582a]/12 pb-3">
          <h2
            className="text-lg font-bold text-[#2a1408]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Estructura ({sortedPhases.length} fases)
          </h2>
        </div>
        <div className="flex flex-col divide-y divide-[#84582a]/12">
          {sortedPhases.map((phase, i) => (
            <div key={phase.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="bg-[#5a3c1b]/10 text-[#5a3c1b] text-sm flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#2a1408]">{phase.title}</h3>
                    <p className="text-sm text-[#705e4b] mt-0.5">{phase.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setEditingPhase(phase)}>
                  <Pencil className="h-3.5 w-3.5" /> Editar fase
                </Button>
              </div>

              <div className="mt-3 flex flex-col gap-2 pl-10">
                {[...phase.steps]
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <div
                      key={step.id}
                      className="surface-soft border border-[rgba(132,88,42,0.12)] hover:bg-[#FFFDF9]/60 flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 transition-all duration-150"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#2a1408] text-sm truncate">{step.title}</p>
                        <p className="text-xs text-[#705e4b] mt-0.5">
                          {step.type} · {step.difficulty === 'easy' ? 'Fácil' : step.difficulty === 'medium' ? 'Medio' : 'Difícil'} · {step.estimatedHours}h
                        </p>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setEditingStep({ phaseId: phase.id, step })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingPhase && (
        <PhaseEditDialog
          phase={editingPhase}
          onClose={() => setEditingPhase(null)}
          onSave={handleSavePhase}
        />
      )}
      {editingStep && (
        <StepEditDialog
          step={editingStep.step}
          onClose={() => setEditingStep(null)}
          onSave={(updated) => handleSaveStep(editingStep.phaseId, updated)}
        />
      )}
    </div>
  );
}

function PhaseEditDialog({
  phase,
  onClose,
  onSave,
}: {
  phase: BlueprintPhase;
  onClose: () => void;
  onSave: (phase: BlueprintPhase) => void;
}) {
  const [title, setTitle] = useState(phase.title);
  const [description, setDescription] = useState(phase.description);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar fase</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Descripción</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSave({ ...phase, title, description })} disabled={!title.trim()}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StepEditDialog({
  step,
  onClose,
  onSave,
}: {
  step: BlueprintStep;
  onClose: () => void;
  onSave: (step: BlueprintStep) => void;
}) {
  const [title, setTitle] = useState(step.title);
  const [description, setDescription] = useState(step.description);
  const [difficulty, setDifficulty] = useState(step.difficulty);
  const [priority, setPriority] = useState(step.priority);
  const [estimatedHours, setEstimatedHours] = useState(String(step.estimatedHours));

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar paso</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Descripción</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Dificultad</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as typeof difficulty)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Prioridad</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Horas estimadas</Label>
              <Input
                type="number"
                min={0}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() =>
              onSave({
                ...step,
                title,
                description,
                difficulty,
                priority,
                estimatedHours: Number(estimatedHours) || 0,
              })
            }
            disabled={!title.trim()}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
