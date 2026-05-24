"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          // ignore
        }
      }}
      className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
