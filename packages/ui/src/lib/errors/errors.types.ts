import { type ErrorResponse } from "react-router";
import type { LucideIcon } from "lucide-react";

export type AppError = ErrorResponse | Error | unknown;

export interface RootErrorBoundaryProps {
  error: AppError;
}

export interface ErrorConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "red" | "yellow" | "orange" | "gray";
}

export interface AppRouteError {
  status?: number;
  data?: string;
}

export interface ErrorComponentProps extends Partial<ErrorConfig> {
  data?: string;
}
