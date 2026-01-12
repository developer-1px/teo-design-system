export type SectionRole =
  | 'Header'
  | 'Footer'
  | 'Main'
  | 'Sidebar'
  | 'Drawer'
  | 'Modal'
  | 'Navigation';

export type SectionType = 'Bar' | 'Rail' | 'Panel' | 'Stage' | 'Layer' | 'Float';

export type Role = string; // Broad string to allow extensibility, but practically 'Button', 'Card', etc.

export type Prominence = 'Hero' | 'Standard' | 'Strong' | 'Subtle' | 'Elevated' | 'None' | 'Hidden';
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
export type Density = 'Comfortable' | 'Standard' | 'Compact';

import type { SpaceCategory } from '@/components/dsl/Shared.types';

export interface TokenInput {
  role: Role;
  sectionRole?: string; // Optional because sometimes we just want element tokens
  pageRole?: string; // v6.3: Page Context Awareness
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
  roleMeta?: {
    separation?: 'none' | 'gap' | 'surface' | 'border';
  };
  context?: {
    ancestry?: {
      space?: SpaceCategory;
    };
  };
}

export interface SpacingTokens {
  padding: string; // e.g. "0.5rem 1rem"
  gap: string; // e.g. "0.5rem"
}

export interface SurfaceTokens {
  background: string;
  opacity: number;
  blur: string; // e.g. "backdrop-blur-md"
}

export interface GeometryTokens {
  width: string; // e.g. "border-2"
  color: string; // e.g. "border-primary"
  radius: string; // e.g. "rounded-lg"
  outline: string; // e.g. "outline-1 outline-primary"
  outlineOffset: string; // e.g. "outline-offset-2"
  overflow: string; // e.g. "overflow-visible" (default), "overflow-hidden" (explicit only)
}

export interface TypographyTokens {
  size: string;
  weight: string;
  lineHeight: string;
  tracking: string;
  color: string;
  fontFamily: string; // v6.4: Custom font families
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
  extraClasses?: string; // v6.5: For arbitrary premium styling (rings, insets, etc.)
}
