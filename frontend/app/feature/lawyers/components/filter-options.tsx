import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Users, MapPin, CheckCircle } from "lucide-react";

interface FilterOptionsProps {
  currentFilter: string;
  currentSpecialization: string;
  currentLocation: string;
  currentAvailable: string;
  onSpecializationChange: (specialization: string) => void;
  onLocationChange: (location: string) => void;
  onAvailableChange: (available: string) => void;
}

export function FilterOptions({
  currentFilter,
  currentSpecialization,
  currentLocation,
  currentAvailable,
  onSpecializationChange,
  onLocationChange,
  onAvailableChange,
}: FilterOptionsProps) {
  return (
    <div className="flex-1">
      {currentFilter === "specialization" && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              Select specialization:
            </span>
          </div>
          <Select
            value={currentSpecialization}
            onValueChange={onSpecializationChange}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select specialization..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family-law">Family Law</SelectItem>
              <SelectItem value="criminal-law">Criminal Law</SelectItem>
              <SelectItem value="corporate-law">Corporate Law</SelectItem>
              <SelectItem value="immigration-law">Immigration Law</SelectItem>
              <SelectItem value="property-law">Property Law</SelectItem>
              <SelectItem value="employment-law">Employment Law</SelectItem>
              <SelectItem value="civil-rights">Civil Rights</SelectItem>
              <SelectItem value="tax-law">Tax Law</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {currentFilter === "location" && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Enter location:</span>
          </div>
          <Input
            placeholder="Enter city or region..."
            value={currentLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>
      )}

      {currentFilter === "isAvailable" && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Select availability:</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentAvailable === "true" ? "default" : "outline"}
              size="sm"
              onClick={() => onAvailableChange("true")}
            >
              Available Now
            </Button>
            <Button
              variant={currentAvailable === "false" ? "default" : "outline"}
              size="sm"
              onClick={() => onAvailableChange("false")}
            >
              Not Available
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
