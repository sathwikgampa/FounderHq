"use client";

import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Next.js Error caught:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Application Error</h1>
      <p className="mt-2 text-muted-foreground max-w-md text-sm">
        An unhandled exception occurred in the application layer.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Reload Application
      </Button>
    </div>
  );
}
