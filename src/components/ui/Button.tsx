import React, { type ComponentPropsWithoutRef, type ElementType, forwardRef } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { Loader2 } from 'lucide-react';
import { button, spinner } from './Button.css';

// Inference from recipe
type ButtonRecipeVariants = RecipeVariants<typeof button>;

export type ButtonProps<T extends ElementType = 'button'> = {
    as?: T;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
} & ButtonRecipeVariants & ComponentPropsWithoutRef<T>;

export const Button = forwardRef(<T extends ElementType = 'button'>(
    {
        as,
        className,
        intent,
        size,
        variant,
        shape,
        loading = false,
        disabled,
        children,
        leftIcon,
        rightIcon,
        ...props
    }: ButtonProps<T>,
    ref: React.Ref<any>
) => {
    const Component = as || 'button';
    const isDisabled = disabled || loading;

    return (
        <Component
            ref={ref}
            className={`${button({ intent, size, variant, shape })} ${className || ''}`}
            // Only pass `disabled` attribute if it is a button or input, otherwise use aria/data attributes
            disabled={(Component === 'button' || Component === 'input') ? isDisabled : undefined}
            aria-disabled={isDisabled}
            data-disabled={isDisabled}
            {...props}
        >
            {loading && <Loader2 className={spinner} size={16} />}
            {!loading && leftIcon && <span className="button-icon-left">{leftIcon}</span>}
            {children}
            {!loading && rightIcon && <span className="button-icon-right">{rightIcon}</span>}
        </Component>
    );
});

Button.displayName = 'Button';
