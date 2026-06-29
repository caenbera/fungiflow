import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[0.7rem] border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[rgba(255,210,120,0.42)] bg-[linear-gradient(180deg,#A36C35_0%,#5A3519_100%)] text-[#FFF8EA] shadow-[0_1px_0_rgba(255,220,120,0.36)_inset,0_-2px_3px_rgba(0,0,0,0.22)_inset,0_8px_18px_rgba(77,44,18,0.22)] hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,230,140,0.44)_inset,0_12px_22px_rgba(77,44,18,0.26)]",
        outline:
          "border-[rgba(255,255,255,0.76)] bg-[linear-gradient(145deg,#FFF9F0_0%,#EDE2D0_100%)] text-[#5A3E2B] shadow-[var(--shadow-soft-raised)] hover:-translate-y-0.5 hover:text-[#3F2818]",
        secondary:
          "border-[rgba(255,255,255,0.72)] bg-[linear-gradient(145deg,#F8F1E6_0%,#E3D5C3_100%)] text-[#623F27] shadow-[var(--shadow-soft-raised)] hover:-translate-y-0.5",
        ghost:
          "text-[#705C4B] hover:bg-[#ECE4DA]/70 hover:text-[#302D28]",
        destructive:
          "border-[rgba(255,190,180,0.54)] bg-[linear-gradient(180deg,#E85B55_0%,#B92320_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,0.38)_inset,0_-2px_3px_rgba(80,0,0,0.22)_inset,0_8px_18px_rgba(140,20,16,0.22)] hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 rounded-[0.5rem] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[0.6rem] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 rounded-[0.5rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[0.6rem]",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
