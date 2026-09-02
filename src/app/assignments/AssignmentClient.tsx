"use client";

import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import Link from "next/link";

interface RuangLab {
  id: number;
  namaRuang: string;
  deskripsi: string;
  petugas: string | null;
  isActive: boolean;
}

interface AssignmentClientProps {
  ruangLabs: RuangLab[];
}

export default function AssignmentClient({ ruangLabs }: AssignmentClientProps) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Nama Lab
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Petugas
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {ruangLabs.map((rl, index) => (
              <tr
                key={rl.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {rl.namaRuang}
                    </p>
                    {rl.deskripsi && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {rl.deskripsi}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {rl.petugas ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      {rl.petugas}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                      Belum ditugaskan
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rl.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {rl.isActive ? "Aktif" : "Kosong"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/assignments/ruang-lab/${rl.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Kelola
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
