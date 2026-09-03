import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canWriteToLab } from "@/lib/auth";
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

    // Check duplicate kodeBarang in the same lab
    const existingKode = await db.unitBarang.findFirst({
      where: {
        kodeBarang,
        ruangLabId: ruangLabId ? BigInt(ruangLabId) : null,
      },
      select: { id: true },
    });

    if (existingKode) {
      return NextResponse.json(
        { error: `Kode barang "${kodeBarang}" sudah ada di lab ini` },
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
      select: {
        id: true,
        kodeBarang: true,
        kondisiBarang: true,
        status: true,
        createdAt: true,
      },
    });

    // Invalidate unit-barang and related caches after mutation
    await Promise.all([
      invalidateEntityCache(CACHE_KEYS.UNIT_BARANG),
      invalidateEntityCache(CACHE_KEYS.RUANG_LAB),
      invalidateEntityCache(CACHE_KEYS.MEJA),
      invalidateEntityCache(CACHE_KEYS.DASHBOARD),
    ]);

    // Fire and forget activity log
    logActivity({
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 100);
    const skip = (page - 1) * pageSize;

    // Build cache key based on query parameters
    const cacheKey = buildCacheKey(CACHE_KEYS.UNIT_BARANG, { page, pageSize });

    const data = await getOrSetCache(
      cacheKey,
      async () => {
        const [unitBarangs, total] = await Promise.all([
          db.unitBarang.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            include: {
              barang: { select: { id: true, namaBarang: true } },
              ruangLab: { select: { id: true, namaRuang: true } },
              meja: { select: { id: true, meja: true } },
            },
          }),
          db.unitBarang.count(),
        ]);

        return {
          data: unitBarangs.map((ub) => ({
            id: Number(ub.id),
            kodeBarang: ub.kodeBarang,
            kondisiBarang: ub.kondisiBarang,
            status: ub.status,
            barangId: Number(ub.barangId),
            namaBarang: ub.barang.namaBarang,
            ruangLabId: ub.ruangLabId ? Number(ub.ruangLabId) : null,
            namaRuang: ub.ruangLab?.namaRuang || "-",
            mejaId: ub.mejaId ? Number(ub.mejaId) : null,
            namaMeja: ub.meja?.meja || "-",
            createdAt: ub.createdAt,
          })),
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
    console.error("Get unit barangs error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
