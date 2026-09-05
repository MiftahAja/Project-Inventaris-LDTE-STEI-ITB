import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Mengosongkan database (hanya menyisakan akun admin)...\n");

  const result = await prisma.$transaction([
    // Transaksi & peminjaman (depend pada unit_barangs)
    prisma.mutasiStok.deleteMany(),

    // Inventaris
    prisma.unitBarang.deleteMany(),
    prisma.meja.deleteMany(),

    // Penugasan & profil petugas
    prisma.assignment.deleteMany(),
    prisma.tambahPetugas.deleteMany(),

    // Log & sesi
    prisma.activityLog.deleteMany(),
    prisma.session.deleteMany(),

    // Master data
    prisma.barang.deleteMany(),
    prisma.ruangLab.deleteMany(),

    // Lain-lain
    prisma.passwordResetToken.deleteMany(),
    prisma.cache.deleteMany(),
    prisma.cacheLock.deleteMany(),

    // User selain admin
    prisma.user.deleteMany({ where: { role: { not: "admin" } } }),
  ]);

  const deletedCount = result.reduce((acc, r) => acc + r.count, 0);
  console.log(`${deletedCount} baris dihapus dari semua tabel (kecuali akun admin).`);

  const admins = await prisma.user.findMany({ where: { role: "admin" } });
  console.log(`Akun admin yang dipertahankan (${admins.length}):`);
  for (const admin of admins) {
    console.log(`   - ${admin.name} (${admin.email})`);
  }
}

main()
  .catch((e) => {
    console.error("Reset error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });