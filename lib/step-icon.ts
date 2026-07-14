import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Filter,
  Gift,
  Globe,
  Landmark,
  Mail,
  Megaphone,
  Palette,
  Scale,
  Search,
  Shield,
  Target,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { findLucideIcon } from "@/lib/lucide-icon";

export type StepRowStatus = "completado" | "en_progreso" | "pendiente" | "bloqueado";

const STEP_ICON_KEYWORDS: { icon: LucideIcon; keywords: string[] }[] = [
  { icon: Target, keywords: ["cliente ideal", "buyer persona", "publico", "público", "segmento"] },
  { icon: Gift, keywords: ["propuesta de valor", "oferta"] },
  {
    icon: Search,
    keywords: ["competencia", "analisis", "análisis", "investigacion", "investigación"],
  },
  { icon: Megaphone, keywords: ["marketing", "publicidad", "campaña", "campana"] },
  { icon: FileText, keywords: ["contenido", "documento", "manual", "guia", "guía"] },
  { icon: Filter, keywords: ["embudo", "conversion", "conversión", "ventas"] },
  { icon: BarChart3, keywords: ["indicador", "seguimiento", "kpi", "metrica", "métrica"] },
  { icon: DollarSign, keywords: ["finanza", "presupuesto", "precio", "costo", "tarifa", "cobro"] },
  { icon: Scale, keywords: ["estructura legal", "socios", "legal", "abogado", "conflicto"] },
  { icon: Landmark, keywords: ["banco", "cuenta bancaria", "tributaria", "registro mercantil"] },
  { icon: Award, keywords: ["certificacion", "certificación", "examen", "registro profesional"] },
  { icon: Shield, keywords: ["seguro", "confidencialidad", "privacidad", "cumplimiento"] },
  { icon: Palette, keywords: ["logo", "marca", "color", "tipografia", "tipografía", "identidad"] },
  { icon: Globe, keywords: ["sitio web", "dominio", "pagina", "página", "hosting"] },
  { icon: Wrench, keywords: ["crm", "software", "herramienta", "plataforma"] },
  { icon: Users, keywords: ["cliente", "reunion", "reunión", "onboarding", "referido"] },
  { icon: Mail, keywords: ["correo", "email"] },
  { icon: Calendar, keywords: ["agendar", "agenda", "calendario", "cita"] },
  { icon: Building2, keywords: ["empresa", "firma", "negocio"] },
];

export function resolveStepIcon(step: { title: string; icon?: string }): LucideIcon {
  const explicit = findLucideIcon(step.icon);
  if (explicit) return explicit;

  const normalized = step.title.toLowerCase();
  const match = STEP_ICON_KEYWORDS.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword)),
  );
  return match?.icon ?? Target;
}

export const STEP_STATUS_META: Record<
  StepRowStatus,
  { label: string; variant: "outline" | "default" | "secondary" | "destructive" }
> = {
  completado: { label: "Completado", variant: "secondary" },
  en_progreso: { label: "En progreso", variant: "default" },
  pendiente: { label: "Pendiente", variant: "outline" },
  bloqueado: { label: "Bloqueado", variant: "destructive" },
};
