import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canWriteToLab } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const { meja, ruangLabId } = body;

    if (ruangLabId) {
      const canWrite = await canWriteToLab(Number(session.userId), Number(ruangLabId));
      if (!canWrite) {
        return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
      }
    }

    const updatedMeja = await db.meja.update({
      where: { id: BigInt(id) },
      data: {
        meja,
        ruangLabId: BigInt(ruangLabId),
      },
    });

    await logActivity({
      logName: "meja",
      description: `Mengubah meja: ${meja}`,
      subjectType: "Meja",
      subjectId: Number(updatedMeja.id),
      event: "updated",
      causerId: Number(session.userId),
    });

    return NextResponse.json(updatedMeja);
  } catch (error) {
    console.error("Update meja error:", error);
    return NextResponse.json({ error: "Gagal mengupdate meja" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const meja = await db.meja.findUnique({
      where: { id: BigInt(id) },
    });

    if (!meja) {
      return NextResponse.json({ error: "Meja tidak ditemukan" }, { status: 404 });
    }

    // Check write permission for the lab this meja belongs to
    const canWrite = await canWriteToLab(Number(session.userId), Number(meja.ruangLabId));
    if (!canWrite) {
      return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
    }

    await db.meja.delete({
      where: { id: BigInt(id) },
    });

    await logActivity({
      logName: "meja",
      description: `Menghapus meja: ${meja.meja}`,
      subjectType: "Meja",
      subjectId: Number(meja.id),
      event: "deleted",
      causerId: Number(session.userId),
    });

    return NextResponse.json({ message: "Meja berhasil dihapus" });
  } catch (error) {
    console.error("Delete meja error:", error);
    return NextResponse.json({ error: "Gagal menghapus meja" }, { status: 500 });
  }
}
