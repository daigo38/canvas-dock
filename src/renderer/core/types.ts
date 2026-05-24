export interface RenderEnvelope {
  kind: "openui" | "a2ui";
  theme: string;
  payload: unknown;
}
