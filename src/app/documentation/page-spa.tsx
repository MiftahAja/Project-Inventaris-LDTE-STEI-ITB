"use client";

import AuthLayout from "@/components/AuthLayout";
import { BookOpen } from "lucide-react";

export default function DocumentationPage() {
  return (
    <AuthLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dokumentasi Aplikasi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inventaris LDTE — Sistem Manajemen Inventaris Laboratorium
            </p>
          </div>
        </div>

        {/* Pengenalan Aplikasi */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              1. Pengenalan Aplikasi
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              <p>
                <strong>Inventaris LDTE</strong> adalah aplikasi web yang dirancang untuk
                mengelola inventaris perangkat dan peralatan di lingkungan laboratorium.
                Aplikasi ini memungkinkan administrator dan petugas untuk mencatat,
                memantau, dan melaporkan seluruh aset inventaris secara digital.
              </p>
              <p>
                Dengan antarmuka yang terstruktur, aplikasi ini membantu memastikan
                setiap barang tercatat dengan baik beserta kondisi, lokasi, dan riwayat
                pergerakannya.
              </p>
            </div>
          </div>

          {/* Arsitektur & Tech Stack */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              2. Arsitektur dan Tech Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Frontend
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>React 19</li>
                  <li>React Router DOM v7</li>
                  <li>Tailwind CSS v4</li>
                  <li>Vite</li>
                  <li>Recharts (grafik)</li>
                  <li>Lucide React (ikon)</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Backend
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Next.js 16 (API Routes)</li>
                  <li>Prisma ORM</li>
                  <li>PostgreSQL</li>
                  <li>Supabase (auth adapter)</li>
                  <li>Redis (ioredis)</li>
                  <li>XLSX (export spreadsheet)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Struktur Data */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              3. Struktur Data Utama
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Entitas
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Keterangan
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Relasi
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">User</td>
                    <td className="py-3 px-4">Akun pengguna (admin / petugas)</td>
                    <td className="py-3 px-4">Assignment, ActivityLog</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Barang</td>
                    <td className="py-3 px-4">Data master barang/jenis peralatan</td>
                    <td className="py-3 px-4">UnitBarang</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Ruang Lab</td>
                    <td className="py-3 px-4">Ruang laboratorium</td>
                    <td className="py-3 px-4">Meja, UnitBarang, Assignment</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Meja</td>
                    <td className="py-3 px-4">Meja di dalam ruang lab</td>
                    <td className="py-3 px-4">RuangLab, UnitBarang</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Unit Barang</td>
                    <td className="py-3 px-4">Satuan/spesimen fisik dari suatu barang</td>
                    <td className="py-3 px-4">Barang, RuangLab, Meja, MutasiStok</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Mutasi Stok</td>
                    <td className="py-3 px-4">Riwayat pergerakan barang (masuk/keluar)</td>
                    <td className="py-3 px-4">UnitBarang</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Assignment</td>
                    <td className="py-3 px-4">Penugasan petugas ke ruang lab</td>
                    <td className="py-3 px-4">User, RuangLab</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Activity Log</td>
                    <td className="py-3 px-4">Catatan aktivitas pengguna</td>
                    <td className="py-3 px-4">User</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sistem Role */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              4. Sistem Role dan Hak Akses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  Administrator
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>- Mengelola data barang (CRUD)</li>
                  <li>- Mengelola ruang lab dan meja</li>
                  <li>- Mengelola unit barang</li>
                  <li>- Mengelola data petugas</li>
                  <li>- Mencatat mutasi stok</li>
                  <li>- Menugaskan petugas ke lab</li>
                  <li>- Melihat activity log</li>
                  <li>- Export data ke spreadsheet</li>
                  <li>- Akses seluruh fitur aplikasi</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  Petugas
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>- Melihat daftar barang</li>
                  <li>- Melihat ruang lab dan meja</li>
                  <li>- Melihat unit barang di lab yang ditugaskan</li>
                  <li>- Melihat lab yang ditugaskan (Lab Saya)</li>
                  <li>- Export data lab yang ditugaskan</li>
                  <li>- Akses dokumentasi dan panduan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modul Aplikasi */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              5. Modul Aplikasi
            </h2>

            <div className="space-y-4">
              {/* Dashboard */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.1 Dashboard
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Halaman utama yang menampilkan ringkasan data inventaris. Informasi yang
                  ditampilkan meliputi total barang, jumlah unit tersedia, kondisi barang
                  (baik, rusak, hilang), grafik barang masuk/keluar 7 hari terakhir, dan
                  distribusi status unit barang.
                </p>
              </div>

              {/* Barang */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.2 Manajemen Barang
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul untuk mengelola data master barang. Setiap barang memiliki nama unik
                  yang menjadi identitas jenis peralatan. Admin dapat menambah, mengedit,
                  dan menghapus data barang.
                </p>
              </div>

              {/* Ruang Lab */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.3 Ruang Lab
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul untuk mengelola data ruang laboratorium. Setiap ruang lab memiliki
                  nama dan deskripsi. Ruang lab menjadi lokasi penempatan meja dan unit
                  barang.
                </p>
              </div>

              {/* Meja */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.4 Meja
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul untuk mengelola meja di dalam ruang lab. Setiap meja terhubung ke
                  satu ruang lab dan dapat menampung beberapa unit barang. Kombinasi nama
                  meja dan ruang lab harus unik.
                </p>
              </div>

              {/* Unit Barang */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.5 Unit Barang
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul untuk mengelola satuan/spesimen fisik dari suatu barang. Setiap unit
                  memiliki kode unik (dalam satu ruang lab), kondisi (baik, rusak, hilang),
                  status (tersedia, dipinjam, dll.), serta lokasi penempatan (ruang lab dan
                  meja).
                </p>
              </div>

              {/* Mutasi Stok */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.6 Mutasi Stok
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul untuk mencatat pergerakan barang masuk dan keluar. Setiap mutasi
                  memiliki tipe (MASUK/KELUAR), tanggal, dan keterangan. Data dapat
                  difilter berdasarkan tanggal.
                </p>
              </div>

              {/* Penugasan */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.7 Manajemen Penugasan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul admin untuk menugaskan petugas ke ruang lab tertentu. Setiap lab
                  hanya boleh memiliki satu petugas aktif pada satu waktu. Riwayat
                  penugasan tersimpan untuk keperluan audit.
                </p>
              </div>

              {/* Lab Saya */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.8 Lab Saya
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Halaman khusus petugas yang menampilkan daftar lab tempat mereka ditugaskan.
                  Dari halaman ini, petugas dapat langsung melihat unit barang di lab
                  terkait.
                </p>
              </div>

              {/* Activity Log */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.9 Activity Log
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul admin untuk memantau seluruh aktivitas pengguna di dalam sistem.
                  Setiap aktivitas tercatat beserta pelaku, deskripsi, waktu kejadian, dan
                  jenis event.
                </p>
              </div>

              {/* Export Data */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.10 Export Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Modul untuk mengunduh data inventaris dalam format spreadsheet (.xlsx).
                  Admin dapat export semua lab sekaligus atau per lab. Petugas hanya dapat
                  export lab yang ditugaskan. File yang dihasilkan berisi detail meja,
                  kondisi, dan status setiap unit barang.
                </p>
              </div>

              {/* Customer Service */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  5.11 Pusat Dukungan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Halaman untuk mengirim pesan atau pertanyaan terkait penggunaan aplikasi.
                  Pengguna dapat mengisi formulir dengan nama, email, subjek, dan pesan.
                  Respons akan diberikan dalam waktu 1x24 jam.
                </p>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              6. Endpoint API
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Endpoint
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Method
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/auth/login</td>
                    <td className="py-2 px-4">POST</td>
                    <td className="py-2 px-4">Autentikasi pengguna</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/auth/logout</td>
                    <td className="py-2 px-4">POST</td>
                    <td className="py-2 px-4">Logout pengguna</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/auth/me</td>
                    <td className="py-2 px-4">GET</td>
                    <td className="py-2 px-4">Data profil pengguna aktif</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/barang</td>
                    <td className="py-2 px-4">GET/POST/PUT/DELETE</td>
                    <td className="py-2 px-4">CRUD data barang</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/unit-barang</td>
                    <td className="py-2 px-4">GET/POST/PUT/DELETE</td>
                    <td className="py-2 px-4">CRUD unit barang</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/ruang-lab</td>
                    <td className="py-2 px-4">GET/POST/PUT/DELETE</td>
                    <td className="py-2 px-4">CRUD ruang lab</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/meja</td>
                    <td className="py-2 px-4">GET/POST/PUT/DELETE</td>
                    <td className="py-2 px-4">CRUD meja</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/mutasi-stok</td>
                    <td className="py-2 px-4">GET/POST</td>
                    <td className="py-2 px-4">Data dan pencatatan mutasi</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/petugas</td>
                    <td className="py-2 px-4">GET/POST/PUT/DELETE</td>
                    <td className="py-2 px-4">Manajemen data petugas</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/assignments</td>
                    <td className="py-2 px-4">GET/POST</td>
                    <td className="py-2 px-4">Penugasan petugas ke lab</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 font-mono text-xs">/api/activity-log</td>
                    <td className="py-2 px-4">GET</td>
                    <td className="py-2 px-4">Riwayat aktivitas</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-mono text-xs">/api/export-data</td>
                    <td className="py-2 px-4">GET</td>
                    <td className="py-2 px-4">Data untuk export spreadsheet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Informasi Teknis */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              7. Informasi Teknis
            </h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Database
                </h3>
                <p>
                  Menggunakan PostgreSQL dengan Prisma ORM. Schema terdiri dari tabel users,
                  sessions, barangs, ruang_labs, mejas, unit_barangs, mutasi_stoks,
                  assignments, activity_logs, dan tabel pendukung lainnya.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Autentikasi
                </h3>
                <p>
                  Sesi pengguna dikelola melalui tabel sessions dengan cookie-based
                  authentication. Password di-hash menggunakan bcryptjs. Token autentikasi
                  dihasilkan menggunakan jose (JWT).
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Deployment
                </h3>
                <p>
                  Mendukung deployment menggunakan Docker (docker-compose). Perintah yang
                  tersedia: docker:build, docker:up, docker:down, docker:dev, docker:prod.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
