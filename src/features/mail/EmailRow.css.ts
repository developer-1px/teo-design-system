import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const row = style({
    gridColumn: '1 / -1',
    display: 'grid',
    gridTemplateColumns: 'subgrid', // Inherits tracks from EmailList
    height: '40px',
    alignItems: 'center',
    borderBottom: `1px solid ${vars.color.gray200}`,
    cursor: 'pointer',
    paddingRight: vars.spacing[16],
    backgroundColor: vars.surface.base.bg, // Default white
    ':hover': {
        boxShadow: vars.shadow.raised,
        zIndex: vars.zIndices.elevated, // Lift on hover
        borderBottomColor: 'transparent', // visual lift
    }
});

export const iconCell = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.gray300,
});

export const sender = style({
    fontWeight: 500, // Unread by default
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
});

export const subjectText = style({
    fontWeight: 700, // Unread
    color: vars.color.gray800,
});

export const snippet = style({
    fontWeight: 400,
    color: vars.color.gray600,
});

export const date = style({
    fontWeight: 700, // Unread
    fontSize: '12px',
    color: vars.color.gray800,
    justifySelf: 'end',
});

// Variants for Read/Unread/Selected
export const rowState = styleVariants({
    read: { backgroundColor: vars.surface.base.bg },
    unread: { backgroundColor: vars.surface.base.bg },
    selected: {
        backgroundColor: vars.surface.highlight.bg,
        ':hover': { backgroundColor: vars.surface.highlight.bg }
    }
});

// Text weights
export const textWeight = styleVariants({
    bold: { fontWeight: 700 },
    normal: { fontWeight: 400 }
});
