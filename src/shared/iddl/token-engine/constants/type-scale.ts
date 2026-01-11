import { SectionType } from '../types';

interface TypeScaleDefinition {
    scaleFactor: number;
    maxFontSize?: number; // px limit
}

export const TYPE_SCALE_DEFAULTS: TypeScaleDefinition = {
    scaleFactor: 1.0,
};

export const TYPE_SCALE_MAP: Record<SectionType, TypeScaleDefinition> = {
    Stage: { scaleFactor: 1.0 },       // Standard
    Panel: { scaleFactor: 0.9 },       // Slightly tighter
    Bar: { scaleFactor: 0.8 },         // Tight vertical constraint
    Rail: { scaleFactor: 0.7 },        // Very tight usage
    Layer: { scaleFactor: 1.0 },       // Modal/Dialog standard
    Float: { scaleFactor: 0.75 },      // Tooltip/Popover small
};

export function getTypeScale(type?: SectionType): TypeScaleDefinition {
    if (!type) return TYPE_SCALE_DEFAULTS;
    return TYPE_SCALE_MAP[type] ?? TYPE_SCALE_DEFAULTS;
}
