import { cn } from '~/lib/utils';
import { IconContainer } from '~/components/icon-container';
import type { LucideIcon } from 'lucide-react';

export type ListItem = {
  text: string;
  icon?: LucideIcon;
  [key: string]: any;
} | string | React.ReactNode;

interface StylizedListProps<T = ListItem> {
  items: T[];
  className?: string;
  itemClassName?: string;
  defaultIcon?: LucideIcon;
  renderItem?: (item: T) => React.ReactNode;
}

export function StylizedList<T extends ListItem = ListItem>({
  items = [],
  className = '',
  itemClassName = '',
  defaultIcon: DefaultIcon,
  renderItem,
}: StylizedListProps<T>) {
  return (
    <ul className={cn('flex flex-col gap-2.5 text-sm', className)}>
      {items.map((item, i) => {
        if (item === null || item === undefined) return null;
        
        let Icon = DefaultIcon;
        let content: React.ReactNode;
        
        if (typeof item === 'string') {
          content = item;
        } else if (item && typeof item === 'object' && 'text' in item) {
          Icon = item.icon || DefaultIcon;
        } else {
          return <li key={i} className={itemClassName}>{item as React.ReactNode}</li>;
        }

        return (
          <li
            key={i}
            className={cn(
              'flex items-center gap-3 transition-colors hover:text-gray-900 group',
              itemClassName
            )}
          >
            {renderItem ? renderItem(item) : (
              <>
                {Icon && (
                  <IconContainer 
                    icon={Icon}
                    size="sm"
                    color="outline"
                    className="flex-shrink-0"
                  />
                )}
                <span className="text-gray-600 group-hover:text-gray-900 leading-snug">
                  {typeof item === 'string' ? item : item.text}
                </span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
