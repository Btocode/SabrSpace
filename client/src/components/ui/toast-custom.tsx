import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-md px-2 sm:px-0 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300); // Wait for animation
  };

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-emerald-500/20";
      case "error":
        return "border-red-500/20";
      case "warning":
        return "border-amber-500/20";
      case "info":
        return "border-blue-500/20";
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-emerald-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-amber-50";
      case "info":
        return "bg-blue-50";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 40,
            mass: 1,
          }}
          className={cn(
            "relative flex items-start gap-2 p-3 sm:p-4 rounded-xl border shadow-lg w-full max-w-xs sm:max-w-md pointer-events-auto bg-white/90 backdrop-blur-md",
            getBorderColor(),
            getBgColor()
          )}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-sm font-semibold text-foreground break-words">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-sm sm:text-xs text-muted-foreground mt-1 leading-relaxed break-words">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-2 sm:p-1 rounded-md hover:bg-black/5 transition-colors ml-1"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4 text-muted-foreground hover:text-foreground" />
          </button>
          {/* Progress bar for auto-dismiss */}
          {toast.duration && toast.duration > 0 && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: toast.duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 sm:h-0.5 bg-current opacity-20 rounded-b-xl"
              style={{
                background: toast.type === "success"
                  ? "rgb(16 185 129)"
                  : toast.type === "error"
                  ? "rgb(239 68 68)"
                  : toast.type === "warning"
                  ? "rgb(245 158 11)"
                  : "rgb(59 130 246)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick toast functions
export function toast(type: ToastType, title: string, description?: string, duration?: number) {
  const { addToast } = useToast();
  addToast({ type, title, description, duration });
}

// Convenience functions
export const successToast = (title: string, description?: string) =>
  toast("success", title, description);

export const errorToast = (title: string, description?: string) =>
  toast("error", title, description);

export const warningToast = (title: string, description?: string) =>
  toast("warning", title, description);

export const infoToast = (title: string, description?: string) =>
  toast("info", title, description);
