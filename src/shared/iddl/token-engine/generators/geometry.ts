import { TokenInput, GeometryTokens } from '../types';
import { RADIUS_MAP } from '../constants/maps';

export function generateGeometry(input: TokenInput): GeometryTokens {
    const {
        role,
        prominence = 'Standard',
        intent = 'Neutral',
        state = {}
    } = input;

    // 1. Radius
    const radius = RADIUS_MAP[role] || RADIUS_MAP['Default'];

    // 2. Border Logic - (v6.2: Minimal Surface Focus)
    let widthNum = 0;
    let color = 'border-transparent';

    const isAction = role === 'Button' || role === 'Action' || role === 'IconButton';
    const isContainer = role === 'Card' || role === 'Panel' || role === 'Modal';
    const isInput = role === 'Input' || role === 'TextField' || role === 'Select';

    // 3. Determine Width & Base Color
    if (prominence === 'Strong') {
        widthNum = isInput || isAction ? 1 : 0;
        color = 'border-border-default/50'; // Very light boundary if used
    } else if (prominence === 'Standard') {
        if (isInput) {
            widthNum = 1;
            color = 'border-border-muted/40';
        } else if (isContainer) {
            // Containers typically rely on background/shadow in minimal design
            widthNum = 0;
            color = 'border-transparent';
        }
    } else if (prominence === 'Hero') {
        widthNum = 0; // Solid fill focus
    }

    // 4. Intent Overrides (Only if border exists)
    if (intent !== 'Neutral' && widthNum > 0) {
        const opacity = '10'; // Keep it very subtle
        switch (intent) {
            case 'Brand': color = `border-primary/${opacity}`; break;
            case 'Positive': color = `border-success/${opacity}`; break;
            case 'Caution': color = `border-warning/${opacity}`; break;
            case 'Critical': color = `border-error/${opacity}`; break;
            case 'Info': color = `border-info/${opacity}`; break;
        }
    }

    // 5. State Overrides (Selection uses outline to avoid layout shift)
    let outline = 'outline-none';
    let outlineOffset = 'outline-offset-0';

    if (state.selected) {
        outline = 'outline outline-1 outline-primary/40';
        outlineOffset = 'outline-offset-[-1px]'; // Inset outline looks more integrated
    }

    // Map width number to class
    const width = {
        0: 'border-0',
        1: 'border',
        2: 'border-2',
        4: 'border-4'
    }[widthNum] || 'border-0';

    return {
        width,
        color,
        radius,
        outline,
        outlineOffset
    };
}
