import * as React from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

export interface FormFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  name: string;
  icon?: LucideIcon;
  error?: FieldError | string;
  registration?: UseFormRegisterReturn;
  labelAction?: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      icon: Icon,
      error,
      registration,
      labelAction,
      className,
      type = "text",
      id,
      ...props
    },
    ref,
  ) => {
    const fieldId = id || name || label.toLowerCase().replace(/\s+/g, "-");
    const errorMessage = typeof error === "string" ? error : error?.message;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor={fieldId} className="text-sm font-bold text-gray-700">
            {label}
          </Label>
          {labelAction}
        </div>

        <div className="relative group">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/50 group-focus-within:text-primary transition-colors">
              <Icon className="h-5 w-5" />
            </div>
          )}

          <Input
            {...props}
            {...registration}
            id={fieldId}
            ref={ref}
            type={type}
            className={cn(
              "w-full font-medium transition-colors",
              Icon ? "pl-10" : "pl-3",
              errorMessage &&
                "border-destructive focus-visible:ring-destructive",
              className,
            )}
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-destructive font-medium animate-in fade-in duration-200">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
