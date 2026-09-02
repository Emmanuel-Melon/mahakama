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
import {
  isEacCountryCode,
  JURISDICTIONS_BY_COUNTRY,
} from "../onboarding.constants";

const triggerStyling = {
  className: "border-2 border-gray-900",
  style: {
    boxShadow: "2px 2px 0 0 #000",
    borderRadius: "4px 8px 4px 8px",
  } as React.CSSProperties,
};

const labelStyling = "block text-sm font-bold text-gray-700 mb-1";

interface JurisdictionSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  country: string | undefined;
}

export function JurisdictionSelect<TFieldValues extends FieldValues>({
  control,
  name,
  country,
}: JurisdictionSelectProps<TFieldValues>) {
  const options =
    country && isEacCountryCode(country)
      ? JURISDICTIONS_BY_COUNTRY[country]
      : [];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelStyling}>Jurisdiction *</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={options.length === 0}
          >
            <FormControl>
              <SelectTrigger {...triggerStyling}>
                <SelectValue
                  placeholder={
                    country ? "Select a jurisdiction" : "Select a country first"
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
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
