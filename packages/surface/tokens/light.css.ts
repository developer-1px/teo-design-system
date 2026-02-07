import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';

// Shared values (theme-agnostic)
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

// Light Colors
const lightColors = {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray400: '#A1A1AA',
    gray500: '#71717A',
    gray600: '#52525B',
    gray700: '#3F3F46',
    gray800: '#27272A',
    gray900: '#18181B',

    // Green (Success)
    green50: '#F0FDF4',
    green100: '#DCFCE7',
    green400: '#4ADE80',
    green500: '#22C55E',
    green600: '#16A34A',
    green700: '#15803D',
    green800: '#166534',

    // Red (Danger)
    red50: '#FEF2F2',
    red100: '#FEE2E2',
    red400: '#F87171',
    red500: '#EF4444',
    red600: '#DC2626',
    red700: '#B91C1C',
    red800: '#991B1B',

    // Amber (Warning)
    amber50: '#FFFBEB',
    amber100: '#FEF3C7',
    amber400: '#FBBF24',
    amber500: '#F59E0B',
    amber600: '#D97706',
    amber700: '#B45309',
    amber800: '#92400E',

    // Blue (Info)
    blue50: '#EFF6FF',
    blue100: '#DBEAFE',
    blue400: '#60A5FA',
    blue500: '#3B82F6',
    blue600: '#2563EB',
    blue700: '#1D4ED8',
    blue800: '#1E40AF',

    // Semantic Mapping
    primary: '#18181B',
    primaryForeground: '#FAFAFA',
    secondary: '#F4F4F5',
    secondaryForeground: '#18181B',
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    muted: '#F4F4F5',
    mutedForeground: '#71717A',
    accent: '#F4F4F5',
    accentForeground: '#18181B',

    border: '#E4E4E7',
    input: '#E4E4E7',
    ring: '#18181B',
};

const lightBorders = {
    subtle: lightColors.gray100,
    default: lightColors.gray200,
    strong: lightColors.gray300,
    interactive: lightColors.blue600,
};

export const lightTheme = createTheme(vars, {
    font,
    ...typography,
    spacing,
    borderRadius,
    color: lightColors,
    content: {
        paper: {
            bg: lightColors.white,
            text: '#202124',
        }
    },
    border: lightBorders,
    surface: {
        base: {
            bg: lightColors.white,
            border: '0px solid transparent',
            shadow: 'none',
            text: '#202124',
            hoverBg: lightColors.white,
        },
        subtle: {
            bg: lightColors.gray100,
            border: '0px solid transparent',
            shadow: 'none',
            text: lightColors.gray900,
            hoverBg: lightColors.gray100,
        },
        card: {
            bg: lightColors.white,
            border: `1px solid ${lightColors.gray200}`,
            shadow: '0 4px 12px rgba(0,0,0,0.03)',
            text: '#202124',
            hoverBg: lightColors.white,
        },
        highlight: {
            bg: lightColors.green50,
            border: 'none',
            shadow: 'none',
            text: lightColors.green700,
            hoverBg: lightColors.green50,
        },
        input: {
            bg: '#f9f9f9',
            border: `1px solid ${lightColors.gray200}`,
            shadow: 'none',
            text: '#202124',
            hoverBg: lightColors.white,
        },
        ghost: {
            bg: 'transparent',
            border: 'none',
            shadow: 'none',
            text: '#5f6368',
            hoverBg: 'rgba(60,64,67,0.08)',
        },
        outlined: {
            bg: 'transparent',
            border: `1px solid ${lightColors.gray200}`,
            shadow: 'none',
            text: '#202124',
            hoverBg: lightColors.gray50,
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
        raised: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        overlay: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        popover: '0 12px 20px -8px rgba(0, 0, 0, 0.15), 0 4px 12px -4px rgba(0, 0, 0, 0.1)',
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
