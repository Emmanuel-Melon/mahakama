import { FileSearch, Plus, Home } from 'lucide-react';
import { CardWithLabel } from '~/components/ui/card-with-label';

interface ActionButton {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  icon?: React.ReactNode;
}

interface EmptyStateProps {
  label?: string;
  title?: string;
  description?: string | React.ReactNode;
  className?: string;
  actions?: ActionButton[];
  showDefaultActions?: boolean;
}

export function EmptyState({
  label = 'Empty State',
  title = 'No Results Found',
  description = 'No items match your search criteria. Try adjusting your filters or search term.',
  className = '',
  actions = [],
  showDefaultActions = true,
}: EmptyStateProps) {
  const defaultActions: ActionButton[] = [
    {
      label: 'Go to Home',
      href: '/',
      variant: 'outline',
      icon: <Home className="h-4 w-4 mr-2" />
    },
    {
      label: 'Ask a Question',
      href: '/ask',
      variant: 'default',
      icon: <Plus className="h-4 w-4 mr-2" />
    }
  ];

  const displayActions = showDefaultActions ? [...defaultActions, ...actions] : actions;
  return (
    <CardWithLabel label={label} className={className}>
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <FileSearch className="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            {title}
          </h3>
          <div className="mt-2 text-sm text-gray-600">
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
          
          {displayActions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {displayActions.map((action, index) => {
                const isPrimary = action.variant === 'default' || !action.variant;
                const buttonClass = isPrimary 
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-900';
                
                return (
                  <a 
                    key={index}
                    href={action.href || '#'}
                    className={`relative px-6 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${buttonClass}`}
                    style={{
                      borderRadius: '8px 16px 8px 16px',
                      boxShadow: '3px 3px 0 0 #000',
                    }}
                    onClick={(e) => {
                      if (action.onClick) {
                        e.preventDefault();
                        action.onClick();
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {action.icon}
                      {action.label}
                    </div>
                    {isPrimary && (
                      <>
                        <span className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-gray-900"></span>
                        <span className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-900"></span>
                      </>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CardWithLabel>
  );
}

export default EmptyState;