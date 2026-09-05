import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ruangLabId = BigInt(id);

    const assignments = await db.assignment.findMany({
      where: { ruangLabId },
      select: {
        id: true,
        isActive: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = assignments.map((a) => ({
      id: Number(a.id),
      userName: a.user.name,
      userId: Number(a.user.id),
      isActive: a.isActive,
      createdAt: a.createdAt?.toISOString() || null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Get assignments by lab error:", error);
    return NextResponse.json({ error: "Gagal mengambil data penugasan" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const assignment = await db.assignment.findUnique({
      where: { id: BigInt(id) },
      include: { user: true, ruangLab: true },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Penugasan tidak ditemukan" }, { status: 404 });
    }

    await db.assignment.update({
      where: { id: BigInt(id) },
      data: { isActive: false },
    });

    await logActivity({
      logName: "assignment",
      description: `Menonaktifkan penugasan ${assignment.user.name} dari ${assignment.ruangLab.namaRuang}`,
      subjectType: "Assignment",
      subjectId: Number(assignment.id),
      event: "deleted",
      causerId: Number(session.userId),
    });

    return NextResponse.json({ message: "Penugasan berhasil dinonaktifkan" });
  } catch (error) {
    console.error("Delete assignment error:", error);
    return NextResponse.json({ error: "Gagal menonaktifkan penugasan" }, { status: 500 });
  }
}
