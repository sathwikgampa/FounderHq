"use client";

import React, { createContext, useContext, useState } from "react";

interface DialogContextType {
  isOpen: boolean;
  content: React.ReactNode | null;
  openDialog: (content: React.ReactNode) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const openDialog = (node: React.ReactNode) => {
    setContent(node);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <DialogContext.Provider value={{ isOpen, content, openDialog, closeDialog }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
