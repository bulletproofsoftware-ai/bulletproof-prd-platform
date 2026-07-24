import { prisma } from "@/lib/db";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [recentPrds, totalPrds, pendingReviews, activeResearch, activeBrainstorms, openIdeas] =
    await Promise.all([
      prisma.prd.findMany({
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
      prisma.prd.count(),
      prisma.review.count({ where: { status: { in: ["pending", "in_progress"] } } }),
      prisma.researchSession.count({ where: { status: "running" } }),
      prisma.brainstormSession.count({ where: { status: "active" } }),
      prisma.idea.count({ where: { status: "open" } }),
    ]);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <DashboardCards
        data={{ recentPrds, totalPrds, pendingReviews, activeResearch, activeBrainstorms, openIdeas }}
      />
    </div>
  );
}
