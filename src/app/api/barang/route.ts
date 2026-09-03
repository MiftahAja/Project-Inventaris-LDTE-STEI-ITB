import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
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
    const { namaBarang } = body;

    if (!namaBarang) {
      return NextResponse.json({ error: "Nama barang harus diisi" }, { status: 400 });
    }

    const existing = await db.barang.findFirst({
      where: { namaBarang },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ error: "Nama barang sudah ada" }, { status: 400 });
    }

    const barang = await db.barang.create({
      data: { namaBarang },
      select: {
        id: true,
        namaBarang: true,
        createdAt: true,
      },
    });

    // Invalidate barang cache after mutation
    await invalidateEntityCache(CACHE_KEYS.BARANG);

    // Fire and forget activity log
    logActivity({
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
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 100);
    const skip = (page - 1) * pageSize;

    // Build cache key based on query parameters
    const cacheKey = buildCacheKey(CACHE_KEYS.BARANG, { page, pageSize });

    const data = await getOrSetCache(
      cacheKey,
      async () => {
        const [barangs, total] = await Promise.all([
          db.barang.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            select: {
              id: true,
              namaBarang: true,
              createdAt: true,
            },
          }),
          db.barang.count(),
        ]);

        return {
          data: barangs,
          total,
          page,
          pageSize,
        };
      },
      CACHE_TTL.SHORT // 30 seconds cache
    );

    const response = NextResponse.json(data);

    // Set cache headers
    response.headers.set(
      "Cache-Control",
      "private, max-age=30, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Get barangs error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
