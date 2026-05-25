"use client";

import { Renderer } from "@openuidev/react-lang";
import { canvasDockLibrary } from "./library";

export function RenderOpenUI({ source }: { source: string }) {
  return (
    <div className="w-full max-w-full overflow-x-clip p-4 sm:p-6 md:p-10">
      <Renderer response={source} library={canvasDockLibrary} />
    </div>
  );
}
