import type { StyleRule } from '@vanilla-extract/css';
import { vars } from '@surface/tokens';

type SurfaceType = keyof typeof vars.surface;

const surfaceBase = (type: SurfaceType): StyleRule => ({
    backgroundColor: vars.surface[type].bg,
    color: vars.surface[type].text,
    border: vars.surface[type].border,
    boxShadow: vars.surface[type].shadow,
});

const surfaceInteractive = (type: SurfaceType): StyleRule => ({
    ...surfaceBase(type),
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s',
    ':hover': {
        backgroundColor: vars.surface[type].hoverBg,
    },
    selectors: {
        '&[disabled], &:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
            pointerEvents: 'none',
        }
    }
});

const surfaceField: StyleRule = {
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    selectors: {
        '&:focus': {
            borderColor: vars.color.gray800,
            boxShadow: `0 0 0 1px ${vars.color.gray800}`,
            backgroundColor: vars.color.white,
        },
        '&:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
        },
        '&[data-invalid="true"]': {
            borderColor: vars.color.red500,
            boxShadow: 'none',
        },
        '&[data-invalid="true"]:focus': {
            borderColor: vars.color.red500,
            boxShadow: `0 0 0 1px ${vars.color.red500}`,
        }
    }
};

/**
 * Surface mixin system
 * @example surface('card')           — static surface
 * @example surface.interactive('card') — hover/disabled states
 * @example surface.field             — input field focus/validation
 */
export const surface = Object.assign(surfaceBase, {
    base: surfaceBase,
    interactive: surfaceInteractive,
    field: surfaceField
});
