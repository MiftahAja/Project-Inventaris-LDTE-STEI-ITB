import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAssignedLabIds } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = new URL(req.url);
    const labIdParam = url.searchParams.get("labId");

    // Jika ada labId, export per lab (tidak perlu cek assignment untuk admin,
    // tapi untuk non-admin harus tetap punya akses ke lab tersebut)
    if (labIdParam) {
      let labId: bigint;
      try {
        labId = BigInt(labIdParam);
      } catch (e) {
        return NextResponse.json({ error: "Invalid lab ID" }, { status: 400 });
      }
      
      // Non-admin harus punya assignment aktif ke lab ini
      if (session.role !== "admin") {
        const hasAccess = await db.assignment.findFirst({
          where: {
            userId: BigInt(session.userId),
            ruangLabId: labId,
            isActive: true,
          },
          select: { id: true },
        });
        if (!hasAccess) {
          return NextResponse.json({ error: "Tidak ada akses ke lab ini" }, { status: 403 });
        }
      }

      const ruangLab = await db.ruangLab.findUnique({
        where: { id: labId },
        include: {
          mejas: {
            orderBy: { id: "asc" },
            include: {
              unitBarangs: {
                orderBy: { id: "asc" },
                select: {
                  id: true,
                  kodeBarang: true,
                  kondisiBarang: true,
                  status: true,
                  barang: {
                    select: { namaBarang: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!ruangLab) {
        return NextResponse.json({ error: "Lab tidak ditemukan" }, { status: 404 });
      }

      const data = [{
        id: Number(ruangLab.id),
        namaRuang: ruangLab.namaRuang,
        deskripsi: ruangLab.deskripsi || "",
        mejas: ruangLab.mejas.map((m) => ({
          id: Number(m.id),
          meja: m.meja,
          unitBarangs: m.unitBarangs.map((ub) => ({
            id: Number(ub.id),
            kodeBarang: ub.kodeBarang,
            namaBarang: ub.barang.namaBarang,
            kondisiBarang: ub.kondisiBarang,
            status: ub.status,
          })),
        })),
      }];

      return NextResponse.json({ data });
    }

    // Export semua lab (admin atau lab yang diproyeksikan)
    let ruangLabIds: bigint[];
    if (session.role === "admin") {
      const all = await db.ruangLab.findMany({ select: { id: true } });
      ruangLabIds = all.map((r) => r.id);
    } else {
      const ids = await getAssignedLabIds(Number(session.userId));
      ruangLabIds = ids.map((id) => BigInt(id));
    }

    if (ruangLabIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const ruangLabs = await db.ruangLab.findMany({
      where: { id: { in: ruangLabIds } },
      orderBy: { createdAt: "desc" },
      include: {
        mejas: {
          orderBy: { id: "asc" },
          include: {
            unitBarangs: {
              orderBy: { id: "asc" },
              select: {
                id: true,
                kodeBarang: true,
                kondisiBarang: true,
                status: true,
                barang: {
                  select: { namaBarang: true },
                },
              },
            },
          },
        },
      },
    });

    const data = ruangLabs.map((rl) => ({
      id: Number(rl.id),
      namaRuang: rl.namaRuang,
      deskripsi: rl.deskripsi || "",
      mejas: rl.mejas.map((m) => ({
        id: Number(m.id),
        meja: m.meja,
        unitBarangs: m.unitBarangs.map((ub) => ({
          id: Number(ub.id),
          kodeBarang: ub.kodeBarang,
          namaBarang: ub.barang.namaBarang,
          kondisiBarang: ub.kondisiBarang,
          status: ub.status,
        })),
      })),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Export data error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
