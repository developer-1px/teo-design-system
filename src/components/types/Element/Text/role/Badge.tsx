import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'info';
    size?: 'sm' | 'md';
}

export function Badge({
    className,
    variant = 'default',
    size = 'md',
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                {
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                    'border-transparent bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
                    'border-transparent bg-blue-500 text-white hover:bg-blue-600': variant === 'info',
                    'text-foreground': variant === 'outline',
                },
                className
            )}
            {...props}
        />
    );
}
