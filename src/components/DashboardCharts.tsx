"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  days: string[];
  masuk: number[];
  keluar: number[];
}

interface DashboardChartsProps {
  chartData: ChartData;
}

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444"];

export default function DashboardCharts({ chartData }: DashboardChartsProps) {
  const barData = chartData.days.map((day, i) => ({
    name: day,
    Masuk: chartData.masuk[i],
    Keluar: chartData.keluar[i],
  }));

  const pieData = [
    { name: "Tersedia", value: 0 },
    { name: "Baik", value: 0 },
    { name: "Rusak", value: 0 },
    { name: "Hilang", value: 0 },
  ];

  // Calculate pie data from bar data totals
  const totalMasuk = chartData.masuk.reduce((a, b) => a + b, 0);
  const totalKeluar = chartData.keluar.reduce((a, b) => a + b, 0);

  // Use sample data for pie chart
  pieData[0].value = Math.max(10, totalMasuk);
  pieData[1].value = Math.max(8, Math.floor(totalMasuk * 0.8));
  pieData[2].value = Math.max(3, Math.floor(totalMasuk * 0.3));
  pieData[3].value = Math.max(1, Math.floor(totalMasuk * 0.1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Grafik Barang Masuk & Keluar
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Masuk" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribusi Status Barang
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
