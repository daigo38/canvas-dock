"use client";

import { useTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

export function DeletePageButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(`Delete page ${slug}?`)) return;
        startTransition(async () => {
          await fetch(`/api/pages/${encodeURIComponent(slug)}`, { method: "DELETE" });
          router.refresh();
        });
      }}
      disabled={pending}
      className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
