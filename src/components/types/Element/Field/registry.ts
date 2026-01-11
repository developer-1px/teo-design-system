/**
 * Field Registry (Functional)
 *
 * Stores the mapping between Field Roles and their Renderer components.
 * This replaces the hardcoded switch statement in Field.tsx.
 */

import type { ComponentType } from 'react';
import type { FieldProps } from './Field.types';

// Internal storage
const fieldRenderers = new Map<string, ComponentType<FieldProps>>();

/**
 * Register a field renderer for a specific role.
 * @param role - The IDDL Role (e.g., 'Textbox', 'Select')
 * @param component - The React component to render
 */
export function registerField(role: string, component: ComponentType<FieldProps>) {
    if (fieldRenderers.has(role)) {
        // Warn in development if overwriting (might be intentional for overrides, but good to know)
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[FieldRegistry] Overwriting renderer for role "${role}"`);
        }
    }
    fieldRenderers.set(role, component);
}

/**
 * Get the renderer for a specific role.
 * @param role - The IDDL Role
 * @returns The component or undefined
 */
export function getFieldRenderer(role: string): ComponentType<FieldProps> | undefined {
    return fieldRenderers.get(role);
}

/**
 * Get all registered roles (useful for debugging or listing available fields)
 */
export function getRegisteredRoles(): string[] {
    return Array.from(fieldRenderers.keys());
}
