import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { namaRuang, deskripsi } = body;

    const ruangLab = await db.ruangLab.update({
      where: { id: BigInt(id) },
      data: { namaRuang, deskripsi: deskripsi || null },
    });

    await logActivity({
      logName: "ruang_lab",
      description: `Mengubah ruang lab: ${namaRuang}`,
      subjectType: "RuangLab",
      subjectId: Number(ruangLab.id),
      event: "updated",
      causerId: Number(session.userId),
    });

    return NextResponse.json(ruangLab);
  } catch (error) {
    console.error("Update ruang lab error:", error);
    return NextResponse.json({ error: "Gagal mengupdate ruang lab" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const ruangLab = await db.ruangLab.findUnique({
      where: { id: BigInt(id) },
    });

    if (!ruangLab) {
      return NextResponse.json({ error: "Ruang lab tidak ditemukan" }, { status: 404 });
    }

    await db.ruangLab.delete({
      where: { id: BigInt(id) },
    });

    await logActivity({
      logName: "ruang_lab",
      description: `Menghapus ruang lab: ${ruangLab.namaRuang}`,
      subjectType: "RuangLab",
      subjectId: Number(ruangLab.id),
      event: "deleted",
      causerId: Number(session.userId),
    });

    return NextResponse.json({ message: "Ruang lab berhasil dihapus" });
  } catch (error) {
    console.error("Delete ruang lab error:", error);
    return NextResponse.json({ error: "Gagal menghapus ruang lab" }, { status: 500 });
  }
}
