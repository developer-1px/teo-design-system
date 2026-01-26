import type { StyleRule } from '@vanilla-extract/css';
import { vars } from './vars.css';

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
    // Allow overriding line height if needed, but defaults are smart
}: {
    size?: keyof typeof vars.fontSize,
    weight?: keyof typeof vars.weight,
    variant?: keyof typeof vars.font
} = {}): StyleRule => ({
    fontFamily: vars.font[variant],
    fontSize: vars.fontSize[size],
    fontWeight: vars.weight[weight],
    // Intelligent defaults based on variant/size
    lineHeight: variant === 'code' ? vars.lineHeight.standard : vars.lineHeight.standard,
    letterSpacing: variant === 'code' ? '0' : '-0.01em', // Tracking adjustment
});
