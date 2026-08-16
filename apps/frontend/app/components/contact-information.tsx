import {
  Mail,
  Calendar,
  MapPin,
  Phone,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { formatDate } from "~/utils/time";

export interface ContactItem {
  type: "email" | "phone" | "location" | "date" | "website";
  label: string;
  value: string;
  href?: string;
  icon?: LucideIcon;
}

interface ContactInformationProps {
  title?: string;
  description?: string;
  contactItems: ContactItem[];
  className?: string;
}

const iconMap = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  date: Calendar,
  website: Globe,
};

const iconColorMap = {
  email: "text-blue-600",
  phone: "text-green-600",
  location: "text-red-600",
  date: "text-purple-600",
  website: "text-blue-600",
};

export function ContactInformation({
  title = "Contact Information",
  description,
  contactItems,
  className = "",
}: ContactInformationProps) {
  const getIcon = (type: ContactItem["type"], customIcon?: LucideIcon) => {
    if (customIcon) return customIcon;
    return iconMap[type];
  };

  const getIconColor = (type: ContactItem["type"]) => {
    return iconColorMap[type];
  };

  const renderContent = (item: ContactItem) => {
    if (item.href) {
      return (
        <a
          href={item.href}
          target={item.type === "website" ? "_blank" : undefined}
          rel={item.type === "website" ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:text-blue-800 underline font-semibold"
        >
          {item.value}
        </a>
      );
    }
    return <p className="text-base font-semibold">{item.value}</p>;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <div className="space-y-4">
        {contactItems.map((item, index) => {
          const Icon = getIcon(item.type, item.icon);
          const iconColor = getIconColor(item.type);

          return (
            <div
              key={index}
              className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900"
              style={{
                boxShadow: "2px 2px 0 0 #000",
              }}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
                {renderContent(item)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
