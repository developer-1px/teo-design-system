import { SectionType, Density } from '../types';

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
    Option: { x: 0.5, y: 0.25 },   // 8px 4px (Dense)

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
    Editor: 'bg-surface-base',
    ActivityBar: 'bg-surface-elevated',
    PrimarySidebar: 'bg-surface-sunken',
    SecondarySidebar: 'bg-surface-sunken',
    Sidebar: 'bg-surface-sunken',
    Nav: 'bg-surface-sunken',
    Aside: 'bg-surface-sunken',
    Navigator: 'bg-surface-sunken',
    ActivityBar: 'bg-surface-elevated',
    Panel: 'bg-surface-sunken',
    ControlPanel: 'bg-surface-base', // v4.2
    PropertyGrid: 'bg-transparent', // v4.2
    Footer: 'bg-surface-elevated',
    Header: 'bg-surface-elevated',
    Toolbar: 'bg-surface-elevated',
    Status: 'bg-primary text-text-inverse',
    UtilityBar: 'bg-surface-elevated',
    Card: 'bg-surface',
    Popover: 'bg-surface',
    Modal: 'bg-surface-raised',
    Toast: 'bg-surface-raised',
    DialogContent: 'bg-surface-raised',
    Button: 'bg-transparent',
    Action: 'bg-transparent',
    Option: 'bg-transparent', // v4.2
    FloatingToolbar: 'bg-surface-raised',
    SearchBar: 'bg-surface-sunken/40',
    FieldGroup: 'bg-transparent',
    Default: 'bg-surface'
};

// ==========================================
// 3. Geometry Constants (Radius & Layout Strategy)
// ==========================================

// Layout Strategy: Border roles (선으로 구분) vs Surface roles (면으로 구분)
export const BORDER_ROLES = [
    'Table', 'TableRow', 'TableCell',
    'List', 'ListItem',
    'Divider', 'Separator',
    'TabList', 'TabItem',
    'TreeView', 'TreeItem',
    'Grid', 'GridItem'
];

// Radius Ratio: padding × ratio = radius (for Surface Strategy roles)
// Higher ratio = more rounded corners relative to padding
export const RADIUS_RATIO: Record<string, number> = {
    // Highly rounded (ratio > 0.6)
    Button: 0.67,           // padding 12px → radius 8px
    Option: 0.5,            // Subtle radius
    Pill: 999,              // Full rounded
    Chip: 999,
    Badge: 999,

    // Moderately rounded (0.4 ~ 0.6)
    Card: 0.6,              // padding 20px → radius 12px
    Modal: 0.5,             // padding 32px → radius 16px
    DialogContent: 0.5,
    Popover: 0.5,
    Tooltip: 0.5,

    // Subtly rounded (0.3 ~ 0.4)
    Input: 0.5,             // padding 12px → radius 6px
    Select: 0.5,
    TextArea: 0.4,

    // Not rounded (0)
    Panel: 0,
    Bar: 0,
    Rail: 0,
    Stage: 0,

    Default: 0.5
};

// Legacy RADIUS_MAP (deprecated - will be replaced by dynamic calculation)
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
    Micro: { size: 'text-[10px]', weight: 'font-medium' }, // v4.2: For dense UI
    Default: { size: 'text-base', weight: 'font-normal' }
};
