import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
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
    const { name, email, password } = body;

    const updateData: Record<string, unknown> = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await db.user.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Invalidate petugas cache after mutation
    await invalidateEntityCache(CACHE_KEYS.PETUGAS);

    await logActivity({
      logName: "petugas",
      description: `Mengubah petugas: ${name}`,
      subjectType: "User",
      subjectId: Number(user.id),
      event: "updated",
      causerId: Number(session.userId),
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update petugas error:", error);
    return NextResponse.json({ error: "Gagal mengupdate petugas" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id: BigInt(id) },
      include: {
        _count: { select: { assignments: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Petugas tidak ditemukan" }, { status: 404 });
    }

    // Deactivate all active assignments before deleting user
    if (user._count.assignments > 0) {
      await db.assignment.updateMany({
        where: { userId: BigInt(id), isActive: true },
        data: { isActive: false },
      });
    }

    await db.user.delete({
      where: { id: BigInt(id) },
    });

    // Invalidate petugas and assignment caches after mutation
    await Promise.all([
      invalidateEntityCache(CACHE_KEYS.PETUGAS),
      invalidateEntityCache(CACHE_KEYS.ASSIGNMENTS),
    ]);

    await logActivity({
      logName: "petugas",
      description: `Menghapus petugas: ${user.name}`,
      subjectType: "User",
      subjectId: Number(user.id),
      event: "deleted",
      causerId: Number(session.userId),
    });

    return NextResponse.json({ message: "Petugas berhasil dihapus" });
  } catch (error) {
    console.error("Delete petugas error:", error);
    return NextResponse.json({ error: "Gagal menghapus petugas" }, { status: 500 });
  }
}
