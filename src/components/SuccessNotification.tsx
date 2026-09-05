"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface SuccessNotificationProps {
  message: string;
  onDismiss: () => void;
}

export default function SuccessNotification({ message, onDismiss }: SuccessNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto dismiss after 2 seconds
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for exit animation
    }, 2000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-xl shadow-lg transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onDismiss, 300);
        }}
        className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
