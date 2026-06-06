export const formFieldBase =
  "w-full rounded-[6px] px-3 text-sm " +
  "bg-background text-foreground " +
  "border border-border " +
  "placeholder:text-muted-foreground " +
  "transition-colors duration-150 " +
  "hover:border-ring/50 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50";

/** Height + vertical padding for single-line form fields (h-9) */
export const formFieldSingleLine = "flex h-9 py-1.5";

/** Vertical padding and min-height for multi-line form fields */
export const formFieldMultiLine = "flex min-h-[80px] py-2 resize-y";
