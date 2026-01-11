import { SectionType, Role, Prominence, Density, SectionRole } from '../types';

// ==========================================
// 1. Spacing Constants (rem based)
// ==========================================

export const BASE_GAP_MAP: Record<SectionType | string, number> = {
    Bar: 0.5,      // 8px
    Panel: 0.25,   // 4px
    Stage: 1.0,    // 16px
    Layer: 1.5,    // 24px
    Float: 0.5,    // 8px
    Rail: 0.25,    // 4px
    List: 0.125,   // 2px
    Form: 0.75,     // 12px
    Default: 0.5
};

export const BASE_PADDING_MAP: Record<string, { x: number, y: number }> = {
    // Action / Button - Spaced for Premium feel
    Button: { x: 1.0, y: 0.5 },    // 16px 8px
    IconButton: { x: 0.5, y: 0.5 }, // 8px 8px

    // Input
    Input: { x: 0.75, y: 0.625 },   // 12px 10px

    // Container
    Card: { x: 1.25, y: 1.25 },     // 20px
    Container: { x: 1.25, y: 1.25 },

    // Overlay
    Modal: { x: 2.0, y: 2.0 },      // 32px
    DialogContent: { x: 1.5, y: 1.5 },

    // List
    ListItem: { x: 0.75, y: 0.375 }, // 12px 6px

    // Fallback
    Default: { x: 1.0, y: 1.0 }
};

export const DENSITY_MULTIPLIER: Record<Density, number> = {
    Compact: 0.625,
    Standard: 1.0,
    Comfortable: 1.375
};

// ==========================================
// 2. Surface Constants
// ==========================================

export const SURFACE_BASE_MAP: Record<string, string> = {
    Canvas: 'bg-surface-base',
    Main: 'bg-surface-base',
    Sidebar: 'bg-surface-sunken',
    Panel: 'bg-surface-sunken',
    Card: 'bg-surface',
    Popover: 'bg-surface',
    Modal: 'bg-surface-raised',
    Toast: 'bg-surface-raised',
    DialogContent: 'bg-surface-raised',
    Button: 'bg-transparent',
    Action: 'bg-transparent',
    FloatingToolbar: 'bg-surface-raised',
    SearchBar: 'bg-surface-sunken/40',
    FieldGroup: 'bg-transparent',
    Default: 'bg-surface'
};

// ==========================================
// 3. Geometry Constants (Radius)
// ==========================================

export const RADIUS_MAP: Record<string, string> = {
    Button: 'rounded-lg',     // 8px - Modern
    Input: 'rounded-md',      // 6px

    Card: 'rounded-xl',       // 12px
    Modal: 'rounded-2xl',     // 16px
    DialogContent: 'rounded-2xl',

    Pill: 'rounded-full',
    Chip: 'rounded-full',

    Panel: 'rounded-none',
    Bar: 'rounded-none',

    Default: 'rounded-md'
};

// ==========================================
// 4. Typography Map
// ==========================================

export const TEXT_ROLE_MAP: Record<string, { size: string, weight: string }> = {
    Title: { size: 'text-2xl', weight: 'font-bold' },
    Heading: { size: 'text-lg', weight: 'font-semibold' },
    Body: { size: 'text-base', weight: 'font-normal' },
    Label: { size: 'text-sm', weight: 'font-medium' },
    Caption: { size: 'text-xs', weight: 'font-normal' },
    Default: { size: 'text-base', weight: 'font-normal' }
};
