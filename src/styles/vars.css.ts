import { createThemeContract, createTheme } from '@vanilla-extract/css';

// 1. Define the shape of our theme (Contract)
export const vars = createThemeContract({
    font: {
        body: null,
        code: null,
    },
    fontSize: {
        xs: null,
        sm: null,
        md: null,
        lg: null,
        xl: null,
        xxl: null,
    },
    weight: {
        regular: null,
        medium: null,
        bold: null,
    },
    lineHeight: {
        tight: null,
        standard: null,
    },
    spacing: {
        0: null,
        4: null,
        8: null,
        12: null,
        16: null,
        20: null,
        24: null,
        32: null,
        40: null,
        48: null,
        56: null,
    },
    color: {
        white: null,
        gray50: null,
        gray100: null,
        gray200: null,
        gray300: null,
        gray600: null,
        gray800: null,
        blue500: null,
        blue50: null,
    },
    surface: {
        base: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        subtle: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        card: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        highlight: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        input: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        ghost: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
    },
    shadow: {
        depth1: null,
        depth2: null,
    }
});

// 2. Define Values (Light Theme)
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
        xxl: '22px',
    },
    weight: {
        regular: '400',
        medium: '500',
        bold: '700',
    },
    lineHeight: {
        tight: '1.25',
        standard: '1.5',
    }
};

const spacing = {
    0: '0',
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    56: '56px',
};

const lightColors = {
    white: '#fff',
    gray50: '#f9f9f9',
    gray100: '#f3f6fc',
    gray200: '#e1e3e1',
    gray300: '#c7c7c7',
    gray600: '#5f6368',
    gray800: '#202124',
    blue500: '#0b57d0',
    blue50: '#c2e7ff',
};

export const lightTheme = createTheme(vars, {
    font,
    ...typography,
    spacing,
    color: lightColors,
    surface: {
        base: {
            bg: '#ffffff',
            border: '0px solid transparent',
            shadow: 'none',
            text: '#202124',
            hoverBg: '#ffffff',
        },
        subtle: {
            bg: '#f6f8fc',
            border: '0px solid transparent',
            shadow: 'none',
            text: '#202124',
            hoverBg: '#f6f8fc',
        },
        card: {
            bg: '#ffffff',
            border: '1px solid #e1e3e1',
            shadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            text: '#202124',
            hoverBg: '#ffffff',
        },
        highlight: {
            bg: '#c2e7ff',
            border: 'none',
            shadow: 'none',
            text: '#001d35',
            hoverBg: '#c2e7ff',
        },
        input: {
            bg: '#eaf1fb',
            border: '1px solid transparent',
            shadow: 'none',
            text: '#202124',
            hoverBg: '#ffffff',
        },
        ghost: {
            bg: 'transparent',
            border: 'none',
            shadow: 'none',
            text: '#5f6368',
            hoverBg: 'rgba(60,64,67,0.08)',
        }
    },
    shadow: {
        depth1: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        depth2: '0 4px 6px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
    }
});

// 3. Define Values (Dark Theme)
export const darkTheme = createTheme(vars, {
    font,
    ...typography,
    spacing,
    color: {
        ...lightColors,
        white: '#202124',
        gray600: '#9aa0a6',
        gray800: '#e8eaed',
    },
    surface: {
        base: {
            bg: '#202124',
            border: '0px solid transparent',
            shadow: 'none',
            text: '#e8eaed',
            hoverBg: '#202124',
        },
        subtle: {
            bg: '#202124',
            border: '0px solid transparent',
            shadow: 'none',
            text: '#e8eaed',
            hoverBg: '#202124',
        },
        card: {
            bg: '#303134',
            border: '1px solid #5f6368',
            shadow: '0 1px 2px 0 rgba(0,0,0,0.5)',
            text: '#e8eaed',
            hoverBg: '#303134',
        },
        highlight: {
            bg: '#174ea6',
            border: 'none',
            shadow: 'none',
            text: '#c2e7ff',
            hoverBg: '#174ea6',
        },
        input: {
            bg: '#303134',
            border: '1px solid transparent',
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
        }
    },
    shadow: {
        depth1: '0 1px 2px 0 rgba(0,0,0,0.5)',
        depth2: '0 4px 8px 0 rgba(0,0,0,0.5)',
    }
});
