import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/vars.css';
import { surface } from '@/styles/utils';

export const header = style({
    gridColumn: '1 / -1',
    gridRow: '1',
    display: 'grid',
    gridTemplateColumns: 'inherit', // Uses the standard 256px 1fr grid
    alignItems: 'center',
    paddingRight: vars.spacing[16],
    backgroundColor: 'transparent', // Blends with Sidebar
    // borderBottom: `1px solid ${vars.color.gray100}`, // Removed for cleaner look
});

export const logoSection = style({
    gridColumn: '1',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: vars.spacing[16],
    gap: vars.spacing[12],
    height: '100%',
});

export const menuBtn = style({
    padding: vars.spacing[12],
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.gray600,
    ':hover': {
        backgroundColor: vars.color.gray100,
    }
});

export const logoText = style({
    fontSize: '22px',
    color: vars.color.gray600,
    fontWeight: vars.weight.medium,
    lineHeight: 1,
    position: 'relative',
    top: '-1px', // Visual adjustment
});

export const mailIcon = style({
    color: vars.color.primary,
});

export const logo = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[8],
    userSelect: 'none',
    cursor: 'pointer',
});

// New Container for Search + Actions in the second column
export const headerRightArea = style({
    gridColumn: '2',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between', // Push Search left/center, Actions right
    paddingLeft: vars.spacing[8],
});

export const searchBarContainer = style({
    flex: '1 1 auto', // Grow, but respect max width
    maxWidth: '720px',
    display: 'flex',
    alignItems: 'center',
});

// Refined Search Bar
export const searchBar = style([
    surface('base'), // White on Gray
    {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '48px',
        borderRadius: vars.borderRadius.full,
        padding: `0 ${vars.spacing[8]}`,
        transition: 'background-color 0.2s, box-shadow 0.2s, max-width 0.2s',
        border: '1px solid transparent',
        ':focus-within': {
            backgroundColor: vars.color.white,
            boxShadow: vars.shadow.raised,
            borderColor: vars.color.gray200,
        },
        ':hover': {
            backgroundColor: vars.color.gray100,
            boxShadow: vars.shadow.raised,
        }
    }
]);

export const input = style({
    border: 'none',
    background: 'transparent',
    flex: 1,
    height: '100%',
    fontSize: vars.fontSize.lg, // 16px
    color: vars.color.gray800,
    outline: 'none',
    padding: `0 ${vars.spacing[8]}`,
    '::placeholder': {
        color: vars.color.gray600,
        fontWeight: vars.weight.regular,
    }
});

export const searchIconBtn = style({
    padding: vars.spacing[8],
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.gray600,
    ':hover': {
        backgroundColor: 'rgba(0,0,0,0.05)',
        color: vars.color.gray800,
    }
});

export const tuneIconBtn = style({
    padding: vars.spacing[8],
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.gray600,
    marginRight: vars.spacing[4],
    ':hover': {
        backgroundColor: 'rgba(0,0,0,0.05)',
        color: vars.color.gray800,
    }
});

export const actions = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4], // Tight gap between groups
    paddingLeft: vars.spacing[12],
});

export const actionGroup = style({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing[4],
});

// Generic icon button for header actions
export const iconBtn = style({
    padding: vars.spacing[12],
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.gray600,
    ':hover': {
        backgroundColor: vars.color.gray100,
        color: vars.color.gray800,
    }
});

export const avatarBtn = style({
    padding: vars.spacing[4],
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    marginLeft: vars.spacing[4],
    ':hover': {
        backgroundColor: vars.color.gray100,
    }
});

export const avatarFallback = style({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: vars.color.primary, // Theme Consistent
    color: vars.color.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: vars.fontSize.sm, // Slightly smaller text for 32px avatar
    fontWeight: vars.weight.medium,
});
