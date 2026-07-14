export type StepType =
  | "one_time"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semester"
  | "yearly"
  | "milestone"
  | "custom";

/**
 * Calcula la clave del periodo "actual" para un Step recurrente.
 */
export function getCurrentPeriodKey(stepType: StepType, now: Date = new Date()): string | null {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  switch (stepType) {
    case "daily":
      return `${yyyy}-${mm}-${dd}`;
    case "weekly": {
      // Cálculo nativo de la semana ISO
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
    }
    case "monthly":
      return `${yyyy}-${mm}`;
    case "quarterly":
      return `${yyyy}-Q${Math.floor(now.getMonth() / 3) + 1}`;
    case "semester":
      return `${yyyy}-S${now.getMonth() < 6 ? 1 : 2}`;
    case "yearly":
      return `${yyyy}`;
    default:
      return null;
  }
}

/** Etiqueta legible del periodo actual. */
export function periodLabel(stepType: StepType): string {
  switch (stepType) {
    case "daily":
      return "hoy";
    case "weekly":
      return "esta semana";
    case "monthly":
      return "este mes";
    case "quarterly":
      return "este trimestre";
    case "semester":
      return "este semestre";
    case "yearly":
      return "este año";
    default:
      return "";
  }
}
