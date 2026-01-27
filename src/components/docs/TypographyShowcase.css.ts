import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
    marginTop: vars.spacing[24],
});

export const header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vars.spacing[24],
});

export const title = style({
    fontSize: vars.fontSize.xl,
    fontWeight: vars.weight.bold,
    margin: 0,
});

export const toggleButton = style({
    padding: `${vars.spacing[8]} ${vars.spacing[12]}`,
    fontSize: vars.fontSize.sm,
    backgroundColor: vars.surface.subtle.bg,
    border: `1px solid ${vars.color.gray200}`,
    borderRadius: '4px',
    cursor: 'pointer',
    ':hover': {
        backgroundColor: vars.color.gray200,
    }
});

export const codeBlock = style({
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    padding: vars.spacing[16],
    borderRadius: '8px',
    marginBottom: vars.spacing[32],
    overflowX: 'auto',
    fontFamily: vars.font.code,
    fontSize: vars.fontSize.sm,
});

export const section = style({
    marginBottom: vars.spacing[40],
});

export const sectionTitle = style({
    fontSize: vars.fontSize.lg,
    color: vars.color.gray600,
    borderBottom: `1px solid ${vars.color.gray200}`,
    paddingBottom: vars.spacing[8],
    marginBottom: vars.spacing[16],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
});

export const grid = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing[24],
});

export const row = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[24],
    paddingBottom: vars.spacing[24],
    borderBottom: '1px dashed #eee',
});

export const meta = style({
    flex: '0 0 150px',
    display: 'flex',
    flexDirection: 'column',
});

export const tokenName = style({
    fontSize: vars.fontSize.sm,
    fontWeight: vars.weight.bold,
    color: vars.border.interactive, // Using interactive color (~blue500)
    fontFamily: vars.font.code,
});

export const tokenValue = style({
    fontSize: vars.fontSize.xs,
    color: vars.color.gray600,
    marginTop: vars.spacing[4],
});

export const preview = style({
    flex: 1,
    color: vars.surface.base.text,
});

export const lhWrapper = style({
    flex: 1,
    maxWidth: '400px',
});
