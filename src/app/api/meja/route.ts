import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canWriteToLab, getAssignedLabIds } from "@/lib/auth";
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
    const { meja, ruangLabId } = body;

    if (!meja || !ruangLabId) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const canWrite = await canWriteToLab(Number(session.userId), Number(ruangLabId));
    if (!canWrite) {
      return NextResponse.json({ error: "Tidak memiliki akses ke lab ini" }, { status: 403 });
    }

    // Check if meja name already exists in this lab
    const existingMeja = await db.meja.findFirst({
      where: {
        meja,
        ruangLabId: BigInt(ruangLabId),
      },
      select: { id: true },
    });

    if (existingMeja) {
      return NextResponse.json(
        { error: `Meja "${meja}" sudah ada di lab ini` },
        { status: 400 }
      );
    }

    const newMeja = await db.meja.create({
      data: {
        meja,
        ruangLabId: BigInt(ruangLabId),
      },
      select: {
        id: true,
        meja: true,
        ruangLabId: true,
        createdAt: true,
      },
    });

    // Invalidate meja and ruang-lab cache after mutation
    await Promise.all([
      invalidateEntityCache(CACHE_KEYS.MEJA),
      invalidateEntityCache(CACHE_KEYS.RUANG_LAB),
    ]);

    // Fire and forget activity log
    logActivity({
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

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 100);
    const skip = (page - 1) * pageSize;

    let where: Record<string, unknown> = {};

    // Petugas only see mejas from their assigned labs
    if (session.role === "petugas") {
      const labIds = await getAssignedLabIds(Number(session.userId));
      where = { ruangLabId: { in: labIds } };
    }

    // Build cache key based on user role and query parameters
    const cacheKey = buildCacheKey(CACHE_KEYS.MEJA, {
      role: session.role,
      userId: session.userId,
      page,
      pageSize,
    });

    const data = await getOrSetCache(
      cacheKey,
      async () => {
        const [mejas, total] = await Promise.all([
          db.meja.findMany({
            where,
            include: { ruangLab: { select: { id: true, namaRuang: true } } },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
          }),
          db.meja.count({ where }),
        ]);

        return {
          data: mejas.map((m) => ({
            id: Number(m.id),
            meja: m.meja,
            ruangLabId: Number(m.ruangLabId),
            ruangLab: m.ruangLab.namaRuang,
            createdAt: m.createdAt,
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
    console.error("Get mejas error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
