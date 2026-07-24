import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRD Platform",
  description: "Research, brainstorm, create, and review PRDs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex h-screen print:block print:h-auto">
            <Sidebar />
            <main className="flex-1 overflow-auto print:overflow-visible print:h-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
