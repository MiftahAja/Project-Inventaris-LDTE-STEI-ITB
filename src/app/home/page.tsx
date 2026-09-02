import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import DashboardCharts from "@/components/DashboardCharts";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default async function HomePage() {
  const session = await requireAuth();

  // Get unit barang statistics
  const [tersedia, baik, rusak, hilang] = await Promise.all([
    db.unitBarang.count({ where: { status: "Tersedia" } }),
    db.unitBarang.count({ where: { kondisiBarang: "baik" } }),
    db.unitBarang.count({ where: { kondisiBarang: "rusak" } }),
    db.unitBarang.count({ where: { kondisiBarang: "hilang" } }),
  ]);

  // Get mutasi stok data for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const mutasiData = await db.mutasiStok.findMany({
    where: {
      tanggal: { gte: sevenDaysAgo },
    },
    select: {
      tanggal: true,
      tipe: true,
    },
    orderBy: { tanggal: "asc" },
  });

  // Process chart data
  const chartData = processChartData(mutasiData);

  const stats = [
    {
      title: "Tersedia",
      value: tersedia,
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Kondisi Baik",
      value: baik,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Kondisi Rusak",
      value: rusak,
      icon: AlertTriangle,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      title: "Hilang",
      value: hilang,
      icon: XCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <AuthLayout userId={Number(session.userId)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selamat datang di Sistem Inventaris LDTE
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`${stat.bgColor} rounded-xl p-5 border border-gray-200 dark:border-gray-700 card-hover animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <DashboardCharts chartData={chartData} />
      </div>
    </AuthLayout>
  );
}

function processChartData(
  data: { tanggal: Date; tipe: string }[]
) {
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

    const dayData = data.filter((d) => {
      const dDate = new Date(d.tanggal);
      return (
        dDate.getDate() === date.getDate() &&
        dDate.getMonth() === date.getMonth() &&
        dDate.getFullYear() === date.getFullYear()
      );
    });

    masuk.push(dayData.filter((d) => d.tipe === "MASUK").length);
    keluar.push(dayData.filter((d) => d.tipe === "KELUAR").length);
  }

  return { days, masuk, keluar };
}
