import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import { subgrid } from '../../styles/utils.css';

export const row = style([
    subgrid('x'),
    {
        height: '40px',
        alignItems: 'center',
        borderBottom: `1px solid ${vars.color.gray100}`, // Subtle separator
        cursor: 'pointer',
        paddingRight: vars.spacing[16],
        backgroundColor: vars.surface.base.bg,
        transition: 'box-shadow 0.2s ease, background-color 0.1s ease',
        ':hover': {
            boxShadow: vars.shadow.raised,
            zIndex: vars.zIndices.elevated,
            borderBottomColor: 'transparent',
        }
    }
]);

export const iconCell = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.gray300,
    transition: 'color 0.2s',
    ':hover': {
        color: vars.color.gray600,
    }
});

export const sender = style({
    fontSize: vars.fontSize.md, // 13px?
    color: vars.color.gray800,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: vars.spacing[24],
});

export const subjectSection = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: vars.spacing[16],
});

export const subjectText = style({
    fontSize: vars.fontSize.md,
    color: vars.color.gray800,
});

export const snippet = style({
    fontSize: vars.fontSize.md,
    color: vars.color.gray600,
});

export const date = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.gray600,
    justifySelf: 'end',
    whiteSpace: 'nowrap',
});

// Variants for Read/Unread/Selected
// Refining selected state to be more visible but subtle
export const rowState = styleVariants({
    read: { backgroundColor: vars.surface.base.bg },
    unread: { backgroundColor: vars.surface.base.bg }, // Could add a subtle background if needed
    selected: {
        backgroundColor: vars.surface.highlight.bg, // Uses the green highlight usually, or modify to blue
        ':hover': { backgroundColor: vars.surface.highlight.hoverBg }
    }
});

// Text weights
export const textWeight = styleVariants({
    bold: { fontWeight: vars.weight.bold },
    normal: { fontWeight: vars.weight.regular }
});
