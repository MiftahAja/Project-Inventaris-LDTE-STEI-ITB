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
    const { namaRuang, deskripsi } = body;

    if (!namaRuang) {
      return NextResponse.json({ error: "Nama ruang harus diisi" }, { status: 400 });
    }

    const ruangLab = await db.ruangLab.create({
      data: { namaRuang, deskripsi: deskripsi || null },
      select: {
        id: true,
        namaRuang: true,
        deskripsi: true,
        createdAt: true,
      },
    });

    // Invalidate ruang-lab cache after mutation
    await invalidateEntityCache(CACHE_KEYS.RUANG_LAB);

    // Fire and forget activity log
    logActivity({
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
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 100);
    const skip = (page - 1) * pageSize;

    // Build cache key based on query parameters
    const cacheKey = buildCacheKey(CACHE_KEYS.RUANG_LAB, { page, pageSize });

    // Use cache-aside pattern
    const data = await getOrSetCache(
      cacheKey,
      async () => {
        const [ruangLabs, total] = await Promise.all([
          db.ruangLab.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            select: {
              id: true,
              namaRuang: true,
              deskripsi: true,
              createdAt: true,
              _count: { select: { unitBarangs: true } },
            },
          }),
          db.ruangLab.count(),
        ]);

        return {
          data: ruangLabs.map((rl) => ({
            id: Number(rl.id),
            namaRuang: rl.namaRuang,
            deskripsi: rl.deskripsi || "",
            unitCount: rl._count.unitBarangs,
          })),
          total,
          page,
          pageSize,
        };
      },
      CACHE_TTL.SHORT // 30 seconds cache
    );

    const response = NextResponse.json(data);

    // Set cache headers for browser/CDN
    response.headers.set(
      "Cache-Control",
      "private, max-age=30, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Get ruang labs error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
