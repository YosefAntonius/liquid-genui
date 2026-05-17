import React from "react";
import { useLiquid } from "./LiquidProvider";

interface DefaultSkinProps {
  component: React.ComponentType<any>;
  [key: string]: any; // Catch-all for extra props passed to the default component
}

export function DefaultSkin({ component: Component, ...props }: DefaultSkinProps) {
  const { liquidHtml, isLoaded } = useLiquid();

  if (!isLoaded) return null;

  // If a generative skin is active, do not render the default UI
  if (liquidHtml) return null;

  return <Component {...props} />;
}
