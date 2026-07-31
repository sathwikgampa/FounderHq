import React from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
        <FileQuestion className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
      <h2 className="mt-2 text-xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        The resource or route you requested could not be located on FounderHQ.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
