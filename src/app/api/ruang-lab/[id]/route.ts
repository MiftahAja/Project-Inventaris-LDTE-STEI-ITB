import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";
import { invalidateEntityCache, CACHE_KEYS } from "@/lib/cache";

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

    // Invalidate ruang-lab and related caches after mutation
    await Promise.all([
      invalidateEntityCache(CACHE_KEYS.RUANG_LAB),
      invalidateEntityCache(CACHE_KEYS.MEJA),
      invalidateEntityCache(CACHE_KEYS.UNIT_BARANG),
    ]);

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
      include: {
        _count: { select: { mejas: true, unitBarangs: true, assignments: true } },
      },
    });

    if (!ruangLab) {
      return NextResponse.json({ error: "Ruang lab tidak ditemukan" }, { status: 404 });
    }

    // Prevent deletion if lab still has related data
    if (ruangLab._count.mejas > 0) {
      return NextResponse.json(
        { error: `Tidak dapat menghapus ruang lab karena masih memiliki ${ruangLab._count.mejas} meja. Hapus semua meja terlebih dahulu.` },
        { status: 400 }
      );
    }

    // Deactivate all active assignments for this lab before deleting
    if (ruangLab._count.assignments > 0) {
      await db.assignment.updateMany({
        where: { ruangLabId: BigInt(id), isActive: true },
        data: { isActive: false },
      });
    }

    await db.ruangLab.delete({
      where: { id: BigInt(id) },
    });

    // Invalidate ruang-lab and related caches after mutation
    await Promise.all([
      invalidateEntityCache(CACHE_KEYS.RUANG_LAB),
      invalidateEntityCache(CACHE_KEYS.MEJA),
      invalidateEntityCache(CACHE_KEYS.UNIT_BARANG),
      invalidateEntityCache(CACHE_KEYS.ASSIGNMENTS),
      invalidateEntityCache(CACHE_KEYS.DASHBOARD),
    ]);

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
