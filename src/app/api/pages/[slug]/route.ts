import { NextRequest, NextResponse } from "next/server";
import { getPage, updatePagePayload, deletePage } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rec = await getPage(slug);
  if (!rec) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(rec);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !("payload" in body)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const updated = await updatePagePayload(slug, (body as { payload: unknown }).payload);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const url = new URL(`/p/${slug}`, req.nextUrl.origin).toString();
  return NextResponse.json({ slug, url });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ok = await deletePage(slug);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
