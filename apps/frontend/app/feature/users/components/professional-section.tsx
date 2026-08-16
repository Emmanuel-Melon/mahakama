import { Briefcase } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface ProfessionalSectionProps {
  formData: {
    occupation: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProfessionalSection({
  formData,
  onInputChange,
}: ProfessionalSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <Briefcase className="h-5 w-5" />
        Professional
      </h2>

      <div>
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          id="occupation"
          value={formData.occupation}
          onChange={(e) => onInputChange("occupation", e.target.value)}
          placeholder="Your occupation"
          className="border-2 border-gray-900"
        />
      </div>
    </div>
  );
}
