import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

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
