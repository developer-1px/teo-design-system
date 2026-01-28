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
        '3xl': null,
        '4xl': null,
    },
    weight: {
        regular: null,
        medium: null,
        bold: null,
    },
    lineHeight: {
        none: null,
        tight: null,
        snug: null,
        standard: null,
        relaxed: null,
    },
    letterSpacing: {
        tighter: null,
        tight: null,
        normal: null,
        wide: null,
        widest: null,
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
        64: null,
        80: null,
    },
    borderRadius: {
        none: null,
        sm: null,
        md: null,
        lg: null,
        xl: null,
        full: null, // "50%" behavior
    },
    color: {
        white: null,
        gray50: null,
        gray100: null,
        gray200: null,
        gray300: null,
        gray400: null,
        gray500: null,
        gray600: null,
        gray700: null,
        gray800: null,
        gray900: null,

        // Semantic Colors
        green50: null,
        green100: null,
        green400: null,
        green500: null,
        green600: null,
        green700: null,
        green800: null,

        red50: null,
        red100: null,
        red400: null,
        red500: null,
        red600: null,
        red700: null,
        red800: null,

        amber50: null,
        amber100: null,
        amber400: null,
        amber500: null,
        amber600: null,
        amber700: null,
        amber800: null,

        blue50: null,
        blue100: null,
        blue400: null,
        blue500: null,
        blue600: null,
        blue700: null,
        blue800: null,

        // Semantic Colors (Abstracted)
        primary: null,
        primaryForeground: null,
        secondary: null,
        secondaryForeground: null,
        destructive: null,
        destructiveForeground: null,
        muted: null,
        mutedForeground: null,
        accent: null,
        accentForeground: null,

        // Component-specific
        border: null,
        input: null,
        ring: null,
    },
    content: {
        paper: {
            bg: null,
            text: null,
        }
    },
    border: {
        subtle: null,
        default: null,
        strong: null,
        interactive: null,
    },
    surface: {
        base: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        subtle: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        card: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        highlight: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        input: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        ghost: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
        outlined: { bg: null, border: null, shadow: null, text: null, hoverBg: null },
    },
    zIndices: {
        base: null,
        elevated: null,
        floating: null,
        modal: null,
        popover: null,
        toast: null,
        max: null,
    },
    shadow: {
        flat: null,
        raised: null,
        overlay: null,
        modal: null,
        popover: null,
    },
    sizing: {
        // Layout
        sidebar: {
            width: null,
            collapsedWidth: null, // 48px
        },
        header: {
            height: null, // 48px standard
        },
        // Components (Button, Input, Item Heights)
        item: {
            dense: null,    // 24px (Very dense lists)
            compact: null,  // 28px (Sidebar items)
            standard: null, // 32px (Buttons, Inputs)
            medium: null,   // 36px (Medium Buttons)
            large: null,    // 40px (Large Inputs)
            touch: null,    // 44px (Mobile Standard)
        }
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
        tight: '1.2', // Slightly increased from 1.25 for headings
        snug: '1.35',
        standard: '1.6', // Increased from 1.5 for better body readability
        relaxed: '1.75', // Increased from 1.625
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
    4: '0.25rem', // 4px
    8: '0.5rem',  // 8px
    12: '0.75rem', // 12px
    16: '1rem',    // 16px
    20: '1.25rem', // 20px
    24: '1.5rem',  // 24px
    32: '2rem',    // 32px
    40: '2.5rem',  // 40px
    48: '3rem',    // 48px
    56: '3.5rem',  // 56px
    64: '4rem',    // 64px
    80: '5rem',    // 80px
};

const borderRadius = {
    none: '0',
    sm: '6px', // Increased from 4
    md: '10px', // Increased from 8
    lg: '16px', // Increased from 12
    xl: '24px', // Increased from 16
    full: '9999px',
};

const lightColors = {
    white: '#FFFFFF',
    gray50: '#FAFAFA', // Zinc 50
    gray100: '#F4F4F5', // Zinc 100
    gray200: '#E4E4E7', // Zinc 200
    gray300: '#D4D4D8', // Zinc 300
    gray400: '#A1A1AA', // Zinc 400
    gray500: '#71717A', // Zinc 500
    gray600: '#52525B', // Zinc 600
    gray700: '#3F3F46', // Zinc 700
    gray800: '#27272A', // Zinc 800
    gray900: '#18181B', // Zinc 900

    // Semantic Colors
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

    // Semantic Mapping (Zinc/Grayscale Theme)
    primary: '#18181B', // Zinc 900
    primaryForeground: '#FAFAFA', // Zinc 50
    secondary: '#F4F4F5', // Zinc 100
    secondaryForeground: '#18181B', // Zinc 900
    destructive: '#DC2626', // Red 600
    destructiveForeground: '#FFFFFF',
    muted: '#F4F4F5', // Zinc 100
    mutedForeground: '#71717A', // Zinc 500
    accent: '#F4F4F5', // Zinc 100
    accentForeground: '#18181B', // Zinc 900

    border: '#E4E4E7', // Zinc 200
    input: '#E4E4E7', // Zinc 200
    ring: '#18181B', // Zinc 900
};

