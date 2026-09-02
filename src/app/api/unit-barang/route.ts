import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canWriteToLab } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { barangId, kodeBarang, kondisiBarang, status, ruangLabId, mejaId } = body;

    if (!barangId || !kodeBarang || !kondisiBarang || !status) {
      return NextResponse.json({ error: "Semua field wajib harus diisi" }, { status: 400 });
    }

    // Check write permission
    if (ruangLabId) {
      const canWrite = await canWriteToLab(Number(session.userId), Number(ruangLabId));
      if (!canWrite) {
        return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
      }
    }

    // Check duplicate
    const existing = await db.unitBarang.findFirst({
      where: { barangId: BigInt(barangId), mejaId: mejaId ? BigInt(mejaId) : null },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Unit barang dengan kombinasi barang dan meja yang sama sudah ada" },
        { status: 400 }
      );
    }

    const unitBarang = await db.unitBarang.create({
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
      description: `Menambahkan unit barang: ${kodeBarang}`,
      subjectType: "UnitBarang",
      subjectId: Number(unitBarang.id),
      event: "created",
      causerId: Number(session.userId),
    });

    return NextResponse.json(unitBarang);
  } catch (error) {
    console.error("Create unit barang error:", error);
    return NextResponse.json({ error: "Gagal membuat unit barang" }, { status: 500 });
  }
}
