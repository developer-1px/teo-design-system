import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils';

export const panel = style([
    surface('subtle'),
    {
        gridColumn: '3',
        borderLeft: `1px solid ${vars.border.default}`,
        display: 'flex',
        flexDirection: 'column',
    }
]);

export const header = style({
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.weight.bold,
    color: vars.color.gray600,
    borderBottom: `1px solid ${vars.border.default}`,
    justifyContent: 'space-between',
});

export const messageList = style({
    flex: 1,
    overflowY: 'auto',
    padding: vars.spacing[16],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[16],
});

export const messageBase = style({
    padding: vars.spacing[12],
    borderRadius: vars.borderRadius.lg,
    fontSize: vars.fontSize.sm,
    lineHeight: vars.lineHeight.snug,
    maxWidth: '90%',
});

export const aiMessage = style([
    messageBase,
    surface('card'),
    {
        alignSelf: 'flex-start',
        borderTopLeftRadius: vars.borderRadius.sm,
    }
]);

export const userMessage = style([
    messageBase,
    surface('highlight'), // This should provide the green tint
    {
        alignSelf: 'flex-end',
        borderTopRightRadius: vars.borderRadius.sm,
        // No hardcoded blue bg
    }
]);

export const inputArea = style({
    padding: vars.spacing[16],
    borderTop: `1px solid ${vars.border.default}`,
    backgroundColor: vars.surface.base.bg,
});

export const input = style([
    surface('input'),
    {
        width: '100%',
        padding: vars.spacing[12],
        borderRadius: vars.borderRadius.md,
        fontSize: vars.fontSize.sm,
        fontFamily: 'inherit',
        resize: 'none',
        minHeight: '40px',
        ':focus': {
            outline: `1px solid ${vars.border.interactive}`,
            backgroundColor: vars.surface.base.bg,
        }
    }
]);
