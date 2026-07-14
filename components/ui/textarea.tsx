import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 rounded-[0.7rem] border border-[rgba(130,92,55,0.16)] bg-[#FFF9F1]/72 px-3 py-2 text-base text-[#302D28] shadow-[var(--shadow-pressed)] transition-all outline-none placeholder:text-muted-foreground focus-visible:border-[#CA9318]/70 focus-visible:bg-[#FFFCFA] focus-visible:ring-3 focus-visible:ring-[#CA9318]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#ECE4DA]/60 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm min-h-20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
