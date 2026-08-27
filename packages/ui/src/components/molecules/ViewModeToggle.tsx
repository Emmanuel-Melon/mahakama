import { List, LayoutGrid } from "lucide-react";
import { Button } from "../Button";
import { ButtonGroup } from "../button-group";

type ViewMode = "list" | "grid";

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  disabled?: boolean;
  className?: string;
}

export function ViewModeToggle({
  currentMode,
  onModeChange,
  disabled = false,
  className = "",
}: ViewModeToggleProps) {
  return (
    <ButtonGroup>
      <Button
        variant={currentMode === "grid" ? "default" : "outline"}
        size="icon"
        className={`border-2 border-gray-900 ${currentMode === "grid" ? "bg-gray-900 text-white" : "bg-white hover:bg-yellow-50"}`}
        style={{
          boxShadow: "2px 2px 0 0 #000",
          borderRadius: "4px 0 0 4px",
        }}
        onClick={() => onModeChange("grid")}
        disabled={disabled}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={currentMode === "list" ? "default" : "outline"}
        size="icon"
        className={`border-2 border-l-0 border-gray-900 ${currentMode === "list" ? "bg-gray-900 text-white" : "bg-white hover:bg-yellow-50"}`}
        style={{
          boxShadow: "2px 2px 0 0 #000",
          borderRadius: "0 4px 4px 0",
        }}
        onClick={() => onModeChange("list")}
        disabled={disabled}
      >
        <List className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}
