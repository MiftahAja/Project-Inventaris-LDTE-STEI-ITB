import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "petugas",
      },
    });

    await db.tambahPetugas.create({
      data: { userId: user.id },
    });

    await logActivity({
      logName: "petugas",
      description: `Menambahkan petugas baru: ${name}`,
      subjectType: "User",
      subjectId: Number(user.id),
      event: "created",
      causerId: Number(session.userId),
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Create petugas error:", error);
    return NextResponse.json({ error: "Gagal membuat petugas" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      db.user.findMany({
        where: { role: "petugas" },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.user.count({ where: { role: "petugas" } }),
    ]);

    return NextResponse.json({
      data: users,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Get petugas error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
