"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Lightbulb,
  Search,
  FileText,
  ClipboardCheck,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-400" },
  { href: "/brainstorm", label: "Brainstorm", icon: MessageSquare, color: "text-purple-400" },
  { href: "/ideas", label: "Ideas", icon: Lightbulb, color: "text-amber-400" },
  { href: "/research", label: "Research", icon: Search, color: "text-emerald-400" },
  { href: "/prds", label: "PRDs", icon: FileText, color: "text-blue-400" },
  { href: "/reviews", label: "Reviews", icon: ClipboardCheck, color: "text-purple-400" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 print:hidden",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Accent gradient line at top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-base font-semibold text-white">PRD Platform</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-white" : item.color
                )}
              />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <ThemeToggle />
      </div>
    </aside>
  );
}
