import * as React from "react"

import { cn } from "@/lib/utils"

// Liquid Glass Input — frosted translucent field, 14px squircle radius.
// Translucent --input token + backdrop-blur + light edge; blue focus glow.

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[40px] w-full rounded-[14px] bg-input backdrop-blur-md px-4 py-2 text-[15px] leading-[1.47] tracking-[-0.01em] text-foreground",
          "border border-border shadow-[inset_0_1px_0_oklch(1_0_0/0.5)]",
          "placeholder:text-muted-foreground",
          "transition-[border-color,box-shadow] duration-200",
          "hover:border-[oklch(0_0_0/0.18)]",
          "focus-visible:outline-none focus-visible:border-primary/60",
          "focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_18%,transparent),inset_0_1px_0_oklch(1_0_0/0.5)]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
