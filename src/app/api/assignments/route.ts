import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

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
    });

    const user = await db.user.findUnique({ where: { id: BigInt(userId) } });
    const lab = await db.ruangLab.findUnique({ where: { id: BigInt(ruangLabId) } });

    await logActivity({
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
    const assignments = await db.assignment.findMany({
      include: { user: true, ruangLab: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Get assignments error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
