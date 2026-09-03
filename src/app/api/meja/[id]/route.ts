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

    // Get existing meja to check lab access
    const existingMeja = await db.meja.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingMeja) {
      return NextResponse.json({ error: "Meja tidak ditemukan" }, { status: 404 });
    }

    // Check write permission for the existing meja's lab
    const canWrite = await canWriteToLab(Number(session.userId), Number(existingMeja.ruangLabId));
    if (!canWrite) {
      return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
    }

    // If changing to a different lab, also check access to the new lab
    if (ruangLabId && BigInt(ruangLabId) !== existingMeja.ruangLabId) {
      const canWriteNew = await canWriteToLab(Number(session.userId), Number(ruangLabId));
      if (!canWriteNew) {
        return NextResponse.json({ error: "Tidak memiliki akses ke lab tujuan" }, { status: 403 });
      }
    }

    // Check if meja name already exists in the target lab (excluding current meja)
    const targetLabId = ruangLabId ? BigInt(ruangLabId) : existingMeja.ruangLabId;
    const duplicateMeja = await db.meja.findFirst({
      where: {
        meja,
        ruangLabId: targetLabId,
        id: { not: BigInt(id) },
      },
    });

    if (duplicateMeja) {
      return NextResponse.json(
        { error: `Meja "${meja}" sudah ada di lab ini` },
        { status: 400 }
      );
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
