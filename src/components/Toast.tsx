import { useEffect, useState, useCallback } from "react";
import type { ToastState, ToastType } from "../types";

interface ToastProps {
  message: string;
  type?: ToastType;
  onDone?: () => void;
}

export function Toast({ message, type = "success", onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  const bg = type === "error" ? "#C0392B" : "#1C1B18";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        background: bg,
        color: "#F7F5F0",
        padding: "12px 24px",
        borderRadius: 100,
        fontSize: 14,
        fontWeight: 500,
        zIndex: 999,
        whiteSpace: "nowrap",
        animation: "slideUp 0.25s ease",
      }}
    >
      {message}
    </div>
  );
}

interface UseToastResult {
  toast: ToastState | null;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
}

export function useToast(): UseToastResult {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") =>
      setToast({ message, type }),
    [],
  );

  const clearToast = useCallback(() => setToast(null), []);

  return { toast, showToast, clearToast };
}
