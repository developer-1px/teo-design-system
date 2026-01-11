export type SectionRole =
    | 'Header' | 'Footer' | 'Main' | 'Sidebar' | 'Drawer' | 'Modal' | 'Navigation';

export type SectionType =
    | 'Bar' | 'Rail' | 'Panel' | 'Stage' | 'Layer' | 'Float';

export type Role = string; // Broad string to allow extensibility, but practically 'Button', 'Card', etc.

export type Prominence = 'Hero' | 'Standard' | 'Subtle' | 'Hidden';
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Density = 'Comfortable' | 'Standard' | 'Compact';

export interface TokenInput {
    role: Role;
    sectionRole?: string; // Optional because sometimes we just want element tokens
    sectionType?: SectionType;
    prominence?: Prominence;
    intent?: Intent;
    density?: Density;
    state?: {
        hover?: boolean;
        active?: boolean;
        focus?: boolean;
        selected?: boolean;
        disabled?: boolean;
    };
}

export interface SpacingTokens {
    padding: string; // e.g. "0.5rem 1rem"
    gap: string;     // e.g. "0.5rem"
}

export interface SurfaceTokens {
    background: string;
    opacity: number;
    blur: string; // e.g. "backdrop-blur-md"
}

export interface GeometryTokens {
    width: string;  // e.g. "border-2"
    color: string;  // e.g. "border-primary"
    radius: string; // e.g. "rounded-lg"
    outline: string; // e.g. "outline-1 outline-primary"
    outlineOffset: string; // e.g. "outline-offset-2"
}

export interface TypographyTokens {
    size: string;
    weight: string;
    lineHeight: string;
    color: string;
}

export interface ShadowTokens {
    boxShadow: string;
}

export interface TokenOutput {
    spacing: SpacingTokens;
    surface: SurfaceTokens;
    geometry: GeometryTokens;
    typography: TypographyTokens;
    shadow: ShadowTokens;
}
