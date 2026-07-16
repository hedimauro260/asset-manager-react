import { useState, useCallback } from "react";
import type { ToastData, ToastType } from "../components/ui/Toast";
import { v4 as uuidv4 } from "uuid";

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      duration: number = 5000,
    ) => {
      const id = uuidv4();
      const newToast: ToastData = {
        id,
        type,
        title,
        message,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Atalhos para tipos específicos
  const success = useCallback(
    (title: string, message?: string) => addToast("success", title, message),
    [addToast],
  );

  const error = useCallback(
    (title: string, message?: string) => addToast("error", title, message),
    [addToast],
  );

  const warning = useCallback(
    (title: string, message?: string) => addToast("warning", title, message),
    [addToast],
  );

  const info = useCallback(
    (title: string, message?: string) => addToast("info", title, message),
    [addToast],
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };
}
