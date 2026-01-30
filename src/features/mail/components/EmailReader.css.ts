import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const readerContainer = style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: vars.surface.base.bg,
});

export const toolbar = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[16],
    padding: `${vars.spacing[12]} ${vars.spacing[24]}`,
    borderBottom: `1px solid ${vars.color.gray100}`,
});

export const backButton = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vars.spacing[8],
    borderRadius: '50%',
    cursor: 'pointer',
    color: vars.color.gray600,
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color 0.1s',
    ':hover': {
        backgroundColor: vars.color.gray100,
        color: vars.color.gray800,
    }
});

export const scrollArea = style({
    flex: 1,
    overflowY: 'auto',
    padding: `${vars.spacing[32]} ${vars.spacing[48]}`, // Paper-like padding
});

export const title = style({
    fontSize: '24px',
    fontWeight: vars.weight.bold,
    marginBottom: vars.spacing[24],
    color: vars.color.gray900,
    lineHeight: 1.3,
});

export const metaInfo = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[12],
    marginBottom: vars.spacing[32],
    color: vars.color.gray600,
    fontSize: vars.fontSize.md,
    paddingBottom: vars.spacing[24],
    borderBottom: `1px solid ${vars.color.gray100}`,
});

// Markdown Styles are now handled by the 'prose' class from Markdown.css.ts
// The markdownBody class below provides basic layout/spacing if needed
export const markdownBody = style({
    fontSize: '15px',
    lineHeight: 1.6,
    color: vars.color.gray800,
    maxWidth: '800px',
});
