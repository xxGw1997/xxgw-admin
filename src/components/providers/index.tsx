import React from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "~/components/ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      {children}
    </ThemeProvider>
  );
};
