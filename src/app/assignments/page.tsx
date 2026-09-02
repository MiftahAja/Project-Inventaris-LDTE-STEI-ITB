import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AuthLayout from "@/components/AuthLayout";
import AssignmentClient from "./AssignmentClient";
import { DoorOpen, Users, AlertCircle } from "lucide-react";

export default async function AssignmentsPage() {
  const session = await requireAdmin();

  const ruangLabs = await db.ruangLab.findMany({
    include: {
      assignments: {
        where: { isActive: true },
        include: { user: true },
      },
    },
    orderBy: { namaRuang: "asc" },
  });

  const totalLabs = ruangLabs.length;
  const assignedLabs = ruangLabs.filter((rl) => rl.assignments.length > 0).length;
  const unassignedLabs = totalLabs - assignedLabs;

  return (
    <AuthLayout userId={Number(session.userId)}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-xl">
                <DoorOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Lab</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLabs}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lab Ditugaskan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignedLabs}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Belum Ditugaskan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{unassignedLabs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Table */}
        <AssignmentClient
          ruangLabs={ruangLabs.map((rl) => ({
            id: Number(rl.id),
            namaRuang: rl.namaRuang,
            deskripsi: rl.deskripsi || "",
            petugas: rl.assignments[0]?.user.name || null,
            isActive: rl.assignments.length > 0,
          }))}
        />
      </div>
    </AuthLayout>
  );
}
