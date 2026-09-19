"use client";

import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/auth-context";
import {
  FileText,
  Shield,
  Wrench,
  Package,
  DoorOpen,
  TableProperties,
  Boxes,
  Users,
  ArrowLeftRight,
  ClipboardList,
  Download,
  LayoutDashboard,
  BookOpen,
  ChevronRight,
} from "lucide-react";

type RoleTab = "admin" | "petugas";

interface GuideSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: string[];
  note?: string;
}

const adminGuides: GuideSection[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    steps: [
      "Buka menu Dashboard dari sidebar untuk melihat ringkasan data inventaris.",
      "Perhatikan empat kartu statistik: Tersedia, Kondisi Baik, Kondisi Rusak, dan Hilang.",
      "Grafik di bawah menunjukkan jumlah barang masuk dan keluar selama 7 hari terakhir.",
      "Distribusi status barang ditampilkan dalam bentuk pie chart.",
    ],
    note: "Dashboard diperbarui secara otomatis setiap kali halaman dimuat.",
  },
  {
    title: "Manajemen Barang",
    icon: Package,
    steps: [
      'Buka menu "Barang" dari sidebar.',
      'Klik tombol "Tambah Barang" untuk menambah data baru.',
      "Masukkan nama barang (harus unik).",
      'Klik "Simpan" untuk menyimpan data.',
      "Untuk mengedit, klik tombol pensil pada baris data yang diinginkan.",
      "Ubah data yang diperlukan lalu klik Simpan.",
      "Untuk menghapus, klik tombol tempat sampah lalu konfirmasi penghapusan.",
    ],
    note: "Nama barang harus unik di seluruh sistem. Penghapusan barang juga akan menghapus semua unit barang terkait.",
  },
  {
    title: "Manajemen Ruang Lab",
    icon: DoorOpen,
    steps: [
      'Buka menu "Ruang Lab" dari sidebar.',
      'Klik "Tambah Ruang Lab" untuk menambah data baru.',
      "Masukkan nama ruang lab dan deskripsi (opsional).",
      'Klik "Simpan" untuk menyimpan data.',
      "Gunakan pencarian di tabel untuk memfilter ruang lab.",
      "Untuk mengedit atau menghapus, gunakan tombol aksi pada baris data.",
    ],
    note: "Ruang lab harus dibuat terlebih dahulu sebelum menambahkan meja atau unit barang.",
  },
  {
    title: "Manajemen Meja",
    icon: TableProperties,
    steps: [
      'Buka menu "Meja" dari sidebar.',
      'Klik "Tambah Meja" untuk menambah data baru.',
      "Pilih ruang lab dari dropdown yang tersedia.",
      "Masukkan nama/label meja.",
      'Klik "Simpan" untuk menyimpan data.',
      "Jumlah unit barang per meja ditampilkan di kolom terakhir.",
    ],
    note: "Kombinasi nama meja dan ruang lab harus unik. Meja harus dibuat sebelum menempatkan unit barang.",
  },
  {
    title: "Manajemen Unit Barang",
    icon: Boxes,
    steps: [
      'Buka menu "Unit Barang" dari sidebar.',
      'Klik "Tambah Unit" untuk menambah data baru.',
      "Pilih barang dari dropdown yang tersedia.",
      "Masukkan kode barang (unik dalam satu ruang lab).",
      "Pilih ruang lab dan meja tempat penempatan.",
      "Tentukan kondisi barang: Baik, Rusak, atau Hilang.",
      "Tentukan status barang: Tersedia, Dipinjam, atau status lainnya.",
      'Klik "Simpan" untuk menyimpan data.',
      "Gunakan filter untuk mencari unit berdasarkan kondisi, status, atau ruang lab.",
      "Untuk mengedit, klik tombol pensil pada baris data.",
      "Untuk menghapus, klik tombol tempat sampah lalu konfirmasi.",
    ],
    note: "Kode barang harus unik dalam satu ruang lab. Unit barang yang dihapus juga akan menghapus riwayat mutasi terkait.",
  },
  {
    title: "Mengelola Data Petugas",
    icon: Users,
    steps: [
      'Buka menu "Table Petugas" dari sidebar.',
      'Klik "Tambah Petugas" untuk mendaftarkan petugas baru.',
      "Isi nama lengkap, email, dan password.",
      "Isi nomor telepon dan alamat (opsional).",
      'Klik "Simpan" untuk menyimpan data.',
      "Untuk mengedit atau menghapus petugas, gunakan tombol aksi pada baris data.",
    ],
    note: "Hanya admin yang dapat mengelola data petugas. Petugas yang sudah ditugaskan ke lab tidak boleh dihapus.",
  },
  {
    title: "Mencatat Mutasi Stok",
    icon: ArrowLeftRight,
    steps: [
      'Buka menu "Mutasi Barang" dari sidebar.',
      'Klik tombol "Tambah Mutasi" untuk mencatat pergerakan baru.',
      "Pilih unit barang dari dropdown.",
      "Tentukan tipe mutasi: MASUK atau KELUAR.",
      "Pilih tanggal kejadian.",
      "Tambahkan keterangan (opsional) seperti alasan mutasi.",
      'Klik "Simpan" untuk mencatat mutasi.',
      "Riwayat mutasi ditampilkan dalam tabel dengan filter tanggal.",
    ],
    note: "Mutasi stok hanya dapat dilakukan oleh admin. Setiap mutasi akan tercatat secara permanen.",
  },
  {
    title: "Manajemen Penugasan Petugas",
    icon: ClipboardList,
    steps: [
      'Buka menu "Manajemen Penugasan" dari sidebar.',
      "Tiga kartu ringkasan akan ditampilkan: Total Lab, Lab Ditugaskan, dan Belum Ditugaskan.",
      "Pilih ruang lab yang ingin dikelola penugasannya.",
      'Klik tombol "Kelola" pada kartu lab terkait.',
      "Jika belum ada petugas aktif, pilih petugas dari dropdown lalu klik Simpan.",
      "Jika ingin mengganti petugas, pilih petugas baru lalu klik Simpan.",
      "Untuk membatalkan penugasan, klik tombol X pada petugas yang aktif.",
      "Riwayat penugasan ditampilkan di bagian bawah halaman.",
    ],
    note: "Setiap lab hanya boleh memiliki satu petugas aktif pada satu waktu. Penugasan baru akan otomatis menonaktifkan penugasan sebelumnya.",
  },
  {
    title: "Export Data",
    icon: Download,
    steps: [
      'Buka menu "Export Data" dari sidebar.',
      "Untuk export semua lab, klik tombol Export Semua Lab.",
      "Untuk export per lab, pilih kartu lab yang diinginkan lalu klik tombol Export.",
      "File Excel akan otomatis terunduh dengan format .xlsx.",
    ],
    note: "File export berisi sheet per ruang lab dengan detail meja, kondisi, dan status unit barang. Export semua lab juga menyertakan sheet Ringkasan.",
  },
  {
    title: "Activity Log",
    icon: BookOpen,
    steps: [
      'Buka menu "Activity Log" dari sidebar.',
      "Tabel menampilkan seluruh aktivitas pengguna di dalam sistem.",
      "Gunakan pagination untuk menavigasi antar halaman.",
      "Ubah jumlah data per halaman menggunakan dropdown di bagian bawah tabel.",
    ],
    note: "Activity log mencatat semua aktivitas pembuatan, pengubahan, dan penghapusan data beserta pelaku dan waktunya.",
  },
];

