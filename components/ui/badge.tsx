import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-all shadow-[var(--shadow-soft-raised)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[linear-gradient(145deg,#EAC264,#B98722)] text-[#3E260C] border-[rgba(255,220,110,0.45)] [a]:hover:brightness-105",
        secondary:
          "bg-[linear-gradient(145deg,#EEF5E5,#C9D9AA)] text-[#4E652E] border-[rgba(125,156,70,0.22)] [a]:hover:brightness-105",
        destructive:
          "bg-[linear-gradient(145deg,#F7C1B9,#E8766B)] text-[#7A1712] border-[rgba(192,57,43,0.22)] focus-visible:ring-destructive/20 [a]:hover:brightness-105",
        outline:
          "border-[rgba(255,255,255,0.72)] bg-[#FFF9F1]/70 text-[#5A3E2B] [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
