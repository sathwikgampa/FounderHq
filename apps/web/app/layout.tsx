import type { Metadata } from "next";
import { AppProviders } from "@/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "FounderHQ — AI Operating System for Startups",
  description: "Enterprise AI Operating System powering startup founders with an intelligent CEO Planner.",
  keywords: ["Startup", "AI Operating System", "CEO Planner", "FounderHQ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
