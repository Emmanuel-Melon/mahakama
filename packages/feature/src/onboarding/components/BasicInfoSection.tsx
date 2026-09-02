import { Input } from "@mah/ui/components/Input";
import { Label } from "@mah/ui/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mah/ui/components/select";

interface BasicInfoSectionProps {
  formData: {
    name: string;
    age: string;
    gender: string;
    country?: string;
    city?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function BasicInfoSection({
  formData,
  onInputChange,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700"
            >
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="border-2 border-gray-900"
            />
          </div>

          <div>
            <Label
              htmlFor="age"
              className="block text-sm font-bold text-gray-700"
            >
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => onInputChange("age", e.target.value)}
              placeholder="Your age"
              className="border-2 border-gray-900"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="gender"
            className="block text-sm font-bold text-gray-700"
          >
            Gender
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => onInputChange("gender", value)}
          >
            <SelectTrigger className="border-2 border-gray-900">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="non_binary">Non-binary</SelectItem>
              <SelectItem value="prefer_not_to_say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="country"
              className="block text-sm font-bold text-gray-700"
            >
              Country
            </Label>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) => onInputChange("country", e.target.value)}
              placeholder="Your country"
              className="border-2 border-gray-900"
            />
          </div>
          <div>
            <Label
              htmlFor="city"
              className="block text-sm font-bold text-gray-700"
            >
              City
            </Label>
            <Input
              id="city"
              value={formData.city || ""}
              onChange={(e) => onInputChange("city", e.target.value)}
              placeholder="Your city"
              className="border-2 border-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
