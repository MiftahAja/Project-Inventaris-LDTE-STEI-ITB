import { requireAuth } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import { FileText } from "lucide-react";

export default async function PanduanAplikasiPage() {
  const session = await requireAuth();

  return (
    <AuthLayout userId={Number(session.userId)}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panduan Aplikasi</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cara penggunaan aplikasi Inventaris LDTE
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cara Login
              </h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Buka halaman login di browser</li>
                <li>Masukkan email dan password</li>
                <li>Klik tombol &quot;Masuk&quot;</li>
                <li>Anda akan diarahkan ke dashboard</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cara Menambah Barang
              </h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Menuju ke halaman &quot;Barang&quot; di sidebar</li>
                <li>Klik tombol &quot;Tambah Barang&quot;</li>
                <li>Isi nama barang</li>
                <li>Klik &quot;Simpan&quot;</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cara Menambah Unit Barang
              </h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Menuju ke halaman &quot;Unit Barang&quot; di sidebar</li>
                <li>Klik tombol &quot;Tambah Unit&quot;</li>
                <li>Pilih barang, isi kode, pilih ruang lab, meja, kondisi, dan status</li>
                <li>Klik &quot;Simpan&quot;</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Mode Gelap
              </h3>
              <p>
                Klik ikon bulan/matahari di sidebar (desktop) atau navbar (mobile) untuk
                beralih antara mode terang dan gelap.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Pencarian Menu
              </h3>
              <p>
                Gunakan kolom pencarian di sidebar untuk memfilter menu secara real-time.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
