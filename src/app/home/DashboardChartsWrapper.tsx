"use client";

import { lazy, Suspense } from "react";

// Dynamically import DashboardCharts to reduce initial bundle size
// recharts is a heavy library (~200KB) - only load when needed
const DashboardCharts = lazy(() => import("@/components/DashboardCharts"));

interface ChartData {
  days: string[];
  masuk: number[];
  keluar: number[];
}

interface DashboardChartsWrapperProps {
  chartData: ChartData;
}

function ChartsFallback() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function DashboardChartsWrapper({
  chartData,
}: DashboardChartsWrapperProps) {
  return (
    <Suspense fallback={<ChartsFallback />}>
      <DashboardCharts chartData={chartData} />
    </Suspense>
  );
}
