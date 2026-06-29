import { AlertCircle, WifiOff, Lock, ShieldOff, Search, ServerCrash } from "lucide-react";
import type { ErrorConfig } from "./errors.types";

export const ERROR_MAP: Record<number, ErrorConfig> = {
  401: {
    icon: Lock,
    title: "Session Expired",
    description: "Your session has expired. Please log in again to continue.",
    color: "yellow",
  },
  403: {
    icon: ShieldOff,
    title: "Access Denied",
    description: "You don't have permission to view this page.",
    color: "orange",
  },
  404: {
    icon: Search,
    title: "Not Found",
    description: "The requested resource could not be found.",
    color: "gray",
  },
  503: {
    icon: WifiOff,
    title: "You're Offline",
    description: "Check your internet connection and try again.",
    color: "gray",
  },
  500: {
    icon: ServerCrash,
    title: "Something Went Wrong",
    description: "An unexpected error occurred on our end.",
    color: "red",
  },
};

export const DEFAULT_ERROR = {
  icon: AlertCircle,
  title: "Unexpected Error",
  description: "An unexpected error occurred.",
  iconColor: "text-red-600",
  actionType: "reload"
};