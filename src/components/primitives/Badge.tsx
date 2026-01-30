import React from 'react';
import { badge } from './Badge.css';
import type { RecipeVariants } from '@vanilla-extract/recipes';

// Infer types from the recipe
type BadgeRecipeVariants = RecipeVariants<typeof badge>;

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & BadgeRecipeVariants & {
    asChild?: boolean;
    children: React.ReactNode;
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ intent, variant, size, interactive, className, children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={`${badge({ intent, variant, size, interactive })} ${className || ''}`}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
