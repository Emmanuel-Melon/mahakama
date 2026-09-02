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
} from "@mah/ui/components/select";
import { EAC_COUNTRIES } from "../onboarding.constants";

const triggerStyling = {
  className: "border-2 border-gray-900",
  style: {
    boxShadow: "2px 2px 0 0 #000",
    borderRadius: "4px 8px 4px 8px",
  } as React.CSSProperties,
};

const labelStyling = "block text-sm font-bold text-gray-700 mb-1";

interface EacCountrySelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
}

export function EacCountrySelect<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Country",
}: EacCountrySelectProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelStyling}>{label} *</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger {...triggerStyling}>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {EAC_COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
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
