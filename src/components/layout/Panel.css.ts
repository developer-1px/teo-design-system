import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const container = recipe({
    base: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
    },
    variants: {
        surface: {
            base: { backgroundColor: vars.surface.base.bg },
            subtle: { backgroundColor: vars.surface.subtle.bg },
        },
        side: {
            left: { borderRight: `1px solid ${vars.color.border}` },
            right: { borderLeft: `1px solid ${vars.color.border}` },
        }
    },
    defaultVariants: {
        surface: 'subtle',
        side: 'left'
    }
});

export const header = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: vars.sizing.header.height,
    borderBottom: `1px solid ${vars.color.border}`,
    flexShrink: 0,
});

export const title = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.medium,
    color: vars.color.primary,
});

export const body = style({
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
});

export const section = style({
    marginBottom: '8px',
});

export const sectionContent = style({
    padding: '0 16px',
});

export const sectionLabel = style({
    padding: '8px 16px',
    fontSize: vars.fontSize.xs,
    fontWeight: vars.weight.medium,
    color: vars.color.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
});

export const item = recipe({
    base: [
        surface.interactive('ghost'),
        {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '4px 16px',
            fontSize: vars.fontSize.sm,
            gap: '8px',
            height: vars.sizing.item.standard, // 32px
            cursor: 'pointer',
            textDecoration: 'none',
            color: vars.color.secondaryForeground,
            textAlign: 'left',
            border: 'none',
            outline: 'none',
        }
    ],
    variants: {
        active: {
            true: {
                backgroundColor: vars.color.accent,
                color: vars.color.primary,
                fontWeight: vars.weight.medium,
            },
            false: {}
        },
        density: {
            compact: { height: vars.sizing.item.compact }, // 28px
            standard: { height: vars.sizing.item.standard }, // 32px
            loose: { height: vars.sizing.item.medium }, // 36px
        }
    },
    defaultVariants: {
        active: false,
        density: 'standard'
    }
});
