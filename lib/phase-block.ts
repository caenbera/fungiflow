import { Briefcase, Compass, Settings, Users, type LucideIcon } from "lucide-react";

export type BlueprintBlock = "strategy" | "operations" | "business" | "customers";

export interface BlockMeta {
  value: BlueprintBlock;
  label: string;
  icon: LucideIcon;
  tileColor: string;
}

export const BLUEPRINT_BLOCKS: BlockMeta[] = [
  {
    value: "strategy",
    label: "Estrategia",
    icon: Compass,
    tileColor: "bg-primary/10 text-primary",
  },
  {
    value: "operations",
    label: "Operaciones",
    icon: Settings,
    tileColor: "bg-chart-2/10 text-chart-2",
  },
  {
    value: "business",
    label: "Negocio",
    icon: Briefcase,
    tileColor: "bg-warning/10 text-warning",
  },
  { value: "customers", label: "Clientes", icon: Users, tileColor: "bg-success/10 text-success" },
];

export function resolveBlockMeta(block: BlueprintBlock) {
  return BLUEPRINT_BLOCKS.find((b) => b.value === block)!;
}
