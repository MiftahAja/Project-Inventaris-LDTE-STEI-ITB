import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity-log";
import {
  getOrSetCache,
  invalidateEntityCache,
  buildCacheKey,
  CACHE_TTL,
  CACHE_KEYS,
} from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await db.tambahPetugas.create({
      data: { userId: user.id },
    });

    // Invalidate petugas cache after mutation
    await invalidateEntityCache(CACHE_KEYS.PETUGAS);

    // Fire and forget activity log
    logActivity({
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
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 100);
    const skip = (page - 1) * pageSize;

    // Build cache key based on query parameters
    const cacheKey = buildCacheKey(CACHE_KEYS.PETUGAS, { page, pageSize });

    const data = await getOrSetCache(
      cacheKey,
      async () => {
        const [users, total] = await Promise.all([
          db.user.findMany({
            where: { role: "petugas" },
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              tambahPetugas: {
                select: {
                  noTelp: true,
                  alamat: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
          }),
          db.user.count({ where: { role: "petugas" } }),
        ]);

        return {
          data: users.map((u) => ({
            id: Number(u.id),
            name: u.name,
            email: u.email,
            noTelp: u.tambahPetugas?.noTelp || "-",
            alamat: u.tambahPetugas?.alamat || "-",
          })),
          total,
          page,
          pageSize,
        };
      },
      CACHE_TTL.MEDIUM // 60 seconds cache (petugas list changes less frequently)
    );

    const response = NextResponse.json(data);

    // Set cache headers
    response.headers.set(
      "Cache-Control",
      "private, max-age=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error) {
    console.error("Get petugas error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
