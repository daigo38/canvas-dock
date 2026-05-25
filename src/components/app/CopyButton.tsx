"use client";

import { useState, type MouseEvent } from "react";

export function CopyButton({ value, label = "Copy URL" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e: MouseEvent<HTMLButtonElement>) => {
        // Defensive: when this button sits inside a wrapping <Link>, stop the
        // click from triggering navigation.
        e.preventDefault();
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
