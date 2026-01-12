import { TokenInput, ShadowTokens } from '../types';
import { getSeparationTier } from '../constants/strategies';

/**
 * generateShadow - IDDL Shadow Generator (v6.0)
 * 
 * Shadow logic is tied to Separation Tier.
 * Level 3 (Elevated) is the primary user of shadows.
 */
export function generateShadow(input: TokenInput): ShadowTokens {
    const {
        role,
        prominence = 'Standard',
        state = {}
    } = input;

    const isInput = role === 'Input' || role === 'TextField' || role === 'Select' || role === 'TextArea';
    const tier = getSeparationTier(role, prominence, isInput);

    let boxShadow = 'shadow-none';

    // 1. Base Shadow Logic via Tier
    switch (tier) {
        case 'Level0': // Ghost
        case 'Level1': // Surface
        case 'Level2': // Outlined
            // Minimalist Design: Avoid shadows for standard separation
            boxShadow = 'shadow-none';
            break;

        case 'Level3': // Elevated
            // Hero/Elevated elements get shadows for lift
            if (prominence === 'Hero') {
                boxShadow = 'shadow-soft-xl';
            } else {
                boxShadow = 'shadow-soft-lg';
            }
            break;
    }

    // 2. Role Specific Overrides
    const isFloating = role === 'Modal' || role === 'Popover' || role === 'Toast' || role === 'Drawer' || role === 'Menu' || role === 'Tooltip';

    if (isFloating) {
        // Floating elements always need shadows regardless of tier (unless overridden)
        if (role === 'Modal' || role === 'Dialog') {
            boxShadow = 'shadow-soft-xl';
        } else {
            boxShadow = 'shadow-soft-lg';
        }
    }

    // 3. State Overrides (Additive interaction feedback)
    const isAction = role === 'Button' || role === 'IconButton' || role === 'Card'; // Cards can be interactive

    if (state.hover && isAction && !state.disabled) {
        // Hover often lifts the element slightly even for lower tiers
        if (prominence === 'Hero' || tier === 'Level3') {
            boxShadow = 'shadow-[0_20px_40px_-5px_rgba(0,0,0,0.15),0_10px_20px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300';
        } else if (tier === 'Level1' || tier === 'Level2') {
            // Subtle lift for clickable surfaces/outlines
            boxShadow = 'shadow-sm';
        }
    }

    // 4. Page Context Specifics
    if (input.pageRole === 'Focus') {
        // Focus mode emphasizes current active container
        if (tier === 'Level3') {
            boxShadow = 'shadow-2xl';
        }
    }

    if (input.pageRole === 'Immersive') {
        const isContainer = role === 'Card' || role === 'Panel';
        if (isContainer && tier === 'Level3') {
            boxShadow = 'shadow-[0_0_30px_rgba(255,255,255,0.05)]'; // Subtle glow instead of heavy shadow
        }
    }

    return {
        boxShadow
    };
}
