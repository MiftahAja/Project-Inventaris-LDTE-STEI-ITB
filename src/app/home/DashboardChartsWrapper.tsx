"use client";

import dynamic from "next/dynamic";

// Dynamically import DashboardCharts to reduce initial bundle size
// recharts is a heavy library (~200KB) - only load when needed
const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), {
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="skeleton h-[300px] w-full" />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="skeleton h-6 w-48 mb-4" />
        <div className="skeleton h-[300px] w-full" />
      </div>
    </div>
  ),
  ssr: false, // Charts don't need SSR
});

interface ChartData {
  days: string[];
  masuk: number[];
  keluar: number[];
}

interface DashboardChartsWrapperProps {
  chartData: ChartData;
}

export default function DashboardChartsWrapper({
  chartData,
}: DashboardChartsWrapperProps) {
  return <DashboardCharts chartData={chartData} />;
}
