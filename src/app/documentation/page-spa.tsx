"use client";

import AuthLayout from "@/components/AuthLayout";
import { BookOpen } from "lucide-react";

export default function DocumentationPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dokumentasi</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Panduan lengkap penggunaan aplikasi Inventaris LDTE
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Selamat Datang di Dokumentasi Inventaris LDTE
            </h2>

            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  1. Dashboard
                </h3>
                <p>
                  Dashboard menampilkan ringkasan data inventaris termasuk jumlah unit barang
                  tersedia, kondisi baik, rusak, dan hilang. Terdapat juga grafik barang masuk
                  dan keluar 7 hari terakhir serta distribusi status barang.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  2. Manajemen Barang
                </h3>
                <p>
                  Kelola data master barang. Admin dapat menambah, mengedit, dan menghapus barang.
                  Petugas dan pengunjung dapat melihat daftar barang.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  3. Unit Barang
                </h3>
                <p>
                  Kelola satuan/spesimen fisik dari suatu barang. Setiap unit memiliki kode unik,
                  kondisi, status, dan lokasi (ruang lab + meja).
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  4. Ruang Lab & Meja
                </h3>
                <p>
                  Kelola ruang laboratorium dan meja di dalamnya. Setiap meja dapat menampung
                  beberapa unit barang.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  5. Mutasi Stok
                </h3>
                <p>
                  Pantau pergerakan barang masuk dan keluar. Data dapat difilter berdasarkan
                  tanggal dan diekspor ke format spreadsheet.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  6. Penugasan Petugas
                </h3>
                <p>
                  Admin dapat menugaskan petugas ke ruang lab tertentu. Setiap lab hanya boleh
                  memiliki satu petugas aktif pada satu waktu.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
