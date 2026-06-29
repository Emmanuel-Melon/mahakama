import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SortOption[];
  disabled?: boolean;
  className?: string;
}

export function SortSelect({
  value,
  onValueChange,
  options,
  disabled = false,
}: SortSelectProps) {
  return (
    <div
      className="w-[180px] border-2 border-gray-900 bg-white hover:bg-yellow-50"
      style={{
        borderRadius: "4px 8px 4px 8px",
      }}
    >
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full border-none bg-transparent shadow-none">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="border-2 border-gray-900 bg-white">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
