import { notFound } from "next/navigation";
import { getPage } from "@/lib/store";
import { RenderOpenUI } from "@/renderer/openui/RenderOpenUI";
import { RenderA2UI } from "@/renderer/a2ui/RenderA2UI";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HostedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <div className={cn("min-h-screen w-full bg-background text-foreground", `theme-${page.theme}`)}>
      <main className="mx-auto max-w-5xl py-10 px-4 md:px-8">
        {page.kind === "openui" ? (
          <RenderOpenUI source={String(page.payload ?? "")} />
        ) : (
          <RenderA2UI payload={page.payload} />
        )}
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  return {
    title: page?.title ?? `Canvas Dock — ${slug}`,
  };
}
