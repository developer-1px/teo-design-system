import { createThemeContract } from '@vanilla-extract/css';

// Theme Contract — shape만 정의 (null values)
// 모든 프로젝트에서 동일한 구조를 공유합니다.
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
        full: null,
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
        sidebar: {
            width: null,
            collapsedWidth: null,
        },
        header: {
            height: null,
        },
        item: {
            dense: null,
            compact: null,
            standard: null,
            medium: null,
            large: null,
            touch: null,
        }
    }
});
