import { TokenInput, SurfaceTokens } from '../types';
import { SURFACE_BASE_MAP } from '../constants/maps';
import { getSeparationTier } from '../constants/strategies';

export function generateSurface(input: TokenInput): SurfaceTokens {
    const {
        role,
        prominence = 'Standard',
        intent = 'Neutral',
        state = {}
    } = input;

    const isInput = role === 'Input' || role === 'TextField' || role === 'Select' || role === 'TextArea';
    const tier = getSeparationTier(role, prominence, isInput);

    // 1. Determine Background based on Tier
    let background = 'bg-transparent';
    let opacity = 1.0;

    switch (tier) {
        case 'Level0': // Ghost
            background = 'bg-transparent';
            break;

        case 'Level1': // Surface (Standard)
        case 'Level2': // Outlined (Strong) - Hybrid: Can have bg or be transparent
        case 'Level3': // Elevated (Hero)
            // Resolve base background
            if (SURFACE_BASE_MAP[role]) {
                background = SURFACE_BASE_MAP[role];
            } else {
                // Default fallback
                background = 'bg-surface';
            }
            break;
    }

    // 2. Role/Intent Specific Overrides (Logic retained from original but simplified via Tier)
    const isAction = role === 'Button' || role === 'Action' || role === 'IconButton' || role === 'Tab' || role === 'Chip';

    if (isAction) {
        if (tier === 'Level3' || (prominence === 'Hero')) { // Hero Action
            switch (intent) {
                case 'Brand': background = 'bg-primary text-text-inverse'; break;
                case 'Positive': background = 'bg-success text-text-inverse'; break;
                case 'Caution': background = 'bg-warning text-text-inverse'; break;
                case 'Critical': background = 'bg-error text-text-inverse'; break;
                case 'Info': background = 'bg-info text-text-inverse'; break;
                default: background = 'bg-primary-emphasis text-text-inverse';
            }
        } else if (tier === 'Level2') { // Outlined Action
            // Usually transparent with border, but can have subtle fill
            background = 'bg-transparent'; // Strict Outline
            // Optional: if designer wants "filled outline", change here.
        } else if (tier === 'Level1') { // Standard Action (Secondary)
            background = 'bg-secondary/50 hover:bg-secondary';
        } else { // Level 0 (Ghost)
            background = 'bg-transparent hover:bg-hover';
        }
    }

    // 3. State Overrides
    if (state.hover && !state.disabled) {
        if (tier === 'Level0') {
            background = 'bg-hover';
        } else if (tier === 'Level1' || tier === 'Level2') {
            // Darken slightly
            // Note: Tailwind doesn't strictly support "bg-surface + darken", usually controlled via component hover classes
            // We'll rely on component-level `hover:bg-surface-raised` or similar if needed, 
            // but for Token Engine we might return a static hover token? 
            // Current engine returns static classes.
        }
    }

    if (state.selected) {
        background = 'bg-active text-text';
    }

    // 4. Blur & Context Overrides (Retained)
    let blur = '';
    const isFloating = role === 'Modal' || role === 'Popover' || role === 'Toast' || role === 'Drawer';
    const isSpecialSection = input.sectionType === 'Bar' || input.sectionType === 'Float';

    if (isFloating || isSpecialSection) {
        blur = 'backdrop-blur-md';
    }

    // Immersive Mode
    if (input.pageRole === 'Immersive') {
        if (role === 'Page' || role === 'Immersive') {
            background = 'bg-slate-950 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.15),transparent_50%)] before:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.1),transparent_50%)] after:pointer-events-none';
        }
        // Transparent sections
        else if (role === 'Main' || role === 'Header' || role === 'Footer' || role === 'Section') {
            background = 'bg-transparent';
        }
        else if (isAction && prominence === 'Standard') {
            background = 'bg-white/5 hover:bg-white/10 text-white transition-colors duration-200';
        }
    }

    // Paper Mode
    if (input.pageRole === 'Paper' && role === 'Page') {
        background = 'bg-[#fcfaf7]';
    }

    return {
        background,
        opacity,
        blur
    };
}
