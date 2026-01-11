import { TokenInput, ShadowTokens } from '../types';

/**
 * generateShadow - IDDL Shadow Generator (v6.0)
 * 
 * Shadow logic is tied to Role (Structural) and Prominence (Verticality).
 */
export function generateShadow(input: TokenInput): ShadowTokens {
    const {
        role,
        prominence = 'Standard',
        state = {}
    } = input;

    let boxShadow = 'shadow-none';

    const isFloating = role === 'Modal' || role === 'Popover' || role === 'Toast' || role === 'Drawer' || role === 'Menu' || role === 'Tooltip';
    const isContainer = role === 'Card' || role === 'Panel' || role === 'Section';
    const isAction = role === 'Button' || role === 'IconButton' || role === 'Chip';

    // 1. Floating Roles (Always have shadow)
    if (isFloating) {
        if (role === 'Modal' || role === 'Dialog') {
            boxShadow = 'shadow-soft-xl';
        } else {
            boxShadow = 'shadow-soft-lg';
        }
    }
    // 2. Containers (Prominence based)
    else if (isContainer) {
        if (prominence === 'Hero') {
            boxShadow = 'shadow-soft-xl';
        } else if (prominence === 'Strong') {
            boxShadow = 'shadow-soft-lg';
        } else if (prominence === 'Standard') {
            boxShadow = 'shadow-soft-md';
        }
    }
    // 3. Actions (Subtle feedback)
    else if (isAction) {
        if (prominence === 'Hero') {
            boxShadow = 'shadow-soft-md';
        }
    }

    // 4. State Overrides (Additive)
    if (state.hover && (isContainer || isAction) && !state.disabled) {
        // Boost shadow on hover for a tactile feel (Floating higher)
        if (prominence === 'Hero') {
            boxShadow = 'shadow-soft-xl hover:-translate-y-0.5 transition-transform';
        } else if (boxShadow === 'shadow-none') {
            boxShadow = 'shadow-soft-sm';
        } else if (boxShadow === 'shadow-soft-sm') {
            boxShadow = 'shadow-soft-md';
        } else if (boxShadow === 'shadow-soft-md') {
            boxShadow = 'shadow-soft-lg';
        }
    }

    return {
        boxShadow
    };
}
