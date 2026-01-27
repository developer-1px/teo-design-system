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
        gray600: null,
        gray800: null,
        green500: null,
        green50: null,
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
    gray600: '#52525B', // Zinc 600
    gray800: '#18181B', // Zinc 900
    green500: '#18181B', // Zinc 900 (Black) - Active Text
    green50: '#F4F4F5',  // Zinc 100 - Active Background
};

const lightBorders = {
    subtle: '#F4F4F5', // gray100
    default: '#E4E4E7', // gray200
    strong: '#D4D4D8', // gray300
    interactive: '#2563EB', // Blue 600 (Standard Tech Blue)
};

export const lightTheme = createTheme(vars, {
    font,
    ...typography,
    spacing,
    borderRadius,
    color: lightColors,
    content: {
        paper: {
            bg: '#ffffff',
            text: '#202124',
        }
    },
    border: lightBorders,
    surface: {
        base: {
            bg: '#ffffff',
            border: '0px solid transparent',
            shadow: 'none',
            text: '#202124',
            hoverBg: '#ffffff',
        },
        subtle: {
            bg: '#F4F4F5', // Zinc 100 - Visible enough to separate from white without a border
            border: '0px solid transparent', // No border needed
            shadow: 'none',
            text: '#18181B', // Zinc 900
            hoverBg: '#F4F4F5',
        },
        card: {
            bg: '#ffffff',
            border: '1px solid #e1e3e1',
            shadow: '0 2px 4px rgba(0,0,0,0.02), 0 1px 6px rgba(0,0,0,0.03)',
            text: '#202124',
            hoverBg: '#ffffff',
        },
        highlight: {
            bg: '#F0F9ED', // green50
            border: 'none',
            shadow: 'none',
            text: '#0D3D1E', // Dark green text
            hoverBg: '#F0F9ED',
        },
        input: {
            bg: '#f9f9f9', // gray50
            border: '1px solid #e1e3e1', // Default border
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
        },
        outlined: {
            bg: 'transparent',
            border: '1px solid #E4E4E7', // vars.border.default
            shadow: 'none',
            text: '#202124',
            hoverBg: '#FAFAFA', // gray50
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
        // Elevation System: Diffused & Soft (Claude-like)
        flat: 'none',
        // Level 1: Cards - Subtle ambient + key
        raised: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        // Level 2: Overlay - Softer drop
        overlay: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        // Level 3: Modal - Deep but diffused
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        // Level 4: Popover - Reduced elevation as requested (was very high)
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
export const darkTheme = createTheme(vars, {
    font,
    ...typography,
    spacing,
    borderRadius,
    color: {
        ...lightColors,
        white: '#18181B',
        gray50: '#27272A',
        gray100: '#3F3F46',
        gray200: '#52525B',
        gray300: '#71717A',
        gray600: '#A1A1AA',
        gray800: '#F4F4F5',
        green500: '#F4F4F5', // Remapped to White/Zinc-100 for dark mode active text
        green50: '#27272A', // Remapped to Zinc-800 for dark mode active bg
    },
    content: {
        paper: {
            bg: '#ffffff', // Explicitly white even in dark mode
            text: '#202124', // Explicitly dark text even in dark mode
        }
    },
    border: {
        subtle: '#27272A', // Zinc 800
        default: '#3F3F46', // Zinc 700
        strong: '#52525B', // Zinc 600
        interactive: '#3B82F6', // Blue 500
    },
    surface: {
        base: {
            bg: '#18181B', // Zinc 900
            border: '0px solid transparent',
            shadow: 'none',
            text: '#F4F4F5', // Zinc 100
            hoverBg: '#18181B',
        },
        subtle: {
            bg: '#09090B', // Zinc 950 (Darker for sidebar/subtle)
            border: '0px solid transparent',
            shadow: 'none',
            text: '#F4F4F5',
            hoverBg: '#09090B',
        },
        card: {
            bg: '#27272A', // Zinc 800
            border: '1px solid #3F3F46', // Zinc 700
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
            text: '#F4F4F5',
            hoverBg: '#27272A',
        },
        highlight: {
            bg: 'rgba(16, 185, 129, 0.1)', // green500 with opacity
            border: 'none',
            shadow: 'none',
            text: '#10B981', // green500
            hoverBg: 'rgba(16, 185, 129, 0.15)',
        },
        input: {
            bg: '#303134',
            border: '1px solid #5f6368', // Visible border for dark mode
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
            border: '1px solid #3F3F46', // vars.border.default
            shadow: 'none',
            text: '#F4F4F5',
            hoverBg: '#27272A',
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
