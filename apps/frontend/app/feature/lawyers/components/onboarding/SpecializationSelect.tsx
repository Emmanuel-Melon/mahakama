import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mah/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mah/ui/components/Select";
import { LEGAL_SPECIALIZATIONS } from "../../lawyers.constants";

const triggerStyling = {
  className: "border-2 border-gray-900",
  style: {
    boxShadow: "2px 2px 0 0 #000",
    borderRadius: "4px 8px 4px 8px",
  } as React.CSSProperties,
};

const labelStyling = "block text-sm font-bold text-gray-700 mb-1";

interface SpecializationSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}

export function SpecializationSelect<TFieldValues extends FieldValues>({
  control,
  name,
}: SpecializationSelectProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelStyling}>Specialization *</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger {...triggerStyling}>
                <SelectValue placeholder="Select a specialization" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {LEGAL_SPECIALIZATIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
