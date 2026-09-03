import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // =============================================
  // 1. Admin User
  // =============================================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ldte.ac.id" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@ldte.ac.id",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log(` Admin user: ${admin.email} / admin123`);

  // Admin 2
  const admin2Password = await bcrypt.hash("adminelektro", 10);
  const admin2 = await prisma.user.upsert({
    where: { email: "adminelektro@itb.ac.id" },
    update: {},
    create: {
      name: "Admin Elektro",
      email: "adminelektro@itb.ac.id",
      password: admin2Password,
      role: "admin",
    },
  });
  console.log(` Admin 2: ${admin2.email} / adminelektro`);

  // =============================================
  // 2. Petugas Users
  // =============================================
  const petugasPassword = await bcrypt.hash("petugas123", 10);

  const petugas1 = await prisma.user.upsert({
    where: { email: "andi@ldte.ac.id" },
    update: {},
    create: {
      name: "Andi Pratama",
      email: "andi@ldte.ac.id",
      password: petugasPassword,
      role: "petugas",
    },
  });

  const petugas2 = await prisma.user.upsert({
    where: { email: "budi@ldte.ac.id" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "budi@ldte.ac.id",
      password: petugasPassword,
      role: "petugas",
    },
  });

  // Create tambah_petugas profiles
  await prisma.tambahPetugas.upsert({
    where: { userId: petugas1.id },
    update: {},
    create: {
      userId: petugas1.id,
      noTelp: "081234567890",
      alamat: "Jl. Merdeka No. 10, Bandung",
    },
  });

  await prisma.tambahPetugas.upsert({
    where: { userId: petugas2.id },
    update: {},
    create: {
      userId: petugas2.id,
      noTelp: "085678901234",
      alamat: "Jl. Sudirman No. 25, Bandung",
    },
  });
  console.log(` Petugas: ${petugas1.email} / petugas123`);
  console.log(` Petugas: ${petugas2.email} / petugas123`);

  // =============================================
  // 3. Ruang Lab
  // =============================================
  const lab1 = await prisma.ruangLab.create({
    data: {
      namaRuang: "Lab Elektronika Dasar",
      deskripsi: "Laboratorium untuk praktikum elektronika dasar",
    },
  });

  const lab2 = await prisma.ruangLab.create({
    data: {
      namaRuang: "Lab Pemrograman",
      deskripsi: "Laboratorium untuk praktikum pemrograman",
    },
  });

  const lab3 = await prisma.ruangLab.create({
    data: {
      namaRuang: "Lab Jaringan Komputer",
      deskripsi: "Laboratorium untuk praktikum jaringan komputer",
    },
  });
  console.log(` Ruang Lab: ${lab1.namaRuang}, ${lab2.namaRuang}, ${lab3.namaRuang}`);

  // =============================================
  // 4. Meja
  // =============================================
  const mejaData = [];
  for (let i = 1; i <= 6; i++) {
    const meja = await prisma.meja.create({
      data: {
        ruangLabId: lab1.id,
        meja: `Meja ${i}`,
      },
    });
    mejaData.push(meja);
  }

  for (let i = 1; i <= 8; i++) {
    const meja = await prisma.meja.create({
      data: {
        ruangLabId: lab2.id,
        meja: `Meja ${i}`,
      },
    });
    mejaData.push(meja);
  }

  for (let i = 1; i <= 4; i++) {
    const meja = await prisma.meja.create({
      data: {
        ruangLabId: lab3.id,
        meja: `Meja ${i}`,
      },
    });
    mejaData.push(meja);
  }
  console.log(` Meja: ${mejaData.length} meja dibuat`);

  // =============================================
  // 5. Barang (Master Data)
  // =============================================
  const barangData = [
    { namaBarang: "Oscilloscope" },
    { namaBarang: "Multimeter Digital" },
    { namaBarang: "Power Supply" },
    { namaBarang: "Function Generator" },
    { namaBarang: "Solder Iron" },
    { namaBarang: "Resistor Kit" },
    { namaBarang: "Capacitor Kit" },
    { namaBarang: "Laptop" },
    { namaBarang: "Monitor LED" },
    { namaBarang: "Kabel Jumper" },
  ];

  const barangs = [];
  for (const b of barangData) {
    const barang = await prisma.barang.create({ data: b });
    barangs.push(barang);
  }
  console.log(` Barang: ${barangs.length} item dibuat`);

  // =============================================
  // 6. Unit Barang
  // =============================================
  const unitBarangData = [
    { barangId: barangs[0].id, kodeBarang: "OSC-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[0].id },
    { barangId: barangs[0].id, kodeBarang: "OSC-002", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[1].id },
    { barangId: barangs[1].id, kodeBarang: "DMM-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[2].id },
    { barangId: barangs[1].id, kodeBarang: "DMM-002", kondisiBarang: "rusak", status: "Rusak", ruangLabId: lab1.id, mejaId: mejaData[3].id },
    { barangId: barangs[2].id, kodeBarang: "PSU-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[4].id },
    { barangId: barangs[3].id, kodeBarang: "FG-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[5].id },
    { barangId: barangs[4].id, kodeBarang: "SOL-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[0].id },
    { barangId: barangs[5].id, kodeBarang: "RES-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[1].id },
    { barangId: barangs[6].id, kodeBarang: "CAP-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab1.id, mejaId: mejaData[2].id },
    { barangId: barangs[7].id, kodeBarang: "LPT-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab2.id, mejaId: mejaData[6].id },
    { barangId: barangs[7].id, kodeBarang: "LPT-002", kondisiBarang: "baik", status: "Dipinjam", ruangLabId: lab2.id, mejaId: mejaData[7].id },
    { barangId: barangs[7].id, kodeBarang: "LPT-003", kondisiBarang: "hilang", status: "Rusak", ruangLabId: lab2.id, mejaId: mejaData[8].id },
    { barangId: barangs[8].id, kodeBarang: "MON-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab2.id, mejaId: mejaData[9].id },
    { barangId: barangs[9].id, kodeBarang: "KBL-001", kondisiBarang: "baik", status: "Tersedia", ruangLabId: lab3.id, mejaId: mejaData[14].id },
    { barangId: barangs[9].id, kodeBarang: "KBL-002", kondisiBarang: "rusak", status: "Rusak", ruangLabId: lab3.id, mejaId: mejaData[15].id },
  ];

  const unitBarangs = [];
  for (const ub of unitBarangData) {
    const unit = await prisma.unitBarang.create({ data: ub });
    unitBarangs.push(unit);
  }
  console.log(` Unit Barang: ${unitBarangs.length} unit dibuat`);

  // =============================================
  // 7. Mutasi Stok
  // =============================================
  const today = new Date();
  const mutasiData = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Create 2-4 mutasi per day
    const count = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < count; j++) {
      const unitIndex = Math.floor(Math.random() * unitBarangs.length);
      const tipe = Math.random() > 0.4 ? "MASUK" : "KELUAR";

      mutasiData.push({
        unitBarangId: unitBarangs[unitIndex].id,
        tipe,
        tanggal: date,
        keterangan: tipe === "MASUK" ? "Pengadaan baru" : "Dipinjam praktikum",
      });
    }
  }

  await prisma.mutasiStok.createMany({ data: mutasiData });
  console.log(` Mutasi Stok: ${mutasiData.length} catatan dibuat`);

  // =============================================
  // 8. Assignments
  // =============================================
  await prisma.assignment.create({
    data: {
      userId: petugas1.id,
      ruangLabId: lab1.id,
      isActive: true,
      assignedBy: admin.id,
    },
  });

  await prisma.assignment.create({
    data: {
      userId: petugas2.id,
      ruangLabId: lab2.id,
      isActive: true,
      assignedBy: admin.id,
    },
  });
  console.log(" Assignments: 2 penugasan aktif");

  // =============================================
  // 9. Activity Logs
  // =============================================
  await prisma.activityLog.createMany({
    data: [
      {
        logName: "auth",
        description: "Admin login",
        event: "login",
        causerId: admin.id,
      },
      {
        logName: "barang",
        description: "Menambahkan barang: Oscilloscope",
        subjectType: "Barang",
        subjectId: barangs[0].id,
        event: "created",
        causerId: admin.id,
      },
      {
        logName: "ruang_lab",
        description: "Menambahkan ruang lab: Lab Elektronika Dasar",
        subjectType: "RuangLab",
        subjectId: lab1.id,
        event: "created",
        causerId: admin.id,
      },
      {
        logName: "assignment",
        description: `Menugaskan ${petugas1.name} ke ${lab1.namaRuang}`,
        subjectType: "Assignment",
        event: "created",
        causerId: admin.id,
      },
    ],
  });
  console.log(" Activity Logs: 4 catatan dibuat");

  // =============================================
  // 10. Fakultas & Program Studi
  // =============================================
  const fakultas = await prisma.fakultas.create({
    data: { name: "Fakultas Teknik" },
  });

  const prodi1 = await prisma.programStudi.create({
    data: {
      fakultasId: fakultas.id,
      name: "Teknik Elektro",
    },
  });

  const prodi2 = await prisma.programStudi.create({
    data: {
      fakultasId: fakultas.id,
      name: "Teknik Informatika",
    },
  });

  await prisma.mataKuliah.createMany({
    data: [
      {
        programStudiId: prodi1.id,
        kode: "TE101",
        nama: "Elektronika Dasar",
        isPraktikum: true,
      },
      {
        programStudiId: prodi1.id,
        kode: "TE201",
        nama: "Pemrograman Mikrokontroler",
        isPraktikum: true,
      },
      {
        programStudiId: prodi2.id,
        kode: "TI101",
        nama: "Pemrograman Dasar",
        isPraktikum: true,
      },
      {
        programStudiId: prodi2.id,
        kode: "TI201",
        nama: "Jaringan Komputer",
        isPraktikum: true,
      },
    ],
  });
  console.log(" Akademik: 1 fakultas, 2 prodi, 4 mata kuliah");

  // =============================================
  // 11. Global Config
  // =============================================
  await prisma.globalConfig.create({
    data: {
      nomorSurat: "001/LDTE/2026",
      lineoaLdte: "@ldte_official",
    },
  });
  console.log(" Global Config dibuat");

  console.log("\n Seeding selesai!");
  console.log("\n Akun yang dibuat:");
  console.log("   Admin   : admin@ldte.ac.id / admin123");
  console.log("   Admin   : adminelektro@itb.ac.id / adminelektro");
  console.log("   Petugas : andi@ldte.ac.id / petugas123");
  console.log("   Petugas : budi@ldte.ac.id / petugas123");
}

main()
  .catch((e) => {
    console.error(" Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
