import React from "react";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <LoadingSpinner className="h-10 w-10" />
    </div>
  );
}
