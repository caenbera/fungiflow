import * as Icons from "lucide-react";
import { Layers, type LucideIcon } from "lucide-react";

function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Busca un nombre de icono kebab-case en lucide-react - devuelve `null` si
 * no existe, a diferencia de resolveLucideIcon que siempre devuelve algo.
 */
export function findLucideIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null;
  const pascal = toPascalCase(name);
  return (Icons as unknown as Record<string, LucideIcon>)[pascal] ?? null;
}

/**
 * Convierte un nombre de icono kebab-case (ej. "building-2") al componente de
 * lucide-react correspondiente.
 */
export function resolveLucideIcon(name: string, fallback: LucideIcon = Layers): LucideIcon {
  return findLucideIcon(name) ?? fallback;
}
