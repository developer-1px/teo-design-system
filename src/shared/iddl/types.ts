export type Intent = 'Brand' | 'Critical' | 'Neutral' | 'Positive' | 'Caution' | 'Info';
export type Prominence = 'Hero' | 'Standard' | 'Subtle';
export type Density = 'Compact' | 'Standard' | 'Comfortable';
export type Role = 'Button' | 'Action' | 'Text' | 'Container' | 'Input' | 'Label';

export type InputType = 'text' | 'email' | 'url' | 'phone' | 'password' | 'number' | 'currency' | 'date' | 'datetime' | 'time' | 'color' | 'search';

// Strict Constraints Types
export type AllowedSpacing = '0' | '1' | '2' | '4' | '6' | '8' | '12';
export type AllowedFontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type AllowedRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface IDDLProps {
    role?: Role;
    intent?: Intent;
    prominence?: Prominence;
    density?: Density;
    className?: string; // Escape hatch
}

// Variant extras can be handled via Spec or intersection types
export interface ButtonSpec {
    variant?: 'solid' | 'outline' | 'ghost';
    icon?: boolean;
}

export interface InputSpec {
    type?: InputType;
    error?: boolean;
    disabled?: boolean;
    multiline?: boolean; // For Textarea
    rows?: number;
    readonly?: boolean;
}

export interface TextSpec {
    role?: 'Title' | 'Heading' | 'Body' | 'Label' | 'Caption';
    required?: boolean;
}
