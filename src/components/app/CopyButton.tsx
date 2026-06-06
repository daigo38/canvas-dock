"use client";

import { useState, type MouseEvent } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  value,
  label = "Copy URL",
  iconOnly = false,
}: {
  value: string;
  label?: string;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon" : "default"}
      className={iconOnly ? "size-8" : undefined}
      title={copied ? "Copied" : label}
      aria-label={copied ? "Copied" : label}
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
    >
      {copied ? <Check /> : <Copy />}
      {!iconOnly && (copied ? "Copied" : label)}
    </Button>
  );
}
