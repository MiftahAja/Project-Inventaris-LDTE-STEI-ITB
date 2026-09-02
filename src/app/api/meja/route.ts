import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canWriteToLab } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { meja, ruangLabId } = body;

    if (!meja || !ruangLabId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const canWrite = await canWriteToLab(Number(session.userId), Number(ruangLabId));
    if (!canWrite) {
      return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
    }

    const newMeja = await db.meja.create({
      data: {
        meja,
        ruangLabId: BigInt(ruangLabId),
      },
    });

    await logActivity({
      logName: "meja",
      description: `Menambahkan meja baru: ${meja}`,
      subjectType: "Meja",
      subjectId: Number(newMeja.id),
      event: "created",
      causerId: Number(session.userId),
    });

    return NextResponse.json(newMeja);
  } catch (error) {
    console.error("Create meja error:", error);
    return NextResponse.json({ error: "Gagal membuat meja" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const mejas = await db.meja.findMany({
      include: { ruangLab: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(mejas);
  } catch (error) {
    console.error("Get mejas error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