const petugasGuides: GuideSection[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    steps: [
      "Buka menu Dashboard dari sidebar untuk melihat ringkasan data inventaris.",
      "Kartu statistik menampilkan jumlah unit Tersedia, Baik, Rusak, dan Hilang.",
      "Grafik barang masuk/keluar 7 hari terakhir ditampilkan di bawah.",
    ],
    note: "Dashboard menampilkan data inventaris secara umum, bukan hanya lab yang ditugaskan.",
  },
  {
    title: "Lab Saya",
    icon: DoorOpen,
    steps: [
      'Buka menu "Lab Saya" dari sidebar.',
      "Kartu lab yang ditugaskan akan ditampilkan.",
      "Jika belum ditugaskan, hubungi admin untuk mendapatkan penugasan.",
      "Klik pada kartu lab untuk melihat daftar unit barang di lab tersebut.",
    ],
    note: "Halaman ini hanya menampilkan lab tempat Anda ditugaskan. Jika kosong, berarti belum ada penugasan dari admin.",
  },
  {
    title: "Melihat Daftar Barang",
    icon: Package,
    steps: [
      'Buka menu "Barang" dari sidebar.',
      "Daftar barang ditampilkan dalam tabel dengan kolom nama barang dan tanggal dibuat.",
      "Gunakan pencarian untuk memfilter daftar barang.",
      "Gunakan pagination untuk menavigasi antar halaman.",
    ],
    note: "Petugas hanya dapat melihat data barang, tidak dapat menambah, mengedit, atau menghapus.",
  },
  {
    title: "Melihat Ruang Lab",
    icon: DoorOpen,
    steps: [
      'Buka menu "Ruang Lab" dari sidebar.',
      "Daftar ruang lab ditampilkan dalam kartu dengan nama, deskripsi, dan jumlah unit.",
      "Gunakan pencarian untuk memfilter ruang lab.",
    ],
    note: "Petugas hanya dapat melihat data ruang lab.",
  },
  {
    title: "Melihat Meja",
    icon: TableProperties,
    steps: [
      'Buka menu "Meja" dari sidebar.',
      "Daftar meja ditampilkan dalam tabel dengan nama meja, ruang lab, dan jumlah barang.",
      "Gunakan filter untuk mencari meja berdasarkan ruang lab tertentu.",
    ],
    note: "Petugas hanya dapat melihat data meja, tidak dapat menambah atau mengubah.",
  },
  {
    title: "Melihat Unit Barang",
    icon: Boxes,
    steps: [
      'Buka menu "Unit Barang" dari sidebar.',
      "Daftar unit barang ditampilkan dengan informasi kode, nama, lokasi, kondisi, dan status.",
      "Gunakan filter untuk mencari berdasarkan kondisi, status, atau ruang lab.",
      "Gunakan pagination untuk menavigasi antar halaman.",
    ],
    note: "Petugas hanya dapat melihat data unit barang, tidak dapat menambah atau mengubah.",
  },
  {
    title: "Export Data Lab Saya",
    icon: Download,
    steps: [
      'Buka menu "Export Data" dari sidebar.',
      "Hanya lab yang ditugaskan yang akan ditampilkan.",
      'Klik tombol "Export" pada kartu lab yang diinginkan.',
      "File Excel akan otomatis terunduh.",
    ],
    note: "Petugas hanya dapat export data lab yang ditugaskan. Tidak ada opsi Export Semua Lab untuk petugas.",
  },
];

