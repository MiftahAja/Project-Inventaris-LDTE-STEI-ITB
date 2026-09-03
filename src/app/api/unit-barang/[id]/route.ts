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
    const { barangId, kodeBarang, kondisiBarang, status, ruangLabId, mejaId } = body;

    // Get existing unit barang to check lab access
    const existingUnit = await db.unitBarang.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUnit) {
      return NextResponse.json({ error: "Unit barang tidak ditemukan" }, { status: 404 });
    }

    // Check write permission for the existing unit's lab
    if (existingUnit.ruangLabId) {
      const canWrite = await canWriteToLab(Number(session.userId), Number(existingUnit.ruangLabId));
      if (!canWrite) {
        return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
      }
    }

    // If changing to a different lab, also check access to the new lab
    if (ruangLabId && BigInt(ruangLabId) !== existingUnit.ruangLabId) {
      const canWriteNew = await canWriteToLab(Number(session.userId), Number(ruangLabId));
      if (!canWriteNew) {
        return NextResponse.json({ error: "Tidak memiliki akses ke lab tujuan" }, { status: 403 });
      }
    }

    // Check duplicate kodeBarang in the target lab (excluding current unit)
    const targetLabId = ruangLabId ? BigInt(ruangLabId) : existingUnit.ruangLabId;
    const existingKode = await db.unitBarang.findFirst({
      where: {
        kodeBarang,
        ruangLabId: targetLabId,
        id: { not: BigInt(id) },
      },
    });

    if (existingKode) {
      return NextResponse.json(
        { error: `Kode barang "${kodeBarang}" sudah ada di lab ini` },
        { status: 400 }
      );
    }

    const unitBarang = await db.unitBarang.update({
      where: { id: BigInt(id) },
      data: {
        barangId: BigInt(barangId),
        kodeBarang,
        kondisiBarang,
        status,
        ruangLabId: ruangLabId ? BigInt(ruangLabId) : null,
        mejaId: mejaId ? BigInt(mejaId) : null,
      },
    });

    await logActivity({
      logName: "unit_barang",
      description: `Mengubah unit barang: ${kodeBarang}`,
      subjectType: "UnitBarang",
      subjectId: Number(unitBarang.id),
      event: "updated",
      causerId: Number(session.userId),
    });

    return NextResponse.json(unitBarang);
  } catch (error) {
    console.error("Update unit barang error:", error);
    return NextResponse.json({ error: "Gagal mengupdate unit barang" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const unitBarang = await db.unitBarang.findUnique({
      where: { id: BigInt(id) },
    });

    if (!unitBarang) {
      return NextResponse.json({ error: "Unit barang tidak ditemukan" }, { status: 404 });
    }

    // Check write permission for the unit's lab
    if (unitBarang.ruangLabId) {
      const canWrite = await canWriteToLab(Number(session.userId), Number(unitBarang.ruangLabId));
      if (!canWrite) {
        return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
      }
    }

    await db.unitBarang.delete({
      where: { id: BigInt(id) },
    });

    await logActivity({
      logName: "unit_barang",
      description: `Menghapus unit barang: ${unitBarang.kodeBarang}`,
      subjectType: "UnitBarang",
      subjectId: Number(unitBarang.id),
      event: "deleted",
      causerId: Number(session.userId),
    });

    return NextResponse.json({ message: "Unit barang berhasil dihapus" });
  } catch (error) {
    console.error("Delete unit barang error:", error);
    return NextResponse.json({ error: "Gagal menghapus unit barang" }, { status: 500 });
  }
}
