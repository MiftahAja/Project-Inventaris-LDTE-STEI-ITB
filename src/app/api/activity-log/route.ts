import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "100"), 100);
    const skip = (page - 1) * pageSize;

    const [logs, total] = await Promise.all([
      db.activityLog.findMany({
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.activityLog.count(),
    ]);

    const data = logs.map((log) => ({
      id: Number(log.id),
      logName: log.logName || "-",
      description: log.description,
      event: log.event || "-",
      userName: log.user?.name || "System",
      createdAt: log.createdAt?.toISOString() || "",
    }));

    return NextResponse.json({ data, total, page, pageSize });
  } catch (error) {
    console.error("Get activity logs error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