function GuideCard({ section, index }: { section: GuideSection; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const Icon = section.icon;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg shrink-0">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {index + 1}. {section.title}
          </h3>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800">
          <div className="pt-4 space-y-3">
            <ol className="space-y-2">
              {section.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            {section.note && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  <span className="font-semibold">Catatan:</span> {section.note}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PanduanPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState<RoleTab>(isAdmin ? "admin" : "petugas");

  const guides = activeTab === "admin" ? adminGuides : petugasGuides;

  return (
    <AuthLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Panduan Aplikasi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cara penggunaan aplikasi Inventaris LDTE
            </p>
          </div>
        </div>

        {/* Role Tab Selector */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "admin"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4" />
            Administrator
          </button>
          <button
            onClick={() => setActiveTab("petugas")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "petugas"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Wrench className="w-4 h-4" />
            Petugas
          </button>
        </div>

        {/* Guide Sections */}
        <div className="space-y-3">
          {/* Quick Info */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {activeTab === "admin"
                ? "Panduan ini berisi langkah-langkah lengkap untuk administrator dalam mengelola seluruh fitur aplikasi."
                : "Panduan ini berisi langkah-langkah penggunaan aplikasi untuk petugas yang ditugaskan di laboratorium."}
            </p>
          </div>

          {/* Guide Cards */}
          {guides.map((section, index) => (
            <GuideCard key={`${activeTab}-${section.title}`} section={section} index={index} />
          ))}
        </div>

        {/* Help Footer */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Masih butuh bantuan? Hubungi admin atau kunjungi halaman{" "}
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Customer Service
            </span>{" "}
            untuk mengirim pertanyaan.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
