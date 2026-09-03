"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requiredText: string;
  title?: string;
  description?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  requiredText,
  title = "Konfirmasi Hapus",
  description,
}: ConfirmDeleteModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  const isMatch = inputValue === requiredText;

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isMatch) {
      setError(true);
      return;
    }
    onConfirm();
    onClose();
  };

  const defaultDescription = `Ketik "${requiredText}" untuk menghapus item ini.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in-overlay">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          {description || defaultDescription}
        </p>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ketik{" "}
            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400">
              {requiredText}
            </span>
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isMatch) {
                handleConfirm();
              }
            }}
            placeholder={`Ketik "${requiredText}"`}
            autoFocus
            className={`w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 dark:text-white transition-all ${
              error
                ? "border-red-500 focus:ring-red-500"
                : isMatch
                ? "border-green-500 focus:ring-green-500"
                : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
            }`}
          />
          {error && (
            <p className="mt-1 text-xs text-red-500">
              Teks tidak cocok. Silakan coba lagi.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isMatch}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              isMatch
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 dark:bg-red-800 cursor-not-allowed"
            }`}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
