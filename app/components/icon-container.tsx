import type { LucideIcon } from "lucide-react";
import { cn } from '~/lib/utils';

type SizeVariant = 'sm' | 'md' | 'lg';
type ColorVariant = 'yellow' | 'blue' | 'green' | 'red' | 'gray' | 'outline';

interface IconContainerProps {
    icon: LucideIcon;
    className?: string;
    iconSize?: number;
    size?: SizeVariant;
    color?: ColorVariant;
}

const sizeVariants = {
    sm: {
        container: 'w-6 h-6',
        icon: 12,
        border: 'border',
        shadow: 'shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)]'
    },
    md: {
        container: 'w-8 h-8',
        icon: 16,
        border: 'border-2',
        shadow: 'shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
    },
    lg: {
        container: 'w-12 h-12',
        icon: 24,
        border: 'border-2',
        shadow: 'shadow-[3px_3px_0_0_rgba(0,0,0,1)]'
    }
} as const;

const colorVariants = {
    yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-900',
    },
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-900',
    },
    green: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-900',
    },
    red: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-900',
    },
    gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-900',
    },
    outline: {
        bg: 'bg-transparent',
        text: 'text-gray-900',
        border: 'border-gray-900',
    },
} as const;

export const IconContainer = ({ 
    icon: Icon, 
    className = '',
    iconSize,
    size = 'md',
    color = 'yellow',
}: IconContainerProps) => {
    const variant = sizeVariants[size];
    
    return (
        <div className={cn('flex-shrink-0', className)}>
            <div 
                className={cn(
                    'rounded-full flex items-center justify-center',
                    colorVariants[color].bg,
                    colorVariants[color].border,
                    variant.container,
                    variant.border,
                    variant.shadow
                )}
            >
                <Icon 
                    size={iconSize || variant.icon} 
                    className={colorVariants[color].text}
                />
            </div>
        </div>
    );
};