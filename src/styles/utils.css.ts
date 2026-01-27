import type { StyleRule } from '@vanilla-extract/css';
import { vars } from './vars.css';

/**
 * Mixin for CSS subgrid
 * @param axis - The axis to apply subgrid to ('x', 'y', or 'both')
 * @param width - The grid-column property (default: '1 / -1' to span full width)
 */
export const subgrid = (axis: 'x' | 'y' | 'both' = 'both', width: string = '1 / -1'): StyleRule => ({
    display: 'grid',
    gridColumn: width,
    ...(axis === 'x' || axis === 'both' ? { gridTemplateColumns: 'subgrid' } : {}),
    ...(axis === 'y' || axis === 'both' ? { gridTemplateRows: 'subgrid' } : {})
});

type SurfaceType = keyof typeof vars.surface;

export const surface = (type: SurfaceType): StyleRule => ({
    backgroundColor: vars.surface[type].bg,
    color: vars.surface[type].text,
    border: vars.surface[type].border,
    boxShadow: vars.surface[type].shadow,
    transition: 'background-color 0.2s',
    ':hover': {
        backgroundColor: vars.surface[type].hoverBg,
    }
});
// ... surface code



export const typography = ({
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

// System UI Typography Presets
export const ui = {
    // Labels for inputs, section headers (Medium weight, tight spacing)
    label: (size: 'xs' | 'sm' | 'md' = 'sm'): StyleRule => typography({
        size,
        weight: 'medium',
        height: 'tight',
        spacing: 'normal'
    }),
    // Descriptions, help text (Regular weight, standard height)
    caption: (): StyleRule => typography({
        size: 'xs',
        weight: 'regular',
        height: 'standard',
        spacing: 'normal'
    }),
    // Compact menu items or list items
    menu: (): StyleRule => typography({
        size: 'sm',
        weight: 'medium',
        height: 'snug',
        spacing: 'normal'
    }),
    // Heavy headings for panels (Uppercase, wide spacing) -> "Overline" logic
    overline: (): StyleRule => typography({
        size: 'xs',
        weight: 'bold',
        height: 'tight',
        spacing: 'wide' // Uppercase often used with wide spacing
    }),
    // Code snippets
    code: (): StyleRule => typography({
        size: 'sm',
        weight: 'regular',
        variant: 'code',
        height: 'snug',
        spacing: 'normal'
    })
};
