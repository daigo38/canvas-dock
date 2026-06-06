// @ts-nocheck
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[88px] w-full rounded-2xl bg-input px-4 py-3",
          "[backdrop-filter:var(--glass-blur)] [-webkit-backdrop-filter:var(--glass-blur)]",
          "shadow-[var(--shadow-glass)]",
          "font-sans text-sm text-foreground placeholder:text-foreground/40 leading-relaxed",
          "transition-shadow duration-200 ease-out resize-y",
          "hover:shadow-[var(--shadow-glass-hover)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
