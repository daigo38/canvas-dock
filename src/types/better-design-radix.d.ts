import type * as React from "react";

type BetterDesignRenderProp = React.ReactElement | null;

declare module "@radix-ui/react-progress" {
  interface ProgressIndicatorProps {
    render?: BetterDesignRenderProp;
  }
}

declare module "@radix-ui/react-select" {
  interface SelectIconProps {
    render?: BetterDesignRenderProp;
  }
}

declare module "@radix-ui/react-popover" {
  interface PopoverTriggerProps {
    render?: BetterDesignRenderProp;
  }
}
