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
      select: {
        id: true,
        tipe: true,
        tanggal: true,
        keterangan: true,
        createdAt: true,
      },
    });

    // Invalidate mutasi-stok and dashboard cache after mutation
    await Promise.all([
      invalidateEntityCache(CACHE_KEYS.MUTASI_STOK),
      invalidateEntityCache(CACHE_KEYS.DASHBOARD),
    ]);

    // Fire and forget activity log
    logActivity({
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
    const search = searchParams.get("search") ?? "";
    const startDate = searchParams.get("startDate") ?? undefined;
    const endDate = searchParams.get("endDate") ?? undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 100);
    const skip = (page - 1) * pageSize;

    // Build cache key based on all query parameters
    const cacheKey = buildCacheKey(CACHE_KEYS.MUTASI_STOK, {
      search,
      startDate,
      endDate,
      page,
      pageSize,
    });

    const data = await getOrSetCache(
      cacheKey,
      async () => {
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

        const [mutasiStoks, total] = await Promise.all([
          db.mutasiStok.findMany({
            where,
            select: {
              id: true,
              tipe: true,
              tanggal: true,
              keterangan: true,
              createdAt: true,
              unitBarang: {
                select: {
                  id: true,
                  kodeBarang: true,
                  barang: { select: { id: true, namaBarang: true } },
                },
              },
            },
            orderBy: { tanggal: "desc" },
            skip,
            take: pageSize,
          }),
          db.mutasiStok.count({ where }),
        ]);

        return {
          data: mutasiStoks,
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
    console.error("Get mutasi stok error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
