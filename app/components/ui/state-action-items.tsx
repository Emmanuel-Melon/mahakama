import { cn } from '~/lib/utils';
import { Wifi, RefreshCw, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IconContainer } from '~/components/icon-container';

type ActionItem = {
  text: string;
  icon: LucideIcon;
};

type StateActionItemsProps = {
  title?: string;
  items?: (string | React.ReactNode | ActionItem)[];
  className?: string;
  defaultItems?: boolean;
};

const defaultActionItems: ActionItem[] = [
  {
    text: 'Check your internet connection',
    icon: Wifi,
  },
  {
    text: 'Try refreshing the page',
    icon: RefreshCw,
  },
  {
    text: 'Contact support if the issue persists',
    icon: MessageCircle,
  },
];

export function StateActionItems({
  title = 'Troubleshooting Tips',
  items = defaultActionItems,
  className = '',
  defaultItems = true,
}: StateActionItemsProps) {
  const displayItems = defaultItems ? defaultActionItems : (items || []);
  return (
    <div className={cn('mt-4', className)}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-sm font-semibold text-gray-800 tracking-wide">
            {title}
          </h4>
        </div>
      )}

      {/* Stylized List */}
      <ul className="flex flex-col gap-2.5 text-sm">
        {displayItems.map((item, i) => {
          if (item === null || item === undefined) return null;
          
          let Icon: LucideIcon = RefreshCw;
          let content: React.ReactNode;
          
          if (typeof item === 'string') {
            content = item;
          } else if (item && typeof item === 'object' && 'text' in item && 'icon' in item) {
            Icon = (item as ActionItem).icon;
            content = (item as ActionItem).text;
          } else {
            content = item as React.ReactNode;
          }
          
          return (
            <li
              key={i}
              className="flex items-center gap-3 transition-colors hover:text-gray-900 group"
            >
              <IconContainer 
                icon={Icon}
                size="sm"
                color="outline"
                className="flex-shrink-0"
              />
              <span className="text-gray-600 group-hover:text-gray-900 leading-snug">
                {content}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StateActionItems;
