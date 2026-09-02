import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { unitBarangId, tipe, tanggal, keterangan } = body;

    if (!unitBarangId || !tipe || !tanggal) {
      return NextResponse.json({ error: "Semua field wajib harus diisi" }, { status: 400 });
    }

    const mutasiStok = await db.mutasiStok.create({
      data: {
        unitBarangId: BigInt(unitBarangId),
        tipe,
        tanggal: new Date(tanggal),
        keterangan: keterangan || null,
      },
    });

    await logActivity({
      logName: "mutasi_stok",
      description: `Mutasi stok ${tipe} untuk unit barang #${unitBarangId}`,
      subjectType: "MutasiStok",
      subjectId: Number(mutasiStok.id),
      event: "created",
      causerId: Number(session.userId),
    });

    return NextResponse.json(mutasiStok);
  } catch (error) {
    console.error("Create mutasi stok error:", error);
    return NextResponse.json({ error: "Gagal membuat mutasi stok" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { unitBarang: { kodeBarang: { contains: search, mode: "insensitive" } } },
        { unitBarang: { barang: { namaBarang: { contains: search, mode: "insensitive" } } } },
      ];
    }

    if (startDate || endDate) {
      where.tanggal = {};
      if (startDate) (where.tanggal as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.tanggal as Record<string, unknown>).lte = new Date(endDate);
    }

    const mutasiStoks = await db.mutasiStok.findMany({
      where,
      include: {
        unitBarang: {
          include: { barang: true },
        },
      },
      orderBy: { tanggal: "desc" },
    });

    return NextResponse.json(mutasiStoks);
  } catch (error) {
    console.error("Get mutasi stok error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