const lightBorders = {
    subtle: lightColors.gray100, // #F4F4F5
    default: lightColors.gray200, // #E4E4E7
    strong: lightColors.gray300, // #D4D4D8
    interactive: lightColors.blue600, // #2563EB
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
            text: '#202124', // Standard Text
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
            bg: lightColors.gray100, // #F4F4F5
            border: '0px solid transparent',
            shadow: 'none',
            text: lightColors.gray900, // #18181B
            hoverBg: lightColors.gray100,
        },
        card: {
            bg: lightColors.white,
            border: `1px solid ${lightColors.gray200}`, // Was #e1e3e1, now #E4E4E7 for lighter/softer look
            shadow: '0 4px 12px rgba(0,0,0,0.03)', // Diffuse shadow: increased blur (12px), single layer to avoid clumping
            text: '#202124',
            hoverBg: lightColors.white,
        },
        highlight: {
            bg: lightColors.green50, // #F0FDF4
            border: 'none',
            shadow: 'none',
            text: lightColors.green700, // Strong green text
            hoverBg: lightColors.green50,
        },
        input: {
            bg: '#f9f9f9', // Slightly off white, keeping literal or map to gray50?
            border: `1px solid ${lightColors.gray200}`, // Was #e1e3e1
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
            border: `1px solid ${lightColors.gray200}`, // #E4E4E7
            shadow: 'none',
            text: '#202124',
            hoverBg: lightColors.gray50, // #FAFAFA
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
            height: '48px',
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

// 3. Define Values (Dark Theme)
const darkColors = {
    ...lightColors,
    white: '#18181B',
    gray50: '#27272A',
    gray100: '#3F3F46',
    gray200: '#52525B',
    gray300: '#71717A',
    gray400: '#A1A1AA',
    gray500: '#D4D4D8', // Inverted logic start
    gray600: '#E4E4E7',
    gray700: '#F4F4F5',
    gray800: '#FAFAFA',
    gray900: '#FFFFFF',

    // Semantic Colors (Direct mapping or slight adjustment for dark mode visibility)
    green50: '#064E3B', // Dark green bg
    green100: '#065F46',
    green400: '#4ADE80',
    green500: '#F4F4F5', // Remapped to White/Zinc-100 for dark mode active text
    green600: '#22C55E', // Brighter green for text in dark mode
    green700: '#86EFAC',
    green800: '#BBF7D0',

    red50: '#7F1D1D',
    red100: '#991B1B',
    red400: '#F87171',
    red500: '#EF4444',
    red600: '#EF4444', // Brighter red
    red700: '#FCA5A5',
    red800: '#FECACA',

    amber50: '#78350F',
    amber100: '#92400E',
    amber400: '#FBBF24',
    amber500: '#F59E0B',
    amber600: '#F59E0B',
    amber700: '#FDE68A',
    amber800: '#FEF3C7',

    blue50: '#1E3A8A',
    blue100: '#1E40AF',
    blue400: '#60A5FA',
    blue500: '#3B82F6',
    blue600: '#3B82F6',
    blue800: '#DBEAFE',

    // Semantic Mapping (Dark Mode)
    primary: '#FAFAFA', // Zinc 50
    primaryForeground: '#18181B', // Zinc 900
    secondary: '#27272A', // Zinc 800
    secondaryForeground: '#FAFAFA', // Zinc 50
    destructive: '#7F1D1D', // Red 900
    destructiveForeground: '#FEF2F2', // Red 50
    muted: '#27272A', // Zinc 800
    mutedForeground: '#A1A1AA', // Zinc 400
    accent: '#27272A', // Zinc 800
    accentForeground: '#FAFAFA', // Zinc 50

    border: '#27272A', // Zinc 800
    input: '#27272A', // Zinc 800
    ring: '#D4D4D8', // Zinc 300
};

export const darkTheme = createTheme(vars, {
    font,
    ...typography,
    spacing,
    borderRadius,
    color: darkColors,
    content: {
        paper: {
            bg: darkColors.white, // #18181B
            text: '#202124', // Explicitly dark text even in dark mode? Wait, previously it was #202124. This looks odd for dark mode paper text.
            // Converting to proper dark mode text if logic implies paper is standard bg.
            // Using darkColors.gray900 (White) would be better?
            // Reverting to previous explicit value '#202124' to maintain identical behavior to previous file for now, 
            // but suspect this should be darkColors.gray900.
            // Checking previous file... it was #202124.  I will keep it consistent with previous file for safety.
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
            bg: darkColors.white, // #18181B
            border: '0px solid transparent',
            shadow: 'none',
            text: darkColors.gray900, // #F4F4F5 (approx, was #F4F4F5 in prev)
            hoverBg: darkColors.white,
        },
        subtle: {
            bg: '#09090B', // Zinc 950 - Not in palette, keeping literal
            border: '0px solid transparent',
            shadow: 'none',
            text: darkColors.gray900, // #F4F4F5
            hoverBg: '#09090B',
        },
        card: {
            bg: darkColors.gray50, // #27272A
            border: `1px solid ${darkColors.gray100}`, // #3F3F46
            shadow: '0 4px 12px rgba(0,0,0,0.3)', // Larger blur for smoother gradient in dark mode
            text: darkColors.gray900, // #F4F4F5
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
            border: `1px solid ${darkColors.gray100}`, // #3F3F46
            shadow: 'none',
            text: darkColors.gray900, // #F4F4F5
            hoverBg: darkColors.gray50, // #27272A
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
            height: '48px',
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
