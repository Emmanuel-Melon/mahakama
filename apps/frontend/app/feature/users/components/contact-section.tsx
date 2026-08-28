import { Phone } from "lucide-react";
import { Input } from "@mah/ui/components/Input";
import { Label } from "@mah/ui/components/Label";

interface ContactSectionProps {
  formData: {
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ContactSection({
  formData,
  onInputChange,
}: ContactSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <Phone className="h-5 w-5" />
        Contact
      </h2>

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => onInputChange("phoneNumber", e.target.value)}
          placeholder="+256 123 456 789"
          className="border-2 border-gray-900"
        />
      </div>
    </div>
  );
}
