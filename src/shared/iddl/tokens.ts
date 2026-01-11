import { Intent, Prominence, AllowedSpacing, AllowedFontSize, AllowedRadius } from './types';

// Strict Token Definitions
export const IDDL_SPACING: Record<AllowedSpacing, string> = {
    '0': '0px',
    '1': '4px',
    '2': '8px',
    '4': '16px',
    '6': '24px',
    '8': '32px',
    '12': '48px',
};

export const IDDL_FONT_SIZE: Record<AllowedFontSize, string> = {
    'xs': '10px',
    'sm': '12px',
    'base': '14px',
    'lg': '18px',
    'xl': '20px',
};

export const IDDL_RADIUS: Record<AllowedRadius, string> = {
    'none': '0px',
    'sm': '4px',
    'md': '8px',
    'lg': '12px',
    'full': '9999px',
};

// Intent Colors Mapping (Abstract -> Concrete Semantic Tokens)
// We use semantic classes (bg-primary, bg-error) to enable global theming via CSS variables.
export const INTENT_COLOR_MAP: Record<Intent, Record<Prominence, { bg: string; text: string; border?: string; hover?: string }>> = {
    Brand: {
        Hero: { bg: 'bg-primary', text: 'text-white', hover: 'hover:bg-primary-hover' },
        Standard: { bg: 'bg-primary', text: 'text-white', hover: 'hover:bg-primary-hover' },
        Subtle: { bg: 'bg-primary-subtle', text: 'text-primary', hover: 'hover:bg-primary/20' },
    },
    Critical: {
        Hero: { bg: 'bg-error', text: 'text-white', hover: 'hover:bg-error-hover' },
        Standard: { bg: 'bg-error', text: 'text-white', hover: 'hover:bg-error-hover' },
        Subtle: { bg: 'bg-red-50', text: 'text-error', hover: 'hover:bg-red-100' },
    },
    Neutral: {
        Hero: { bg: 'bg-gray-900', text: 'text-white', hover: 'hover:bg-gray-800' },
        Standard: { bg: 'bg-surface', text: 'text-text', border: 'border-default', hover: 'hover:bg-gray-50' },
        Subtle: { bg: 'bg-transparent', text: 'text-muted', hover: 'hover:bg-gray-100' },
    },
    Positive: { // Semantic: Success
        Hero: { bg: 'bg-success', text: 'text-white', hover: 'hover:bg-success-hover' },
        Standard: { bg: 'bg-success', text: 'text-white', hover: 'hover:bg-success-hover' },
        Subtle: { bg: 'bg-green-50', text: 'text-success', hover: 'hover:bg-green-100' },
    },
    Caution: { // Semantic: Warning
        Hero: { bg: 'bg-warning', text: 'text-white', hover: 'hover:bg-warning-hover' },
        Standard: { bg: 'bg-warning', text: 'text-white', hover: 'hover:bg-warning-hover' },
        Subtle: { bg: 'bg-amber-50', text: 'text-warning', hover: 'hover:bg-amber-100' },
    },
    Info: { // Semantic: Info
        Hero: { bg: 'bg-info', text: 'text-white', hover: 'hover:bg-info-hover' },
        Standard: { bg: 'bg-info', text: 'text-white', hover: 'hover:bg-info-hover' },
        Subtle: { bg: 'bg-sky-50', text: 'text-info', hover: 'hover:bg-sky-100' },
    },
};
