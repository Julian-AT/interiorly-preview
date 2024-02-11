"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ImageGenerationProvider } from "@/lib/hooks/use-images";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ImageGenerationProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ImageGenerationProvider>
    </NextThemesProvider>
  );
}
