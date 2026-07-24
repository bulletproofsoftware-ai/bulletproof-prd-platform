import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/prds/status-badge";
import {
  MessageSquare,
  Lightbulb,
  Search,
  Upload,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RecentPrd = {
  id: string;
  title: string;
  status: string;
  updatedAt: Date;
};

type DashboardData = {
  recentPrds: RecentPrd[];
  totalPrds: number;
  pendingReviews: number;
  activeResearch: number;
  activeBrainstorms: number;
  openIdeas: number;
};

const quickActions = [
  {
    href: "/brainstorm",
    label: "New Brainstorm",
    icon: MessageSquare,
    iconBg: "bg-purple-100 text-purple-600",
    borderColor: "border-t-purple-500",
  },
  {
    href: "/ideas",
    label: "New Idea",
    icon: Lightbulb,
    iconBg: "bg-amber-100 text-amber-600",
    borderColor: "border-t-amber-500",
  },
  {
    href: "/research",
    label: "Start Research",
    icon: Search,
    iconBg: "bg-emerald-100 text-emerald-600",
    borderColor: "border-t-emerald-500",
  },
  {
    href: "/prds/upload",
    label: "Upload PRD",
    icon: Upload,
    iconBg: "bg-blue-100 text-blue-600",
    borderColor: "border-t-blue-500",
  },
];

const statCards = [
  {
    label: "Total PRDs",
    key: "totalPrds" as keyof DashboardData,
    icon: FileText,
    iconColor: "text-blue-500",
    cardClass: "stat-card-blue",
  },
  {
    label: "Pending Reviews",
    key: "pendingReviews" as keyof DashboardData,
    icon: ClipboardCheck,
    iconColor: "text-purple-500",
    cardClass: "stat-card-purple",
  },
  {
    label: "Active Research",
    key: "activeResearch" as keyof DashboardData,
    icon: Search,
    iconColor: "text-emerald-500",
    cardClass: "stat-card-emerald",
  },
  {
    label: "Open Ideas",
    key: "openIdeas" as keyof DashboardData,
    icon: Lightbulb,
    iconColor: "text-amber-500",
    cardClass: "stat-card-amber",
  },
];

export function DashboardCards({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card
                className={cn(
                  "cursor-pointer border-t-2 shadow-sm card-hover",
                  action.borderColor
                )}
              >
                <CardContent className="flex flex-col items-center gap-3 pt-6 pb-5">
                  <div className={cn("rounded-full p-3", action.iconBg)}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.key} className={cn("shadow-sm", stat.cardClass)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                <span className="text-3xl font-bold">
                  {data[stat.key] as number}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent PRDs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent PRDs</h2>
        {data.recentPrds.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No PRDs yet. Start by brainstorming, adding an idea, or uploading a markdown file.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {data.recentPrds.map((prd) => (
              <Link key={prd.id} href={`/prds/${prd.id}`}>
                <Card className="cursor-pointer shadow-sm card-hover">
                  <CardContent className="flex items-center justify-between py-3 px-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-blue-400" />
                      <span className="font-medium">{prd.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={prd.status} />
                      <span className="text-xs text-muted-foreground">
                        {prd.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
