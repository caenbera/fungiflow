"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter, Layers, ListChecks, Loader2, Map, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
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
import { resolveLucideIcon } from "@/lib/lucide-icon";
import { listPublishedBlueprints } from "@/lib/services/blueprints";
import type { Blueprint, BlueprintDifficulty } from "@/types";

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

function countSteps(blueprint: Blueprint): number {
  return blueprint.roadmap.reduce((sum, phase) => sum + phase.steps.length, 0);
}

function countResources(blueprint: Blueprint): number {
  return blueprint.roadmap.reduce(
    (sum, phase) => sum + phase.steps.reduce((s, step) => s + step.content.resources.length, 0),
    0,
  );
}

export default function ChooseBlueprintPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[] | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<BlueprintDifficulty | null>(null);

  useEffect(() => {
    listPublishedBlueprints().then(setBlueprints);
  }, []);

  if (blueprints === null) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Filtrado de Blueprints de Fungicultura y términos de búsqueda
  const filtered = blueprints.filter((b) => {
    // Enfoque exclusivo de fungicultura (relacionado a hongos)
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

  return (
    <div className="space-y-6">
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
              Guías metodológicas interactivas para cultivar y procesar hongos comestibles y medicinales.
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

      {filtered.length === 0 && (
        <EmptyState
          icon={Layers}
          title="No hay blueprints disponibles"
          description="Aún no hay metodologías publicadas de fungicultura en la plataforma."
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((blueprint, i) => {
          const Icon = resolveLucideIcon(blueprint.icon);
          return (
            <Link
              key={blueprint.id}
              href={`/blueprints/${blueprint.id}`}
              className="surface-raised rounded-2xl p-5 flex flex-col gap-4 hover:scale-[1.01] transition-all duration-200"
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
                  <h2
                    className="font-bold text-[#2a1408] text-base line-clamp-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {blueprint.name}
                  </h2>
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
                  <ListChecks className="h-3.5 w-3.5 text-[#879652]" /> {countSteps(blueprint)} pasos
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-[#CA9318]" /> {countResources(blueprint)} recursos
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
