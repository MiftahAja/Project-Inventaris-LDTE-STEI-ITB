"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Eye } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  addHref?: string;
  addLabel?: string;
  searchPlaceholder?: string;
  searchKey?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  showActions?: boolean;
  
  // Pagination props
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  addHref,
  addLabel = "Tambah",
  searchPlaceholder = "Cari...",
  searchKey,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage = 10,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const isServerSide = totalItems !== undefined && currentPage !== undefined && onPageChange !== undefined;
  const enablePaginationControls = isServerSide && itemsPerPage > 0;

  console.log("[DT] isServerSide, totalItems, currentPage, itemsPerPage, enablePaginationControls",
    { isServerSide, totalItems, currentPage, itemsPerPage, enablePaginationControls });

  const filtered = searchKey && !isServerSide
    ? data.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const totalPages = isServerSide ? Math.ceil((totalItems || 0) / itemsPerPage) : Math.ceil(filtered.length / itemsPerPage);
  const totalShown = isServerSide ? totalItems : filtered.length;
  const page = isServerSide ? currentPage : 1;
  const start = (page - 1) * itemsPerPage;
  const paginated = isServerSide ? data : filtered.slice(start, start + itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isServerSide && (
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              />
            </div>
          )}
          {addHref && (
            <Link
              to={addHref}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium rounded-lg transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              {addLabel}
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  No
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                  >
                    {col.label}
                  </th>
                ))}
                {showActions && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (showActions ? 2 : 1)}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                paginated.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 row-hover"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {start + index + 1}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-sm text-gray-900 dark:text-white"
                      >
                        {col.render ? col.render(item) : String(item[col.key] ?? "")}
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg btn-press"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg btn-press"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePaginationControls && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {start + 1} -              {Math.min(start + itemsPerPage, totalShown)} dari{" "}
              {totalShown} data
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 btn-press"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 btn-press"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  itemsPerPage = size;
                  onPageSizeChange?.(size);
                }}
                className="ml-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-1 px-2 focus:ring-2 focus:ring-blue-500"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
