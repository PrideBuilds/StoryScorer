import { toast as shadcnToast } from "@/hooks/use-toast";

interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show a success toast notification
 */
export function showSuccess(
  message: string,
  title: string = "Success",
  options?: ToastOptions
) {
  shadcnToast({
    title,
    description: message,
    variant: "default",
    duration: options?.duration,
  });
}

/**
 * Show an error toast notification
 */
export function showError(
  message: string,
  title: string = "Error",
  options?: ToastOptions
) {
  shadcnToast({
    title,
    description: message,
    variant: "destructive",
    duration: options?.duration,
  });
}

/**
 * Show an info toast notification
 */
export function showInfo(
  message: string,
  title: string = "Info",
  options?: ToastOptions
) {
  shadcnToast({
    title,
    description: message,
    variant: "default",
    duration: options?.duration,
  });
}

/**
 * Show a warning toast notification
 */
export function showWarning(
  message: string,
  title: string = "Warning",
  options?: ToastOptions
) {
  shadcnToast({
    title,
    description: message,
    variant: "default",
    duration: options?.duration,
  });
}
