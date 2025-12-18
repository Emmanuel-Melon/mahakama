import { User } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface BasicInfoSectionProps {
  formData: {
    name: string;
    age: string;
    gender: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function BasicInfoSection({ formData, onInputChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <User className="h-5 w-5" />
        Basic Information
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="border-2 border-gray-900"
          />
        </div>
        
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => onInputChange('age', e.target.value)}
            placeholder="Your age"
            className="border-2 border-gray-900"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select value={formData.gender} onValueChange={(value) => onInputChange('gender', value)}>
          <SelectTrigger className="border-2 border-gray-900">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="non_binary">Non-binary</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
