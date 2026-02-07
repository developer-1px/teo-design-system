import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';

// Shared values (theme-agnostic, same as light)
const font = {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    code: 'Menlo, Monaco, "Courier New", monospace',
};

const typography = {
    fontSize: {
        xs: '11px',
        sm: '12px',
        md: '13px',
        lg: '14px',
        xl: '16px',
        xxl: '20px',
        '3xl': '24px',
        '4xl': '32px',
    },
    weight: {
        regular: '400',
        medium: '500',
        bold: '700',
    },
    lineHeight: {
        none: '1',
        tight: '1.2',
        snug: '1.35',
        standard: '1.6',
        relaxed: '1.75',
    },
    letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.025em',
        widest: '0.05em',
    }
};

const spacing = {
    0: '0',
    4: '0.25rem',
    8: '0.5rem',
    12: '0.75rem',
    16: '1rem',
    20: '1.25rem',
    24: '1.5rem',
    32: '2rem',
    40: '2.5rem',
    48: '3rem',
    56: '3.5rem',
    64: '4rem',
    80: '5rem',
};

const borderRadius = {
    none: '0',
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
};

// Dark Colors
const darkColors = {
    white: '#18181B',
    gray50: '#27272A',
    gray100: '#3F3F46',
    gray200: '#52525B',
    gray300: '#71717A',
    gray400: '#A1A1AA',
    gray500: '#D4D4D8',
    gray600: '#E4E4E7',
    gray700: '#F4F4F5',
    gray800: '#FAFAFA',
    gray900: '#FFFFFF',

    // Green
    green50: '#064E3B',
    green100: '#065F46',
    green400: '#4ADE80',
    green500: '#F4F4F5',
    green600: '#22C55E',
    green700: '#86EFAC',
    green800: '#BBF7D0',

    // Red
    red50: '#7F1D1D',
    red100: '#991B1B',
    red400: '#F87171',
    red500: '#EF4444',
    red600: '#EF4444',
    red700: '#FCA5A5',
    red800: '#FECACA',

    // Amber
    amber50: '#78350F',
    amber100: '#92400E',
    amber400: '#FBBF24',
    amber500: '#F59E0B',
    amber600: '#F59E0B',
    amber700: '#FDE68A',
    amber800: '#FEF3C7',

    // Blue
    blue50: '#1E3A8A',
    blue100: '#1E40AF',
    blue400: '#60A5FA',
    blue500: '#3B82F6',
    blue600: '#3B82F6',
    blue700: '#1D4ED8',
    blue800: '#DBEAFE',

    // Semantic Mapping (Dark Mode)
    primary: '#FAFAFA',
    primaryForeground: '#18181B',
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    destructive: '#7F1D1D',
    destructiveForeground: '#FEF2F2',
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    accent: '#27272A',
    accentForeground: '#FAFAFA',

    border: '#27272A',
    input: '#27272A',
    ring: '#D4D4D8',
};

export const darkTheme = createTheme(vars, {
    font,
    ...typography,
    spacing,
    borderRadius,
    color: darkColors,
    content: {
        paper: {
            bg: darkColors.white,
            text: '#202124',
        }
    },
    border: {
        subtle: darkColors.gray50,
        default: darkColors.gray100,
        strong: darkColors.gray200,
        interactive: darkColors.blue500,
    },
    surface: {
        base: {
            bg: darkColors.white,
            border: '0px solid transparent',
            shadow: 'none',
            text: darkColors.gray900,
            hoverBg: darkColors.white,
        },
        subtle: {
            bg: '#09090B',
            border: '0px solid transparent',
            shadow: 'none',
            text: darkColors.gray900,
            hoverBg: '#09090B',
        },
        card: {
            bg: darkColors.gray50,
            border: `1px solid ${darkColors.gray100}`,
            shadow: '0 4px 12px rgba(0,0,0,0.3)',
            text: darkColors.gray900,
            hoverBg: darkColors.gray50,
        },
        highlight: {
            bg: 'rgba(16, 185, 129, 0.1)',
            border: 'none',
            shadow: 'none',
            text: '#10B981',
            hoverBg: 'rgba(16, 185, 129, 0.15)',
        },
        input: {
            bg: '#303134',
            border: '1px solid #5f6368',
            shadow: 'none',
            text: '#e8eaed',
            hoverBg: '#303134',
        },
        ghost: {
            bg: 'transparent',
            border: 'none',
            shadow: 'none',
            text: '#9aa0a6',
            hoverBg: 'rgba(232, 234, 237, 0.08)',
        },
        outlined: {
            bg: 'transparent',
            border: `1px solid ${darkColors.gray100}`,
            shadow: 'none',
            text: darkColors.gray900,
            hoverBg: darkColors.gray50,
        }
    },
    zIndices: {
        base: '0',
        elevated: '10',
        floating: '100',
        modal: '1000',
        popover: '1100',
        toast: '10000',
        max: '2147483647',
    },
    shadow: {
        flat: 'none',
        raised: '0 2px 4px rgba(0,0,0,0.2), 0 1px 6px rgba(0,0,0,0.3)',
        overlay: '0 8px 16px rgba(0,0,0,0.4)',
        modal: '0 12px 32px rgba(0,0,0,0.5)',
        popover: '0 16px 36px rgba(0,0,0,0.4)',
    },
    sizing: {
        sidebar: {
            width: '240px',
            collapsedWidth: '48px',
        },
        header: {
            height: '64px',
        },
        item: {
            dense: '24px',
            compact: '28px',
            standard: '32px',
            medium: '36px',
            large: '40px',
            touch: '44px',
        }
    }
});
