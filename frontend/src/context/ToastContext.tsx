import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastData = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
};

const messages = {
  eventCreated: {
    title: "Event created",
    description: "Your event has been created successfully.",
    type: "success" as const,
  },
  eventUpdated: {
    title: "Event updated",
    description: "Your changes have been saved.",
    type: "success" as const,
  },
  eventDeleted: {
    title: "Event deleted",
    description: "The event has been removed.",
    type: "success" as const,
  },
  createFailed: {
    title: "Something went wrong",
    description: "Please try again.",
    type: "error" as const,
  },
};

type ToastKey = keyof typeof messages;

type ToastContextType = {
  showToast: (toast: ToastKey | ToastData) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);

  const timeout = useRef<number | undefined>(undefined);

  const showToast = useCallback((toast: ToastKey | ToastData) => {
    window.clearTimeout(timeout.current);

    const toastData: ToastData =
      typeof toast === "string"
        ? {
            duration: 3000,
            ...messages[toast],
          }
        : {
            duration: 3000,
            type: "success",
            ...toast,
          };

    setToast(toastData);
    setVisible(true);

    timeout.current = window.setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        setToast(null);
      }, 300);
    }, toastData.duration);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 transition-all duration-300 ${
            visible
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div
            className={`min-w-[270px] rounded-lg border-l-6 bg-white p-2 shadow-lg ${
              toast.type === "success"
                ? "border-l-green-500"
                : toast.type === "error"
                ? "border-l-red-500"
                : toast.type === "warning"
                ? "border-l-yellow-500"
                : "border-l-blue-500"
            }`}
          >
            <h3 className="font-semibold">{toast.title}</h3>

            {toast.description && (
              <p className="mt-1 text-sm text-gray-500">
                {toast.description}
              </p>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};