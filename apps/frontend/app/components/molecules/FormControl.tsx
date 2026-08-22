import * as React from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FormControlProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  name: string;
  icon?: LucideIcon;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  labelAction?: React.ReactNode;
}

export function FormControl({
  label,
  name,
  icon: Icon,
  error,
  registration,
  labelAction,
  className,
  type = "text",
  disabled,
  placeholder,
  autoComplete,
  ...props
}: FormControlProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={name} className="block text-sm font-bold text-gray-700">
          {label}
        </Label>
        {labelAction}
      </div>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <Input
          id={name}
          type={type}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full border-2 border-gray-900 font-medium",
            Icon ? "pl-12" : "pl-4",
            className,
          )}
          style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}
          {...registration}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">{error.message}</p>
      )}
    </div>
  );
}
