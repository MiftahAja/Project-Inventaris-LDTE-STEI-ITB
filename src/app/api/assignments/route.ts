import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";
import {
  getOrSetCache,
  invalidateEntityCache,
  CACHE_TTL,
  CACHE_KEYS,
} from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { userId, ruangLabId } = body;

    if (!userId || !ruangLabId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    // Deactivate existing assignment for this lab
    await db.assignment.updateMany({
      where: { ruangLabId: BigInt(ruangLabId), isActive: true },
      data: { isActive: false },
    });

    // Create new assignment
    const assignment = await db.assignment.create({
      data: {
        userId: BigInt(userId),
        ruangLabId: BigInt(ruangLabId),
        isActive: true,
        assignedBy: Number(session.userId),
      },
      select: {
        id: true,
        userId: true,
        ruangLabId: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Invalidate assignments cache after mutation
    await invalidateEntityCache(CACHE_KEYS.ASSIGNMENTS);

    // Get user and lab info for logging
    const [user, lab] = await Promise.all([
      db.user.findUnique({
        where: { id: BigInt(userId) },
        select: { name: true },
      }),
      db.ruangLab.findUnique({
        where: { id: BigInt(ruangLabId) },
        select: { namaRuang: true },
      }),
    ]);

    // Fire and forget activity log
    logActivity({
      logName: "assignment",
      description: `Menugaskan ${user?.name} ke ${lab?.namaRuang}`,
      subjectType: "Assignment",
      subjectId: Number(assignment.id),
      event: "created",
      causerId: Number(session.userId),
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Create assignment error:", error);
    return NextResponse.json({ error: "Gagal membuat penugasan" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Use cache-aside pattern
    const data = await getOrSetCache(
      CACHE_KEYS.ASSIGNMENTS,
      async () => {
        return db.assignment.findMany({
          select: {
            id: true,
            userId: true,
            ruangLabId: true,
            isActive: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true } },
            ruangLab: { select: { id: true, namaRuang: true } },
          },
          orderBy: { createdAt: "desc" },
        });
      },
      CACHE_TTL.SHORT // 30 seconds cache
    );

    const response = NextResponse.json(data);

    // Set cache headers
    response.headers.set(
      "Cache-Control",
      "private, max-age=30, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Get assignments error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
