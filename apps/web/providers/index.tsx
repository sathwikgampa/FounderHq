"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { DialogProvider } from "./dialog-provider";
import { ModalProvider } from "./modal-provider";
import { ToastProvider } from "./toast-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryProvider>
        <AuthProvider>
          <DialogProvider>
            <ModalProvider>
              {children}
              <ToastProvider />
            </ModalProvider>
          </DialogProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
