import { useState } from "react";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { IconContainer } from "~/components/atoms/icon-container";
import { Briefcase, UserCircle } from "lucide-react";

export type UserRole = "user" | "lawyer";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  selectedRole?: UserRole;
}

export function RoleSelector({
  onRoleSelect,
  selectedRole,
}: RoleSelectorProps) {
  const [role, setRole] = useState<UserRole | undefined>(selectedRole);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onRoleSelect(selectedRole);
  };

  const roles = [
    {
      id: "user" as UserRole,
      title: "I'm a Citizen",
      description: "Looking for legal help",
      icon: UserCircle,
    },
    {
      id: "lawyer" as UserRole,
      title: "I'm a Legal Professional",
      description: "Here to offer services",
      icon: Briefcase,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 mb-8 max-w-2xl mx-auto">
        {roles.map((roleConfig) => (
          <div
            key={roleConfig.id}
            onClick={() => handleRoleSelect(roleConfig.id)}
            className={`relative transition-all duration-300 cursor-pointer ${
              role === roleConfig.id ? "scale-105" : ""
            } ${isAnimating && role === roleConfig.id ? "animate-pulse" : ""}`}
          >
            <CardWithLabel
              label={`${roleConfig.id}-role`}
              className={`bg-white rounded-xl border-2 border-solid transition-all duration-300 ${
                role === roleConfig.id
                  ? "border-yellow-400 shadow-[6px_6px_0_0_#FDE047]"
                  : "border-gray-900 hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex justify-center md:justify-start">
                  <IconContainer
                    icon={roleConfig.icon}
                    size="lg"
                    color="outline"
                    className="flex-shrink-0"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {roleConfig.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {roleConfig.description}
                  </p>
                </div>
              </div>
            </CardWithLabel>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Select your role to get started
      </p>
    </div>
  );
}
