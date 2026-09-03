import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { namaBarang } = body;

    if (!namaBarang) {
      return NextResponse.json({ error: "Nama barang harus diisi" }, { status: 400 });
    }

    const existing = await db.barang.findFirst({
      where: { namaBarang },
    });

    if (existing) {
      return NextResponse.json({ error: "Nama barang sudah ada" }, { status: 400 });
    }

    const barang = await db.barang.create({
      data: { namaBarang },
    });

    await logActivity({
      logName: "barang",
      description: `Menambahkan barang baru: ${namaBarang}`,
      subjectType: "Barang",
      subjectId: Number(barang.id),
      event: "created",
      causerId: Number(session.userId),
    });

    return NextResponse.json(barang);
  } catch (error) {
    console.error("Create barang error:", error);
    return NextResponse.json({ error: "Gagal membuat barang" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const [barangs, total] = await Promise.all([
      db.barang.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.barang.count(),
    ]);

    return NextResponse.json({
      data: barangs,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Get barangs error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
