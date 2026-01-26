import { vars as dsVars } from "../design-system/theme.css";

// Compatibility Adapter
// Maps legacy "ui/theme.css" tokens to the new "design-system/theme.css" structure.
// This ensures existing components continue to work while we transition to the new system.

export const vars = {
    space: dsVars.space,
    radius: dsVars.radius,
    font: dsVars.font,
    // Map legacy 'shadow' to new 'elevation'
    shadow: dsVars.elevation,

    // Map legacy flat color structure to new nested structure
    color: {
        primary: dsVars.color.surface.primary,
        background: dsVars.color.surface.page,
        surface: dsVars.color.surface.panel, // Mapping 'surface' to 'panel' for general containers
        text: dsVars.color.text.primary,
        textSecondary: dsVars.color.text.secondary,
        textTertiary: dsVars.color.text.tertiary,
        textInverse: dsVars.color.text.inverse,
        border: dsVars.color.border.default,
        overlay: dsVars.color.surface.overlay,
        warning: dsVars.color.tone.warning.border,
        // Add any missing specific mappings as discovered
    }
};
