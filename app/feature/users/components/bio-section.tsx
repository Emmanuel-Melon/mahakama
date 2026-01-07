import { FileText } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

interface BioSectionProps {
  formData: {
    bio: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function BioSection({ formData, onInputChange }: BioSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        About You
      </h2>
      
      <div>
        <Label htmlFor="bio" className="block text-sm font-bold text-gray-700">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => onInputChange('bio', e.target.value)}
          placeholder="Tell us a bit about yourself..."
          rows={4}
          className="border-2 border-gray-900 resize-none"
        />
      </div>
    </div>
  );
}
