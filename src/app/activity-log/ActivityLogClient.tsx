"use client";

import DataTable from "@/components/DataTable";
import { formatDateTime } from "@/lib/utils";

interface ActivityLog {
  id: number;
  logName: string;
  description: string;
  event: string;
  userName: string;
  createdAt: string;
}

interface ActivityLogClientProps {
  logs: ActivityLog[];
}

export default function ActivityLogClient({ logs }: ActivityLogClientProps) {
  return (
    <DataTable
      data={logs}
      columns={[
        {
          key: "event",
          label: "Event",
          render: (item) => (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.event === "created"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : item.event === "updated"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {item.event}
            </span>
          ),
        },
        { key: "description", label: "Deskripsi" },
        { key: "userName", label: "Pengguna" },
        {
          key: "createdAt",
          label: "Waktu",
          render: (item) => formatDateTime(item.createdAt),
        },
      ]}
      title="Activity Log"
      showActions={false}
      itemsPerPage={20}
    />
  );
}
