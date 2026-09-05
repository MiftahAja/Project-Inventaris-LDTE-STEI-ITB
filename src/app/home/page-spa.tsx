"use client";

import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import DashboardChartsWrapper from "./DashboardChartsWrapper";

interface Stats {
  tersedia: number;
  baik: number;
  rusak: number;
  hilang: number;
}

interface MutasiData {
  tanggal: string;
  tipe: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<{ days: string[]; masuk: number[]; keluar: number[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tersedia, baik, rusak, hilang, mutasiRes] = await Promise.all([
          fetch("/api/unit-barang?status=Tersedia&pageSize=1").then(r => r.json()),
          fetch("/api/unit-barang?kondisiBarang=baik&pageSize=1").then(r => r.json()),
          fetch("/api/unit-barang?kondisiBarang=rusak&pageSize=1").then(r => r.json()),
          fetch("/api/unit-barang?kondisiBarang=hilang&pageSize=1").then(r => r.json()),
          fetch("/api/mutasi-stok").then(r => r.json()),
        ]);

        setStats({
          tersedia: tersedia.total || 0,
          baik: baik.total || 0,
          rusak: rusak.total || 0,
          hilang: hilang.total || 0,
        });

        // Process chart data from mutasi
        const mutasiData = mutasiRes.data || [];
        const days: string[] = [];
        const masuk: number[] = [];
        const keluar: number[] = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          });
          days.push(dateStr);

          const dayData = mutasiData.filter((d: MutasiData) => {
            const dDate = new Date(d.tanggal);
            return (
              dDate.getDate() === date.getDate() &&
              dDate.getMonth() === date.getMonth() &&
              dDate.getFullYear() === date.getFullYear()
            );
          });

          masuk.push(dayData.filter((d: MutasiData) => d.tipe === "MASUK").length);
          keluar.push(dayData.filter((d: MutasiData) => d.tipe === "KELUAR").length);
        }

        setChartData({ days, masuk, keluar });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsCards = stats
    ? [
        { title: "Tersedia", value: stats.tersedia, icon: Package, color: "bg-blue-500", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
        { title: "Kondisi Baik", value: stats.baik, icon: CheckCircle, color: "bg-green-500", bgColor: "bg-green-50 dark:bg-green-900/20" },
        { title: "Kondisi Rusak", value: stats.rusak, icon: AlertTriangle, color: "bg-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
        { title: "Hilang", value: stats.hilang, icon: XCircle, color: "bg-red-500", bgColor: "bg-red-50 dark:bg-red-900/20" },
      ]
    : [];

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selamat datang di Sistem Inventaris LDTE
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 sm:p-5 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`${stat.bgColor} rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 card-hover animate-slide-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`${stat.color} p-2 sm:p-3 rounded-xl shadow-lg shrink-0`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {chartData && <DashboardChartsWrapper chartData={chartData} />}
      </div>
    </AuthLayout>
  );
}
