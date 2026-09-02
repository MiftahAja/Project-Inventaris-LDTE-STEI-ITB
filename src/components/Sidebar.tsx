"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  DoorOpen,
  TableProperties,
  Users,
  ArrowLeftRight,
  ClipboardList,
  BookOpen,
  FileText,
  Headphones,
  LogOut,
  Moon,
  Sun,
  Search,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface SidebarProps {
  user: User;
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "- Tabel Barang",
    items: [
      { name: "Dashboard", href: "/home", icon: LayoutDashboard },
      { name: "Barang", href: "/barang", icon: Package },
      { name: "Unit Barang", href: "/unit-barang", icon: Boxes },
      { name: "Ruang Lab", href: "/ruang-lab", icon: DoorOpen },
      { name: "Meja", href: "/meja", icon: TableProperties },
    ],
  },
  {
    title: "Petugas",
    items: [{ name: "Lab Saya", href: "/my-labs", icon: ClipboardList }],
    roles: ["petugas"],
  },
  {
    title: "- Admin Only",
    items: [
      { name: "Table Petugas", href: "/petugas", icon: Users },
      { name: "Mutasi Barang", href: "/mutasi-stok", icon: ArrowLeftRight },
      { name: "Activity Log", href: "/activity-log", icon: FileText },
      { name: "Manajemen Penugasan", href: "/assignments", icon: ClipboardList },
    ],
    roles: ["admin"],
  },
  {
    title: "Bantuan",
    items: [
      { name: "Documentation", href: "/documentation", icon: BookOpen },
      { name: "Panduan Aplikasi", href: "/panduan-aplikasi", icon: FileText },
      { name: "Customer Service", href: "/customer-service", icon: Headphones },
    ],
  },
];

export default function Sidebar({ user, children }: SidebarProps) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Sync with the class already set by the inline script to prevent FOUC
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", String(newMode));
  };

  const filteredMenu = menuItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
          <Package className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Inventaris LDTE
          </span>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Menu Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {filteredMenu.map((group) => {
          // Check role access
          if (group.roles && !group.roles.includes(user.role)) {
            return null;
          }

          return (
            <div key={group.title} className="mb-4">
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {group.title}
              </h3>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 btn-press"
        >
          <span className="relative w-5 h-5">
            <Sun className={cn("w-5 h-5 absolute transition-all duration-300", darkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90")} />
            <Moon className={cn("w-5 h-5 absolute transition-all duration-300", darkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0")} />
          </span>
          {!collapsed && <span>{darkMode ? "Mode Terang" : "Mode Gelap"}</span>}
        </button>

        {/* User Block */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.role === "admin" ? "Administrator" : "Petugas"}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in-overlay">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 z-50 animate-slide-in-left">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Navbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 lg:hidden">                <button
                  onClick={() => setMobileOpen(true)}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 btn-press"
                >
                  <Menu className="w-5 h-5" />
                </button>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900 dark:text-white">LDTE</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 btn-press"
          >
            <span className="relative w-5 h-5">
              <Sun className={cn("w-5 h-5 absolute transition-all duration-300", darkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90")} />
              <Moon className={cn("w-5 h-5 absolute transition-all duration-300", darkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0")} />
            </span>
          </button>
        </header>

        {/* Desktop Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-6 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          style={{ left: collapsed ? "4rem" : "16rem" }}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 text-gray-500 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
