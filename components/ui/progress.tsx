import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value || 0));

  return (
    <div
      data-slot="progress"
      className={cn(
        "bg-[#ECE4DA] relative flex h-2 w-full items-center overflow-hidden rounded-full shadow-[var(--shadow-pressed)]",
        className,
      )}
    >
      <div
        data-slot="progress-indicator"
        className="bg-[#879652] h-full rounded-full transition-all duration-300 ease-out shadow-[0_1px_0_rgba(255,255,255,0.18)_inset]"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
