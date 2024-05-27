"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ImageGenerationProvider } from "@/lib/hooks/use-images";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ImageGenerationProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </TooltipProvider>
      </ImageGenerationProvider>
    </NextThemesProvider>
  );
}
