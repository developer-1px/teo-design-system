import type { StyleRule } from '@vanilla-extract/css';
import { vars } from '@surface/tokens';

/**
 * Composable text style mixin
 * @example textStyle({ size: 'sm', weight: 'medium' })
 */
export const textStyle = ({
    size = 'md',
    weight = 'regular',
    variant = 'body',
    spacing = 'normal',
    height = 'standard'
}: {
    size?: keyof typeof vars.fontSize,
    weight?: keyof typeof vars.weight,
    variant?: keyof typeof vars.font,
    spacing?: keyof typeof vars.letterSpacing,
    height?: keyof typeof vars.lineHeight
} = {}): StyleRule => ({
    fontFamily: vars.font[variant],
    fontSize: vars.fontSize[size],
    fontWeight: vars.weight[weight],
    lineHeight: vars.lineHeight[height],
    letterSpacing: vars.letterSpacing[spacing],
});

/**
 * System UI Typography Presets
 * Opinionated combinations for common UI patterns
 */
export const ui = {
    /** Labels for inputs, section headers (Medium weight, tight spacing) */
    label: (size: 'xs' | 'sm' | 'md' = 'sm'): StyleRule => textStyle({
        size,
        weight: 'medium',
        height: 'tight',
        spacing: 'normal'
    }),
    /** Descriptions, help text (Regular weight, standard height) */
    caption: (): StyleRule => textStyle({
        size: 'xs',
        weight: 'regular',
        height: 'standard',
        spacing: 'normal'
    }),
    /** Compact menu items or list items */
    menu: (): StyleRule => textStyle({
        size: 'sm',
        weight: 'medium',
        height: 'snug',
        spacing: 'normal'
    }),
    /** Heavy headings for panels — "Overline" logic */
    overline: (): StyleRule => textStyle({
        size: 'xs',
        weight: 'bold',
        height: 'tight',
        spacing: 'wide'
    }),
    /** Code snippets */
    code: (size: 'xs' | 'sm' | 'md' = 'sm'): StyleRule => textStyle({
        size,
        weight: 'regular',
        variant: 'code',
        height: 'snug',
        spacing: 'normal'
    })
};
