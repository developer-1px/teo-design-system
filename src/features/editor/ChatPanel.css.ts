import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { surface } from '../../styles/utils.css';

export const panel = style([
    surface('subtle'),
    {
        gridColumn: '3',
        borderLeft: `1px solid ${vars.color.gray200}`,
        display: 'flex',
        flexDirection: 'column',
    }
]);

export const header = style({
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${vars.spacing[16]}`,
    fontSize: '11px',
    fontWeight: 700,
    color: vars.color.gray600,
    borderBottom: `1px solid ${vars.color.gray200}`,
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
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.4',
    maxWidth: '90%',
});

export const aiMessage = style([
    messageBase,
    surface('card'),
    {
        alignSelf: 'flex-start',
        borderTopLeftRadius: '2px',
    }
]);

export const userMessage = style([
    messageBase,
    surface('highlight'),
    {
        alignSelf: 'flex-end',
        borderTopRightRadius: '2px',
        backgroundColor: vars.color.blue50, // Force light blue for user message in light mode
        color: vars.color.gray800,
    }
]);

export const inputArea = style({
    padding: vars.spacing[16],
    borderTop: `1px solid ${vars.color.gray200}`,
    backgroundColor: vars.surface.base.bg,
});

export const input = style([
    surface('input'),
    {
        width: '100%',
        padding: vars.spacing[12],
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: 'inherit',
        resize: 'none',
        minHeight: '40px',
        ':focus': {
            outline: `1px solid ${vars.color.blue500}`,
            backgroundColor: vars.surface.base.bg,
        }
    }
]);
