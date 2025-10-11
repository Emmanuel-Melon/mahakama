import { Wifi, RefreshCw, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StylizedList } from './stylized-list';

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
  ...props
}: StateActionItemsProps) {
  const displayItems = defaultItems ? defaultActionItems : (items || []);
  
  return (
    <div className={className}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-sm font-semibold text-gray-800 tracking-wide">
            {title}
          </h4>
        </div>
      )}
      <StylizedList 
        items={displayItems} 
        defaultIcon={RefreshCw}
        {...props}
      />
    </div>
  );
}

export default StateActionItems;
