"use client";

import { Renderer } from "@openuidev/react-lang";
import { canvasDockLibrary } from "./library";

export function RenderOpenUI({ source }: { source: string }) {
  return <Renderer response={source} library={canvasDockLibrary} />;
}
