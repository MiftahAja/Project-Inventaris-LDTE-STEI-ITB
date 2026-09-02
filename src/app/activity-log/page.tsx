import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import ActivityLogClient from "./ActivityLogClient";

export default async function ActivityLogPage() {
  const session = await requireAdmin();

  const activityLogs = await db.activityLog.findMany({
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <AuthLayout userId={Number(session.userId)}>
      <ActivityLogClient
        logs={activityLogs.map((log) => ({
          id: Number(log.id),
          logName: log.logName || "-",
          description: log.description,
          event: log.event || "-",
          userName: log.user?.name || "System",
          createdAt: log.createdAt?.toISOString() || "",
        }))}
      />
    </AuthLayout>
  );
}
