import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const prose = style({
    fontFamily: vars.font.body,
    color: vars.color.gray800,
    lineHeight: vars.lineHeight.standard,
    maxWidth: '800px', // Optimal reading width
});

// Headings
globalStyle(`${prose} h1`, {
    fontSize: vars.fontSize.xxl,
    fontWeight: vars.weight.bold,
    marginTop: vars.spacing[40],
    marginBottom: vars.spacing[24],
    letterSpacing: '-0.02em',
    color: vars.surface.base.text,
});

globalStyle(`${prose} h2`, {
    fontSize: vars.fontSize.xl,
    fontWeight: vars.weight.bold,
    marginTop: vars.spacing[32],
    marginBottom: vars.spacing[16],
    paddingBottom: vars.spacing[8],
    borderBottom: '1px solid #e1e3e1', // Using raw color for now or could use vars.color.gray200
    color: vars.surface.base.text,
});

globalStyle(`${prose} h3`, {
    fontSize: vars.fontSize.lg,
    fontWeight: vars.weight.bold,
    marginTop: vars.spacing[24],
    marginBottom: vars.spacing[12],
    color: vars.surface.base.text,
});

// Text
globalStyle(`${prose} p`, {
    marginBottom: vars.spacing[16],
    lineHeight: '1.7', // slightly relaxed for reading
});

globalStyle(`${prose} strong`, {
    fontWeight: vars.weight.bold,
    color: vars.surface.base.text,
});

// Links
globalStyle(`${prose} a`, {
    color: vars.color.blue500,
    textDecoration: 'none',
    fontWeight: vars.weight.medium,
    borderBottom: `1px solid transparent`,
    transition: 'border-color 0.2s',
});
globalStyle(`${prose} a:hover`, {
    borderBottomColor: vars.color.blue500,
});

// Lists
globalStyle(`${prose} ul, ${prose} ol`, {
    paddingLeft: vars.spacing[24],
    marginBottom: vars.spacing[16],
});
globalStyle(`${prose} li`, {
    marginBottom: vars.spacing[8],
});

// Code
globalStyle(`${prose} code`, {
    fontFamily: vars.font.code,
    fontSize: '0.9em',
    backgroundColor: 'rgba(27, 31, 35, 0.05)',
    padding: '0.2em 0.4em',
    borderRadius: '3px',
});

globalStyle(`${prose} pre`, {
    backgroundColor: '#f6f8fa', // Needs dark mode consideration
    padding: vars.spacing[16],
    borderRadius: '8px',
    overflowX: 'auto',
    marginBottom: vars.spacing[24],
    border: '1px solid #d0d7de',
});

globalStyle(`${prose} pre code`, {
    backgroundColor: 'transparent',
    padding: 0,
    fontSize: vars.fontSize.sm,
    color: '#24292f',
});

// Blockquote
globalStyle(`${prose} blockquote`, {
    borderLeft: `4px solid ${vars.color.blue500}`,
    paddingLeft: vars.spacing[16],
    marginLeft: 0,
    color: vars.color.gray600,
    fontStyle: 'italic',
    marginBottom: vars.spacing[24],
});

// Tables
globalStyle(`${prose} table`, {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: vars.spacing[24],
    fontSize: vars.fontSize.sm,
});

globalStyle(`${prose} th`, {
    textAlign: 'left',
    padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
    borderBottom: '2px solid #e1e3e1',
    fontWeight: vars.weight.bold,
    color: vars.surface.base.text,
});

globalStyle(`${prose} td`, {
    padding: `${vars.spacing[12]} ${vars.spacing[16]}`,
    borderBottom: '1px solid #e1e3e1',
    color: vars.color.gray600,
});

globalStyle(`${prose} tr:hover td`, {
    backgroundColor: vars.surface.subtle.bg,
});
