"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Filter, Layers, ListChecks, Loader2, Map, Plus, Play, FolderDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/ui/search-bar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { resolveLucideIcon } from "@/lib/lucide-icon";
import { listPublishedBlueprints } from "@/lib/services/blueprints";
import { createProjectFromBlueprint, listProjects } from "@/lib/services/projects";
import type { Blueprint, BlueprintDifficulty, Project } from "@/types";

const DIFFICULTY_LABELS: Record<BlueprintDifficulty, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const TILE_COLORS = [
  "bg-[#5a3c1b]/10 text-[#5a3c1b]",
  "bg-[#879652]/10 text-[#879652]",
  "bg-[#CA9318]/10 text-[#CA9318]",
  "bg-[#A56F40]/10 text-[#A56F40]",
];

export default function ChooseBlueprintPage() {
  const router = useRouter();
  const { orgId } = useAuthStore();

  const [blueprints, setBlueprints] = useState<Blueprint[] | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<BlueprintDifficulty | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado del modal de inicialización
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [projectName, setProjectName] = useState("");
  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    Promise.all([listPublishedBlueprints(), listProjects(orgId)])
      .then(([bp, proj]) => {
        setBlueprints(bp);
        setProjects(proj);
      })
      .catch((err) => {
        toast.error("Error al cargar los datos.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  if (loading || blueprints === null || projects === null) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Filtrado de blueprints de fungicultura
  const fungiculturaBlueprints = blueprints.filter((b) => {
    const isFungicultura = [b.name, b.description, b.category, b.industry, ...b.tags].some((field) =>
      ["hongo", "fungi", "orellana", "micelio", "champig", "seta", "shroom"].some((kw) =>
        field?.toLowerCase().includes(kw)
      )
    );
    if (!isFungicultura) return false;

    const matchesSearch =
      !search ||
      [b.name, b.description, b.category, b.industry, ...b.tags].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase()),
      );
    const matchesDifficulty = !difficulty || b.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Maneja clic en tarjeta del blueprint
  function handleBlueprintClick(bp: Blueprint) {
    const existing = (projects || []).filter((p) => p.blueprintId === bp.id);
    setSelectedBlueprint(bp);
    setProjectName(bp.name);
    setExistingProjects(existing);
  }

  // Inicia una nueva instancia de proyecto
  async function handleStartProject() {
    if (!orgId || !selectedBlueprint) return;
    setCreating(true);
    try {
      const projectId = await createProjectFromBlueprint(
        orgId,
        selectedBlueprint.id,
        projectName.trim(),
      );
      toast.success("Plan de cultivo iniciado.");
      setSelectedBlueprint(null);
      router.push(`/blueprints/projects/${projectId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al iniciar el proyecto.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#879652]/10 text-[#879652] w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Map className="h-5 w-5" />
          </div>
          <div>
            <h1
              className="text-3xl font-extrabold text-[#2a1408]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Planes de Cultivo (Blueprints)
            </h1>
            <p className="text-sm text-[#705e4b] mt-0.5">
              Guías metodológicas interactivas y áreas de trabajo para el cultivo de hongos comestibles y medicinales.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar por nombre, etiquetas..."
            className="w-64"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4" /> Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Label className="mb-1.5 block text-xs font-bold text-[#705e4b]">Dificultad</Label>
              <Select
                value={difficulty ?? "all"}
                onValueChange={(v) =>
                  setDifficulty(v === "all" ? null : (v as BlueprintDifficulty))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {(Object.keys(DIFFICULTY_LABELS) as BlueprintDifficulty[]).map((d) => (
                    <SelectItem key={d} value={d}>
                      {DIFFICULTY_LABELS[d]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 1. Planes Activos (Proyectos Iniciados) */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <h2
            className="text-xl font-bold text-[#2a1408] flex items-center gap-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <FolderDot className="h-5 w-5 text-[#A56F40]" /> Planes de Cultivo Activos
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => {
              const Icon = resolveLucideIcon(project.icon);
              return (
                <div
                  key={project.id}
                  onClick={() => router.push(`/blueprints/projects/${project.id}`)}
                  className="surface-raised rounded-2xl p-5 flex flex-col justify-between gap-4 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        TILE_COLORS[i % TILE_COLORS.length],
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="font-bold text-[#2a1408] text-sm truncate"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {project.name}
                      </h3>
                      <p className="text-xs text-[#705e4b]">Iniciado el {new Date(project.createdAt).toLocaleDateString("es")}</p>
                    </div>
                  </div>
                  <div className="border-t border-[#84582a]/12 pt-3 flex items-center justify-between text-xs text-[#705e4b]">
                    <span>Origen: {project.blueprintSnapshot.name}</span>
                    <span className="font-bold text-[#879652] flex items-center gap-1">
                      Continuar <Play className="h-3 w-3 fill-current" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Catálogo de Blueprints Disponibles */}
      <div className="space-y-4">
        <h2
          className="text-xl font-bold text-[#2a1408] flex items-center gap-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <Layers className="h-5 w-5 text-[#879652]" /> Catálogo de Metodologías de Cultivo
        </h2>

        {fungiculturaBlueprints.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No hay blueprints disponibles"
            description="Aún no hay metodologías de cultivo que coincidan con tu búsqueda."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fungiculturaBlueprints.map((blueprint, i) => {
              const Icon = resolveLucideIcon(blueprint.icon);
              return (
                <div
                  key={blueprint.id}
                  onClick={() => handleBlueprintClick(blueprint)}
                  className="surface-raised rounded-2xl p-5 flex flex-col gap-4 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        TILE_COLORS[i % TILE_COLORS.length],
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-[#2a1408] text-base line-clamp-1"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {blueprint.name}
                      </h3>
                      <span className="text-xs text-[#705e4b]">{blueprint.category} · {DIFFICULTY_LABELS[blueprint.difficulty]}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#705e4b] line-clamp-3">
                    {blueprint.description}
                  </p>

                  <div className="border-t border-[#84582a]/12 pt-3 mt-auto flex items-center justify-between text-xs text-[#705e4b]">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-[#A56F40]" /> {blueprint.roadmap.length} fases
                    </span>
                    <span className="flex items-center gap-1">
                      <ListChecks className="h-3.5 w-3.5 text-[#879652]" /> {blueprint.roadmap.reduce((sum, phase) => sum + phase.steps.length, 0)} pasos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para iniciar/continuar un plan */}
      {selectedBlueprint && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedBlueprint(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Iniciar Plan de Cultivo</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <p className="text-xs text-[#705e4b]">
                Crearás una copia de trabajo de la metodología **"{selectedBlueprint.name}"** para registrar tu progreso y rellenar información.
              </p>

              {/* Si ya existen instancias activas de este blueprint, sugerimos continuar */}
              {existingProjects.length > 0 && (
                <div className="bg-[#FAF7F2] border border-[#84582a]/20 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-bold text-[#2a1408]">Planes de este cultivo ya activos:</p>
                  <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                    {existingProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedBlueprint(null);
                          router.push(`/blueprints/projects/${p.id}`);
                        }}
                        className="text-left bg-[#FFFDF9] border border-[rgba(132,88,42,0.12)] hover:bg-[#879652]/10 p-2 rounded-lg text-xs font-bold text-[#879652] flex justify-between items-center transition-colors"
                      >
                        <span>{p.name}</span>
                        <span>Continuar &rarr;</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#84582a]/12 pt-2 text-[10px] text-[#705e4b] italic">
                    O si prefieres, puedes iniciar un nuevo plan de cultivo a continuación:
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="project-name">Nombre del nuevo plan</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Ej. Mi Cultivo de Setas Orellana Lote A"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedBlueprint(null)} disabled={creating}>
                Cancelar
              </Button>
              <Button onClick={handleStartProject} disabled={!projectName.trim() || creating}>
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                {existingProjects.length > 0 ? "Iniciar otro nuevo" : "Comenzar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
