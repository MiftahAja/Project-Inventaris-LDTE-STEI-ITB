import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity-log";

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
    });

    if (!user) {
      return NextResponse.json({ error: "Petugas tidak ditemukan" }, { status: 404 });
    }

    await db.user.delete({
      where: { id: BigInt(id) },
    });

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
