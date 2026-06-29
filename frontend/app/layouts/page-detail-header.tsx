import { Button } from "~/components/ui/button";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { IconContainer } from "~/components/icon-container";
import { Badge } from "~/components/ui/badge";
import { MahButton, type MahAction } from "~/components/mah-button";
import type { LucideIcon } from "lucide-react";

interface ActionButton {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  download?: boolean;
  variant?: "primary" | "secondary";
}

interface MetadataItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface PageDetailHeaderProps {
  type: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
  alt?: string;
  metadata: MetadataItem[];
  actions?: ActionButton[];
  className?: string;
}

export function PageDetailHeader({
  type,
  title,
  description,
  icon,
  image,
  alt = "",
  metadata,
  actions = [],
  className = "",
}: PageDetailHeaderProps) {
  return (
    <CardWithLabel
      label={type}
      labelClassName="bg-yellow-100 text-yellow-800 font-bold border-2 border-gray-900"
      className={`w-full mx-0 max-w-none space-y-4 ${className} border-solid`}
    >
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={alt}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-900"
              style={{
                boxShadow: "2px 2px 0 0 #000",
              }}
            />
          ) : icon ? (
            <IconContainer icon={icon} size="lg" color="handdrawn" />
          ) : null}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-gray-900">{title}</h1>
        </div>
      </div>
      <p className="text-gray-600 text-lg">{description}</p>

      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-6">
        {metadata.map((item, index) => (
          <Badge
            key={index}
            variant="outline"
            className="flex items-center gap-1 border-2 border-gray-900 bg-white"
            style={{
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <item.icon className="h-3 w-3" />
            {item.label}: {item.value}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {actions.map((action, index) => {
          if (action.href) {
            return (
              <a
                key={index}
                href={action.href}
                download={action.download}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-2 border-black rounded-lg text-gray-900 ${
                  action.variant === "primary"
                    ? "bg-yellow-300 shadow-[2px_2px_0_0_#000] translate-x-0 translate-y-0"
                    : "bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900"
                }`}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </a>
            );
          }

          return (
            <MahButton
              key={index}
              onClick={action.onClick}
              variant={action.variant === "primary" ? "primary" : "secondary"}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </MahButton>
          );
        })}
      </div>
    </CardWithLabel>
  );
}
