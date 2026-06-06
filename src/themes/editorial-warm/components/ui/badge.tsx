import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Editorial Warm Badge — mono label on a small glass pill. Uses --glass-* tokens.

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full",
    "font-mono uppercase tracking-[0.06em] transition-colors duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--glass)] text-foreground/70 shadow-[var(--shadow-glass)]",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/95",
        outline:
          "border border-border bg-transparent text-foreground/70",
        muted:
          "bg-[var(--glass-soft)] text-foreground/50 shadow-[var(--shadow-glass)]",
      },
      size: {
        sm:      "h-4 px-2 text-[9px]",
        default: "h-5 px-2.5 text-[10px]",
        lg:      "h-6 px-3 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
