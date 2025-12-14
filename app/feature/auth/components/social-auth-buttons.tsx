import { Button } from "~/components/ui/button";
import { Github, Mail, Facebook } from "lucide-react";

export const AuthSocialButtons = () => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-900" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-sm font-bold text-gray-600">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          type="button"
          className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
          style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}
        >
          <Github className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          type="button"
          className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
          style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}
        >
          <Mail className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          type="button"
          className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
          style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}
        >
          <Facebook className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
