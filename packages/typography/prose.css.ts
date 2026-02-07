import { style, globalStyle, type StyleRule } from '@vanilla-extract/css';
import { vars } from '@surface/tokens';

// 1. typography: Pure Typography Scale (Font properties only)
// No margins, padding, or structural borders (unless intrinsic).

const h1: StyleRule = {
    fontSize: '2.25rem',
    fontWeight: '750',
    lineHeight: '1.15',
    letterSpacing: '-0.03em',
    color: vars.color.gray900,
};

const h2: StyleRule = {
    fontSize: '1.5rem',
    fontWeight: '650',
    letterSpacing: '-0.02em',
    color: vars.color.gray900,
};

const h3: StyleRule = {
    fontSize: '1.25rem',
    fontWeight: '600',
    letterSpacing: '-0.015em',
    color: vars.color.gray900,
};

const h4: StyleRule = {
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: vars.color.gray600,
};

const body: StyleRule = {
    fontSize: '15px',
    lineHeight: '1.65',
    color: vars.color.gray800,
};

const link: StyleRule = {
    color: vars.color.gray800,
    textDecoration: 'none',
    borderBottom: `1px solid ${vars.color.gray300}`,
    transition: 'border-color 0.2s, color 0.2s',
    fontWeight: '500',
    paddingBottom: '1px',
    selectors: {
        '&:hover': {
            color: vars.color.gray900,
            borderBottomColor: vars.color.gray900,
        }
    }
};

const code: StyleRule = {
    fontFamily: vars.font.code,
    fontSize: '0.875em',
    color: 'inherit',
};

const inlineCode: StyleRule = {
    backgroundColor: 'rgba(0,0,0,0.04)',
    border: `1px solid rgba(0,0,0,0.06)`,
    padding: '0.1rem 0.3rem',
    borderRadius: vars.borderRadius.sm,
    color: '#C02040',
    fontWeight: '500',
    fontSize: '0.9em',
    fontFamily: vars.font.code,
};

export const typography = {
    h1,
    h2,
    h3,
    h4,
    body,
    link,
    code,
    inlineCode
};

// 2. prose: Layout & Flow Context
// Composes typography scale and adds margins, spacing, markers.

export const prose = style({
    fontFamily: vars.font.body,
    fontSize: '15px',
    lineHeight: '1.65',
    color: vars.color.gray800,
    letterSpacing: '-0.01em',
    maxWidth: '65ch',
    margin: '0 auto',
});

// H1
globalStyle(`${prose} h1`, {
    ...typography.h1,
    marginTop: 0,
    marginBottom: '1rem',
});

// H2
globalStyle(`${prose} h2`, {
    ...typography.h2,
    marginTop: '2.5rem',
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px dashed ${vars.border.default}`,
    display: 'flex',
    alignItems: 'center',
});

// H3
globalStyle(`${prose} h3`, {
    ...typography.h3,
    marginTop: '2rem',
    marginBottom: '0.5rem',
});

// H4
globalStyle(`${prose} h4`, {
    ...typography.h4,
    marginTop: '1.5rem',
    marginBottom: '0.25rem',
});

// P
globalStyle(`${prose} p`, {
    ...typography.body,
    marginTop: 0,
    marginBottom: '1.25rem',
});

// Link
const { selectors: linkSelectors, ...linkBase } = typography.link;
globalStyle(`${prose} a`, linkBase);
// @ts-ignore
globalStyle(`${prose} a:hover`, linkSelectors['&:hover']);

// Code
globalStyle(`${prose} code`, typography.code);
globalStyle(`${prose} :not(pre) > code`, typography.inlineCode);

// Lists
globalStyle(`${prose} ul`, {
    paddingLeft: '1.25rem',
    margin: 0,
    marginBottom: '1.25rem',
    listStyle: 'none',
});

globalStyle(`${prose} ul li`, {
    position: 'relative',
    paddingLeft: '0.5rem',
    marginBottom: '0.5rem',
});

globalStyle(`${prose} ul li::before`, {
    content: '""',
    position: 'absolute',
    left: '-1rem',
    top: '0.65em',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: vars.color.gray300,
});

globalStyle(`${prose} ol`, {
    paddingLeft: '1.25rem',
    margin: 0,
    marginBottom: '1.25rem',
    color: vars.color.gray600,
});

globalStyle(`${prose} ol li`, {
    paddingLeft: '0.5rem',
    marginBottom: '0.5rem',
    fontVariantNumeric: 'tabular-nums',
});

// Blockquote
globalStyle(`${prose} blockquote`, {
    backgroundColor: vars.color.gray50,
    borderRadius: vars.borderRadius.lg,
    padding: '1.25rem 1.75rem',
    color: vars.color.gray600,
    border: `1px solid ${vars.border.subtle}`,
    margin: '1.5rem 0',
    fontStyle: 'normal',
});

globalStyle(`${prose} blockquote p`, {
    margin: 0,
});

// Pre
globalStyle(`${prose} pre`, {
    backgroundColor: vars.color.gray900,
    color: vars.color.gray50,
    padding: '1.25rem',
    borderRadius: vars.borderRadius.lg,
    overflowX: 'auto',
    fontSize: '13px',
    lineHeight: '1.6',
    border: `1px solid ${vars.border.subtle}`,
    margin: '1.5rem 0',
    fontFamily: vars.font.code,
    boxShadow: vars.shadow.raised,
});

// Tables
globalStyle(`${prose} table`, {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: vars.fontSize.sm,
    marginBottom: '2rem',
    borderRadius: vars.borderRadius.lg,
    border: `1px solid ${vars.color.gray200}`,
    backgroundColor: vars.color.white,
    overflow: 'hidden',
});

globalStyle(`${prose} thead`, {
    backgroundColor: vars.color.gray50,
});

globalStyle(`${prose} th`, {
    textAlign: 'left',
    fontFamily: vars.font.body,
    fontWeight: vars.weight.medium,
    color: vars.color.gray600,
    borderBottom: `1px solid ${vars.color.gray200}`,
    padding: '8px 12px',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    verticalAlign: 'bottom',
    fontSize: vars.fontSize.sm,
});

globalStyle(`${prose} tr`, {
    transition: 'background-color 0.1s ease',
});

globalStyle(`${prose} tr:hover`, {
    backgroundColor: vars.color.gray50,
});

globalStyle(`${prose} td`, {
    padding: '12px 16px',
    color: vars.color.gray800,
    borderBottom: `1px solid ${vars.color.gray100}`,
    verticalAlign: 'middle',
    fontSize: vars.fontSize.sm,
});

globalStyle(`${prose} tr:last-child td`, {
    borderBottom: 'none',
});

globalStyle(`${prose} td code`, {
    fontSize: '11px',
    color: vars.color.amber600,
    backgroundColor: vars.color.amber50,
    padding: '2px 6px',
    borderRadius: '4px',
    border: `1px solid ${vars.color.amber100}`,
    fontFamily: vars.font.code,
    fontWeight: 500,
});
