"use client";

import { useTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeletePageButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="destructive"
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
    >
      <Trash2 />
      {pending ? "Deleting" : "Delete"}
    </Button>
  );
}
