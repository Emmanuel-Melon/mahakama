import {
  User,
  FileText,
  MoreVertical,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

export interface SavedItem {
  type: "lawyer" | "document";
  title: string;
  description: string;
  savedDate: string;
  href?: string;
  icon?: LucideIcon;
  onShare?: () => void;
  onDelete?: () => void;
}

interface SavedItemsProps {
  title?: string;
  description?: string;
  savedItems: SavedItem[];
  className?: string;
}

const iconMap = {
  lawyer: User,
  document: FileText,
};

const iconColorMap = {
  lawyer: "text-blue-600",
  document: "text-green-600",
};

export function SavedItems({
  title = "Saved Items",
  description,
  savedItems,
  className = "",
}: SavedItemsProps) {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const getIcon = (type: SavedItem["type"], customIcon?: LucideIcon) => {
    if (customIcon) return customIcon;
    return iconMap[type];
  };

  const getIconColor = (type: SavedItem["type"]) => {
    return iconColorMap[type];
  };

  const renderContent = (item: SavedItem) => {
    if (item.href) {
      return (
        <a
          href={item.href}
          className="text-blue-600 hover:text-blue-800 underline font-semibold"
        >
          {item.title}
        </a>
      );
    }
    return <p className="text-base font-semibold">{item.title}</p>;
  };

  const handleShare = (item: SavedItem, index: number) => {
    if (item.onShare) {
      item.onShare();
    }
    setShowDropdown(null);
  };

  const handleDelete = (item: SavedItem, index: number) => {
    if (item.onDelete) {
      item.onDelete();
    }
    setShowDropdown(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <div className="space-y-4">
        {savedItems.map((item, index) => {
          const Icon = getIcon(item.type, item.icon);
          const iconColor = getIconColor(item.type);

          return (
            <div key={index} className="relative">
              <div
                className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                }}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    {item.description}
                  </p>
                  {renderContent(item)}
                  <p className="text-xs text-gray-400 mt-1">
                    Saved {item.savedDate}
                  </p>
                </div>

                {/* More Vertical Button */}
                <button
                  onClick={() =>
                    setShowDropdown(showDropdown === index ? null : index)
                  }
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {showDropdown === index && (
                <div
                  className="absolute right-2 top-12 bg-white border-2 border-gray-900 rounded-lg shadow-lg z-10"
                  style={{
                    boxShadow: "2px 2px 0 0 #000",
                  }}
                >
                  <button
                    onClick={() => handleShare(item, index)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Share className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={() => handleDelete(item, index)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
