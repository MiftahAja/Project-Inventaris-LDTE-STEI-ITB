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
    const { namaBarang } = body;

    if (!namaBarang) {
      return NextResponse.json({ error: "Nama barang harus diisi" }, { status: 400 });
    }

    const barang = await db.barang.update({
      where: { id: BigInt(id) },
      data: { namaBarang },
    });

    await logActivity({
      logName: "barang",
      description: `Mengubah barang: ${namaBarang}`,
      subjectType: "Barang",
      subjectId: Number(barang.id),
      event: "updated",
      causerId: Number(session.userId),
    });

    return NextResponse.json(barang);
  } catch (error) {
    console.error("Update barang error:", error);
    return NextResponse.json({ error: "Gagal mengupdate barang" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const barang = await db.barang.findUnique({
      where: { id: BigInt(id) },
    });

    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
    }

    await db.barang.delete({
      where: { id: BigInt(id) },
    });

    await logActivity({
      logName: "barang",
      description: `Menghapus barang: ${barang.namaBarang}`,
      subjectType: "Barang",
      subjectId: Number(barang.id),
      event: "deleted",
      causerId: Number(session.userId),
    });

    return NextResponse.json({ message: "Barang berhasil dihapus" });
  } catch (error) {
    console.error("Delete barang error:", error);
    return NextResponse.json({ error: "Gagal menghapus barang" }, { status: 500 });
  }
}
