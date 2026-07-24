import { cn } from "@/lib/utils";

const statusConfig: Record<string, { classes: string; pulse?: boolean }> = {
  draft: {
    classes: "bg-slate-500 text-white",
  },
  research: {
    classes: "bg-blue-500 text-white",
  },
  editing: {
    classes: "bg-amber-500 text-white",
  },
  review: {
    classes: "bg-purple-500 text-white",
  },
  approved: {
    classes: "bg-emerald-500 text-white",
  },
  rejected: {
    classes: "bg-red-500 text-white",
  },
  open: {
    classes: "bg-slate-500 text-white",
  },
  promoted: {
    classes: "bg-emerald-500 text-white",
  },
  archived: {
    classes: "bg-slate-400 text-white",
  },
  running: {
    classes: "bg-blue-500 text-white",
    pulse: true,
  },
  completed: {
    classes: "bg-emerald-500 text-white",
  },
  failed: {
    classes: "bg-red-500 text-white",
  },
  active: {
    classes: "bg-blue-500 text-white",
    pulse: true,
  },
  pending: {
    classes: "bg-amber-500 text-white",
  },
  in_progress: {
    classes: "bg-blue-500 text-white",
    pulse: true,
  },
  changes_requested: {
    classes: "bg-amber-500 text-white",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { classes: "bg-slate-500 text-white" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.classes,
        config.pulse && "badge-pulse"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
