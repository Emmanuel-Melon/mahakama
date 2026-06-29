import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  disabled?: boolean;
  className?: string;
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  disabled = false,
}: FilterSelectProps) {
  return (
    <div 
      className="w-[180px] border-2 border-gray-900 bg-white hover:bg-yellow-50"
      style={{
        borderRadius: "4px 8px 4px 8px",
      }}
    >
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent className="border-2 border-gray-900 bg-white">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
