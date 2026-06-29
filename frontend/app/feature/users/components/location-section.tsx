import { MapPin } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface LocationSectionProps {
  formData: {
    country: string;
    city: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function LocationSection({
  formData,
  onInputChange,
}: LocationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Location
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => onInputChange("country", e.target.value)}
            placeholder="Your country"
            className="border-2 border-gray-900"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="Your city"
            className="border-2 border-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
