import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`animate-spin text-primary ${className}`} />
    </div>
  );
}
