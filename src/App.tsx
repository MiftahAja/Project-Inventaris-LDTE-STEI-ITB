import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import ThemeScript from "@/components/ThemeScript";

// Pages
import LoginPage from "@/app/login/LoginClient";
import RegisterPage from "@/app/register/RegisterClient";
import HomePage from "@/app/home/page-spa";
import BarangPage from "@/app/barang/page-spa";
import BarangCreatePage from "@/app/barang/create/page-spa";
import BarangEditPage from "@/app/barang/edit/[id]/page-spa";
import RuangLabPage from "@/app/ruang-lab/page-spa";
import RuangLabCreatePage from "@/app/ruang-lab/create/page-spa";
import RuangLabEditPage from "@/app/ruang-lab/edit/[id]/page-spa";
import MejaPage from "@/app/meja/page-spa";
import MejaCreatePage from "@/app/meja/create/page-spa";
import MejaEditPage from "@/app/meja/edit/[id]/page-spa";
import UnitBarangPage from "@/app/unit-barang/page-spa";
import UnitBarangCreatePage from "@/app/unit-barang/create/page-spa";
import UnitBarangEditPage from "@/app/unit-barang/edit/[id]/page-spa";
import PetugasPage from "@/app/petugas/page-spa";
import PetugasCreatePage from "@/app/petugas/create/page-spa";
import PetugasEditPage from "@/app/petugas/edit/[id]/page-spa";
import MutasiStokPage from "@/app/mutasi-stok/page-spa";
import MutasiStokCreatePage from "@/app/mutasi-stok/create/page-spa";
import AssignmentsPage from "@/app/assignments/page-spa";
import AssignmentDetailPage from "@/app/assignments/ruang-lab/[id]/page-spa";
import ActivityLogPage from "@/app/activity-log/page-spa";
import MyLabsPage from "@/app/my-labs/page-spa";
import ExportPage from "@/app/export/page-spa";
import DocumentationPage from "@/app/documentation/page-spa";
import PanduanPage from "@/app/panduan-aplikasi/page-spa";
import CustomerServicePage from "@/app/customer-service/page-spa";

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/barang" element={<ProtectedRoute><BarangPage /></ProtectedRoute>} />
      <Route path="/barang/create" element={<ProtectedRoute adminOnly><BarangCreatePage /></ProtectedRoute>} />
      <Route path="/barang/edit/:id" element={<ProtectedRoute adminOnly><BarangEditPage /></ProtectedRoute>} />
      <Route path="/ruang-lab" element={<ProtectedRoute><RuangLabPage /></ProtectedRoute>} />
      <Route path="/ruang-lab/create" element={<ProtectedRoute adminOnly><RuangLabCreatePage /></ProtectedRoute>} />
      <Route path="/ruang-lab/edit/:id" element={<ProtectedRoute adminOnly><RuangLabEditPage /></ProtectedRoute>} />
      <Route path="/meja" element={<ProtectedRoute><MejaPage /></ProtectedRoute>} />
      <Route path="/meja/create" element={<ProtectedRoute adminOnly><MejaCreatePage /></ProtectedRoute>} />
      <Route path="/meja/edit/:id" element={<ProtectedRoute adminOnly><MejaEditPage /></ProtectedRoute>} />
      <Route path="/unit-barang" element={<ProtectedRoute><UnitBarangPage /></ProtectedRoute>} />
      <Route path="/unit-barang/create" element={<ProtectedRoute><UnitBarangCreatePage /></ProtectedRoute>} />
      <Route path="/unit-barang/edit/:id" element={<ProtectedRoute><UnitBarangEditPage /></ProtectedRoute>} />
      <Route path="/petugas" element={<ProtectedRoute adminOnly><PetugasPage /></ProtectedRoute>} />
      <Route path="/petugas/create" element={<ProtectedRoute adminOnly><PetugasCreatePage /></ProtectedRoute>} />
      <Route path="/petugas/edit/:id" element={<ProtectedRoute adminOnly><PetugasEditPage /></ProtectedRoute>} />
      <Route path="/mutasi-stok" element={<ProtectedRoute adminOnly><MutasiStokPage /></ProtectedRoute>} />
      <Route path="/mutasi-stok/create" element={<ProtectedRoute adminOnly><MutasiStokCreatePage /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute adminOnly><AssignmentsPage /></ProtectedRoute>} />
      <Route path="/assignments/ruang-lab/:id" element={<ProtectedRoute adminOnly><AssignmentDetailPage /></ProtectedRoute>} />
      <Route path="/activity-log" element={<ProtectedRoute adminOnly><ActivityLogPage /></ProtectedRoute>} />
      <Route path="/my-labs" element={<ProtectedRoute><MyLabsPage /></ProtectedRoute>} />
      <Route path="/export" element={<ProtectedRoute><ExportPage /></ProtectedRoute>} />
      <Route path="/documentation" element={<ProtectedRoute><DocumentationPage /></ProtectedRoute>} />
      <Route path="/panduan-aplikasi" element={<ProtectedRoute><PanduanPage /></ProtectedRoute>} />
      <Route path="/customer-service" element={<ProtectedRoute><CustomerServicePage /></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <ThemeScript />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  );
}
