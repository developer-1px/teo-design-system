import { TokenInput, SurfaceTokens } from '../types';
import { SURFACE_BASE_MAP } from '../constants/maps';

export function generateSurface(input: TokenInput): SurfaceTokens {
    const {
        role,
        prominence = 'Standard',
        intent = 'Neutral',
        state = {}
    } = input;

    // 1. Base Background from Map
    let background = SURFACE_BASE_MAP[role] || SURFACE_BASE_MAP['Default'];
    let opacity = 1.0;

    const isAction = role === 'Button' || role === 'Action' || role === 'IconButton' || role === 'Tab' || role === 'Chip';
    const isContainer = role === 'Card' || role === 'Panel' || role === 'Modal' || role === 'Tooltip' || role === 'Popover' || role === 'Alert' || role === 'Callout' || role === 'Stats' || role === 'Toolbar' || role === 'Form' || role === 'FloatingToolbar' || role === 'SearchBar' || role === 'FieldGroup' || role === 'NavigationMenu';

    // 2. Resolve Background by Prominence & Intent
    if (prominence === 'Hero') {
        if (isAction) {
            switch (intent) {
                case 'Brand': background = 'bg-primary text-white'; break;
                case 'Positive': background = 'bg-success text-white'; break;
                case 'Caution': background = 'bg-warning text-white'; break;
                case 'Critical': background = 'bg-error text-white'; break;
                case 'Info': background = 'bg-info text-white'; break;
                default: background = 'bg-slate-900 text-white';
            }
        } else if (isContainer) {
            background = 'bg-white shadow-soft-xl';
        } else {
            background = 'bg-transparent';
        }
    } else if (prominence === 'Strong') {
        if (isAction) {
            // Strong action - filled but subtle tint
            switch (intent) {
                case 'Brand': background = 'bg-primary/5 text-primary'; break;
                case 'Positive': background = 'bg-success/5 text-success'; break;
                case 'Caution': background = 'bg-warning/5 text-warning'; break;
                case 'Critical': background = 'bg-error/5 text-error'; break;
                case 'Info': background = 'bg-info/5 text-info'; break;
                default: background = 'bg-slate-100 text-slate-900';
            }
        } else if (isContainer) {
            background = 'bg-white shadow-soft-lg';
        } else {
            background = 'bg-transparent';
        }
    } else if (prominence === 'Standard') {
        if (isAction) {
            background = 'bg-transparent hover:bg-slate-50/80';
        } else {
            // Surface based definition
            background = isContainer ? (SURFACE_BASE_MAP[role] || 'bg-white') : 'bg-transparent';
        }
    } else if (prominence === 'Subtle') {
        background = 'bg-transparent';
    }

    // 3. State Interaction (v6.2: Minimal Feedback)
    if (state.hover && isAction && !state.disabled) {
        if (prominence === 'Standard' || prominence === 'Subtle') {
            background = 'bg-slate-100/50';
        } else if (prominence === 'Hero') {
            background = background.replace('bg-', 'bg-') + ' brightness-95'; // Subtle darkening
        }
    }

    // 4. Selected State (v6.2: Clean Surface Tint - Only for discrete elements)
    if (state.selected && prominence !== 'Hero') {
        if (isContainer || isAction) {
            background = 'bg-slate-100/80 text-slate-900';
        }
    }

    // 5. Blur (Glassmorphism)
    let blur = '';
    const isFloating = role === 'Modal' || role === 'Popover' || role === 'Toast' || role === 'Drawer';
    const isSpecialSection = input.sectionType === 'Bar' || input.sectionType === 'Float';

    if (isFloating || isSpecialSection) {
        blur = 'backdrop-blur-md';
    }

    return {
        background,
        opacity,
        blur
    };
}
