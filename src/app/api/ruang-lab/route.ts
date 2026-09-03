import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { namaRuang, deskripsi } = body;

    if (!namaRuang) {
      return NextResponse.json({ error: "Nama ruang harus diisi" }, { status: 400 });
    }

    const ruangLab = await db.ruangLab.create({
      data: { namaRuang, deskripsi: deskripsi || null },
    });

    await logActivity({
      logName: "ruang_lab",
      description: `Menambahkan ruang lab baru: ${namaRuang}`,
      subjectType: "RuangLab",
      subjectId: Number(ruangLab.id),
      event: "created",
      causerId: Number(session.userId),
    });

    return NextResponse.json(ruangLab);
  } catch (error) {
    console.error("Create ruang lab error:", error);
    return NextResponse.json({ error: "Gagal membuat ruang lab" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const [ruangLabs, total] = await Promise.all([
      db.ruangLab.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.ruangLab.count(),
    ]);

    return NextResponse.json({
      data: ruangLabs,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Get ruang labs error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
