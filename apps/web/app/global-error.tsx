"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-foreground text-center">
        <h1 className="text-4xl font-black text-destructive">500</h1>
        <h2 className="mt-2 text-xl font-bold">Internal Server Error</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          A critical systemic error occurred. Our engineering team has been notified.
        </p>
        <button
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => reset()}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
