import React from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const searchSchema = z.object({
  query: z
    .string()
    .min(0)
    .max(100, "Search query must be less than 100 characters"),
});

export type SearchFormData = z.infer<typeof searchSchema>;

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  className = "",
}: SearchBarProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: value,
    },
  });

  // Watch for changes and call onChange
  const query = watch("query");

  React.useEffect(() => {
    if (query !== value) {
      onChange(query);
    }
  }, [query, onChange]);

  React.useEffect(() => {
    setValue("query", value);
  }, [value, setValue]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
      <form onSubmit={handleSubmit(() => {})}>
        <Input
          {...register("query")}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 pr-4 border-2 border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[2px_2px_0_0_hsl(var(--shadow-color))] ${className}`}
          aria-invalid={!!errors.query}
        />
      </form>
      {errors.query && (
        <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
          {errors.query.message}
        </p>
      )}
    </div>
  );
}
