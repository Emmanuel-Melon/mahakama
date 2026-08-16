import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface LawyerInfoSectionProps {
  formData: {
    specialization: string;
    experienceYears: string;
    rating: string;
    casesHandled: string;
    location: string;
    languages: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function LawyerInfoSection({
  formData,
  onInputChange,
}: LawyerInfoSectionProps) {
  const specializations = [
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Real Estate Law",
    "Immigration Law",
    "Intellectual Property",
    "Tax Law",
    "Environmental Law",
    "Civil Rights",
    "Bankruptcy Law",
  ];

  const ratings = ["1", "2", "3", "4", "5"];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Professional Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization *</Label>
          <Select
            value={formData.specialization}
            onValueChange={(value) => onInputChange("specialization", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceYears">Years of Experience *</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            max="50"
            value={formData.experienceYears}
            onChange={(e) => onInputChange("experienceYears", e.target.value)}
            placeholder="e.g., 5"
            className="border-2 border-gray-300 focus:border-yellow-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Professional Rating *</Label>
          <Select
            value={formData.rating}
            onValueChange={(value) => onInputChange("rating", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your rating" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating} {rating === "1" ? "Star" : "Stars"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="casesHandled">Cases Handled *</Label>
          <Input
            id="casesHandled"
            type="number"
            min="0"
            value={formData.casesHandled}
            onChange={(e) => onInputChange("casesHandled", e.target.value)}
            placeholder="e.g., 150"
            className="border-2 border-gray-300 focus:border-yellow-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange("location", e.target.value)}
          placeholder="e.g., Nairobi, Kenya"
          className="border-2 border-gray-300 focus:border-yellow-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages">Languages (comma-separated) *</Label>
        <Textarea
          id="languages"
          value={formData.languages}
          onChange={(e) => onInputChange("languages", e.target.value)}
          placeholder="e.g., English, Swahili, French"
          rows={3}
          className="border-2 border-gray-300 focus:border-yellow-400 resize-none"
        />
        <p className="text-sm text-gray-600">
          List all languages you're proficient in, separated by commas
        </p>
      </div>
    </div>
  );
}
