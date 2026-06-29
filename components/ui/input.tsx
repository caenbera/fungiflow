import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-[0.7rem] border border-[rgba(130,92,55,0.16)] bg-[#FFF9F1]/72 px-3 py-1 text-base text-[#302D28] shadow-[var(--shadow-pressed)] transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-[#CA9318]/70 focus-visible:bg-[#FFFCFA] focus-visible:ring-3 focus-visible:ring-[#CA9318]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#ECE4DA]/60 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
