"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Layers, ListChecks, Loader2, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ImportBlueprintJsonDialog } from "@/components/features/admin/import-blueprint-json-dialog";
import { deleteBlueprint, listAllBlueprints } from "@/lib/services/blueprints";
import type { Blueprint, BlueprintStatus } from "@/types";

const STATUS_META: Record<
  BlueprintStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  draft: { label: "Borrador", variant: "outline" },
  published: { label: "Publicado", variant: "secondary" }, // secondary is olive green in FungiFlow
  archived: { label: "Archivado", variant: "default" },
};

function countSteps(blueprint: Blueprint): number {
  return blueprint.roadmap.reduce((sum, phase) => sum + phase.steps.length, 0);
}

export default function AdminBlueprintsPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[] | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  function reload() {
    listAllBlueprints().then(setBlueprints);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleDelete(blueprint: Blueprint) {
    if (
      !window.confirm(
        `¿Eliminar "${blueprint.name}"? Esta acción no se puede deshacer y eliminará la plantilla de base de datos.`,
      )
    )
      return;
    await deleteBlueprint(blueprint.id);
    toast.success(`"${blueprint.name}" eliminado.`);
    reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#7a4010] mb-1">
            Super Administrador
          </p>
          <h1
            className="text-3xl font-extrabold text-[#2a1408]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Constructor de Blueprints
          </h1>
          <p className="text-sm text-[#705e4b] mt-1">
            Crea y administra las plantillas metodológicas de la plataforma.
          </p>
        </div>
        <Button onClick={() => setImportOpen(true)}>
          <Upload className="h-4 w-4" /> Importar JSON
        </Button>
      </div>

      {blueprints === null && (
        <div className="flex items-center gap-2 py-8 justify-center">
          <Loader2 className="text-[#CA9318] h-6 w-6 animate-spin" />
          <span className="text-sm text-[#705e4b]">Cargando blueprints...</span>
        </div>
      )}

      {blueprints?.length === 0 && (
        <EmptyState
          icon={Layers}
          title="Aún no hay Blueprints"
          description="Importa un archivo JSON para crear el primero en la base de datos."
          actionLabel="Importar JSON"
          onAction={() => setImportOpen(true)}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {blueprints?.map((blueprint) => (
          <div
            key={blueprint.id}
            className="surface-raised rounded-2xl p-5 flex flex-col justify-between gap-3 hover:scale-[1.01] transition-all duration-200"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/superadmin/blueprints/${blueprint.id}`}
                  className="text-lg font-bold text-[#2a1408] truncate hover:underline"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {blueprint.name}
                </Link>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Badge variant={STATUS_META[blueprint.status].variant}>
                    {STATUS_META[blueprint.status].label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Eliminar "${blueprint.name}"`}
                    onClick={() => handleDelete(blueprint)}
                  >
                    <Trash2 className="text-[#a52c26] h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[#705e4b] line-clamp-2 mt-2">
                {blueprint.description}
              </p>
            </div>
            
            <div className="border-t border-[#84582a]/12 pt-3 flex items-center justify-between text-xs text-[#705e4b]">
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" /> {blueprint.roadmap.length} fases
              </span>
              <span className="flex items-center gap-1">
                <ListChecks className="h-3.5 w-3.5" /> {countSteps(blueprint)} pasos
              </span>
              <Link
                href={`/superadmin/blueprints/${blueprint.id}`}
                className="font-semibold text-[#7a4010] hover:underline"
              >
                Editar &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ImportBlueprintJsonDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={reload}
      />
    </div>
  );
}
