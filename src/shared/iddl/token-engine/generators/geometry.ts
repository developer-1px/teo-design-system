import { TokenInput, GeometryTokens } from '../types';
import { RADIUS_RATIO, BASE_PADDING_MAP } from '../constants/maps';
import { getSeparationTier } from '../constants/strategies';

// Snapping algorithm: Round to nearest allowed Tailwind value
function snapToRadius(pxValue: number): string {
    if (pxValue >= 9999) return 'rounded-full';
    if (pxValue === 0) return 'rounded-none';

    // Tailwind radius values in px: 2, 4, 6, 8, 12, 16, 24
    const allowedValues = [0, 2, 4, 6, 8, 12, 16, 24];
    const snapped = allowedValues.reduce((prev, curr) =>
        Math.abs(curr - pxValue) < Math.abs(prev - pxValue) ? curr : prev
    );

    const radiusMap: Record<number, string> = {
        0: 'rounded-none',
        2: 'rounded-sm',    // 2px
        4: 'rounded',       // 4px
        6: 'rounded-md',    // 6px
        8: 'rounded-lg',    // 8px
        12: 'rounded-xl',   // 12px
        16: 'rounded-2xl',  // 16px
        24: 'rounded-3xl'   // 24px
    };

    return radiusMap[snapped] || 'rounded-md';
}

// Calculate dynamic radius based on padding
function calculateRadius(role: string, hasBackground: boolean): string {
    // If no background (Ghost/Border strategies), radius is often unnecessary or distracting
    // BUT for interactions (hover states), we sometimes want radius even on ghost buttons.
    // For now, let's keep radius logic consistent but allow "rounded-none" overrides.

    const ratio = RADIUS_RATIO[role] || RADIUS_RATIO['Default'];
    if (ratio === 0) return 'rounded-none';
    if (ratio >= 999) return 'rounded-full';

    // Get padding value
    const basePadding = BASE_PADDING_MAP[role] || BASE_PADDING_MAP['Default'];

    // Extract padding X value in rem, convert to px (assume 1rem = 16px)
    const paddingXRem = basePadding.x;
    const paddingXPx = paddingXRem * 16;

    // Calculate radius
    const radiusPx = paddingXPx * ratio;

    // Snap to allowed values
    return snapToRadius(radiusPx);
}

export function generateGeometry(input: TokenInput): GeometryTokens {
    const {
        role,
        prominence = 'Standard',
        intent = 'Neutral',
        state = {}
    } = input;

    const isInput = role === 'Input' || role === 'TextField' || role === 'Select' || role === 'TextArea';
    const tier = getSeparationTier(role, prominence, isInput);

    // 1. Border Logic (Determined by Tier)
    let widthNum = 0;
    let color = 'border-transparent';

    switch (tier) {
        case 'Level0': // Ghost
        case 'Level1': // Surface
        case 'Level3': // Elevated (Shadow replaces border)
            widthNum = 0;
            color = 'border-transparent';
            break;

        case 'Level2': // Outlined
            widthNum = 1;
            // Default border color
            color = 'border-border-default/60';
            break;
    }

    // Role-Specific Overrides for Border
    if (isInput) {
        // Inputs always have a border (Affordance) even if Level 2 logic covers it
        widthNum = 1;
        // Muted border for inputs to be less harsh
        color = 'border-border-muted/30';
    }

    // Intent Overrides for Border Color
    if (widthNum > 0 && intent !== 'Neutral') {
        const opacity = isInput ? '30' : '40';
        switch (intent) {
            case 'Brand': color = `border-primary/${opacity}`; break;
            case 'Positive': color = `border-success/${opacity}`; break;
            case 'Caution': color = `border-warning/${opacity}`; break;
            case 'Critical': color = `border-error/${opacity}`; break;
            case 'Info': color = `border-info/${opacity}`; break;
        }
    }

    // 2. Radius Logic
    // Only apply radius if there is a visual boundary (Bg or Border) OR it's an interactive element (Hover)
    const hasVisualBoundary = tier !== 'Level0' || state.hover;
    let radius = calculateRadius(role, hasVisualBoundary);

    // Force square if specifically requested (e.g. some bars)
    if (input.sectionType === 'Bar' || input.sectionType === 'Rail') {
        radius = 'rounded-none';
    }

    // 3. State Overrides (Selection uses outline to avoid layout shift)
    let outline = 'outline-none';
    let outlineOffset = 'outline-offset-0';

    if (state.selected) {
        outline = 'outline outline-1 outline-primary/40';
        outlineOffset = 'outline-offset-[-1px]'; // Inset outline looks more integrated
    }

    if (state.focus) {
        outline = 'outline outline-2 outline-primary/60';
        outlineOffset = 'outline-offset-2';
    }

    // 4. Page Context Specifics (v6.3 - Refined v6.5)
    // Application Mode: Needs slight structure for panels to avoid "too flat" look
    if (input.pageRole === 'Application') {
        const isStructural = role === 'Panel' || role === 'Sidebar' || role === 'ResizableHandle';
        if (isStructural) {
            // Force Level 2 (Subtle)
            widthNum = Math.max(widthNum, 1);
            color = 'border-border-default/30';
        }
    }

    // Immersive Mode: Glassy borders for containers
    if (input.pageRole === 'Immersive') {
        const isContainer = role === 'Card' || role === 'Panel' || role === 'Modal';
        if (isContainer && (tier === 'Level2' || tier === 'Level3')) {
            widthNum = 1;
            color = 'border-white/10';
        }
    }

    // 5. Overflow Control
    let overflow = 'overflow-visible';

    // Explicit overflow-hidden cases (exceptions only)
    const needsClipping = ['ImageCard', 'Avatar', 'MediaContainer'];
    if (needsClipping.includes(role)) {
        overflow = 'overflow-hidden';
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
        outlineOffset,
        overflow
    };
}
