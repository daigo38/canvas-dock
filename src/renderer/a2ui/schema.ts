import { z } from "zod";

// Canvas Dock's pragmatic subset of A2UI v0.8.
// We accept the spec's createSurface / updateComponents / updateDataModel
// envelope, plus a richer component catalog (chart/table/stat/badge) on top of
// the basic display + layout primitives.

export const DynamicValueSchema = z.union([
  z.object({ literal: z.unknown() }),
  z.object({ path: z.string() }),
]);
export type DynamicValue = z.infer<typeof DynamicValueSchema>;

const valueOrDynamic = <S extends z.ZodTypeAny>(s: S) => z.union([s, DynamicValueSchema]);

// Each component is { id, type, props, children? }.
// children is an array of component ids (string) — the spec uses flat lists
// with id references; we keep this contract.
export const ComponentSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.string(), z.unknown()).default({}),
  children: z.array(z.string()).optional(),
});
export type A2Component = z.infer<typeof ComponentSchema>;

export const CreateSurfaceMsg = z.object({
  type: z.literal("createSurface"),
  surfaceId: z.string(),
  catalogId: z.string().default("canvas-dock"),
  root: z.string(),
});

export const UpdateComponentsMsg = z.object({
  type: z.literal("updateComponents"),
  surfaceId: z.string(),
  components: z.array(ComponentSchema),
});

export const UpdateDataModelMsg = z.object({
  type: z.literal("updateDataModel"),
  surfaceId: z.string(),
  path: z.string().default("/"),
  value: z.unknown(),
});

export const DeleteSurfaceMsg = z.object({
  type: z.literal("deleteSurface"),
  surfaceId: z.string(),
});

export const A2UIMessageSchema = z.discriminatedUnion("type", [
  CreateSurfaceMsg,
  UpdateComponentsMsg,
  UpdateDataModelMsg,
  DeleteSurfaceMsg,
]);
export type A2UIMessage = z.infer<typeof A2UIMessageSchema>;

export const A2UIPayloadSchema = z.object({
  messages: z.array(A2UIMessageSchema).min(1),
});
export type A2UIPayload = z.infer<typeof A2UIPayloadSchema>;

// Resolve a value that may be a literal or a JSON Pointer path against the
// surface's data model. Only absolute paths starting with "/" are supported.
export function resolveValue(value: unknown, dataModel: unknown): unknown {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const v = value as Record<string, unknown>;
    if ("literal" in v) return v.literal;
    if ("path" in v && typeof v.path === "string") return resolvePath(v.path, dataModel);
  }
  return value;
}

export function resolvePath(pointer: string, root: unknown): unknown {
  if (pointer === "/" || pointer === "") return root;
  const parts = pointer.replace(/^\//, "").split("/");
  let cur: unknown = root;
  for (const part of parts) {
    if (cur && typeof cur === "object") {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

export function setPath(pointer: string, root: unknown, value: unknown): unknown {
  if (pointer === "/" || pointer === "") return value;
  const parts = pointer.replace(/^\//, "").split("/");
  const r: Record<string, unknown> = root && typeof root === "object" ? { ...(root as Record<string, unknown>) } : {};
  let cur: Record<string, unknown> = r;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    cur[p] = cur[p] && typeof cur[p] === "object" ? { ...(cur[p] as Record<string, unknown>) } : {};
    cur = cur[p] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
  return r;
}

// Fold a stream of messages into the final state for rendering.
export interface A2UIState {
  surfaces: Record<string, { root: string; catalogId: string; dataModel: unknown }>;
  components: Record<string, Record<string, A2Component>>; // surfaceId -> id -> component
}

export function foldMessages(messages: A2UIMessage[]): A2UIState {
  const state: A2UIState = { surfaces: {}, components: {} };
  for (const msg of messages) {
    switch (msg.type) {
      case "createSurface":
        state.surfaces[msg.surfaceId] = { root: msg.root, catalogId: msg.catalogId, dataModel: {} };
        state.components[msg.surfaceId] = state.components[msg.surfaceId] ?? {};
        break;
      case "updateComponents":
        state.components[msg.surfaceId] = state.components[msg.surfaceId] ?? {};
        for (const c of msg.components) {
          state.components[msg.surfaceId][c.id] = c;
        }
        break;
      case "updateDataModel":
        if (state.surfaces[msg.surfaceId]) {
          state.surfaces[msg.surfaceId].dataModel = setPath(msg.path, state.surfaces[msg.surfaceId].dataModel, msg.value);
        }
        break;
      case "deleteSurface":
        delete state.surfaces[msg.surfaceId];
        delete state.components[msg.surfaceId];
        break;
    }
  }
  return state;
}
