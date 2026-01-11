import { TokenInput, TypographyTokens } from '../types';
import { TEXT_ROLE_MAP } from '../constants/maps';

export function generateTypography(input: TokenInput): TypographyTokens {
    const {
        role,
        prominence = 'Standard',
        intent = 'Neutral',
        state = {}
    } = input;

    // 1. Base Typography
    const base = TEXT_ROLE_MAP[role] || TEXT_ROLE_MAP['Default'];

    // 2. Size & Weight Adjustments
    let { size, weight } = base;

    if (prominence === 'Hero') {
        if (role === 'Title') size = 'text-4xl';
        if (role === 'Heading') size = 'text-2xl';
        weight = 'font-bold';
    } else if (prominence === 'Strong') {
        weight = 'font-semibold';
    }

    // 3. Color Logic
    let color = 'text-text'; // default semantic color

    if (prominence === 'Subtle') {
        color = 'text-text-muted';
    } else if (prominence === 'Hero' && (role === 'Button' || role === 'Action' || role === 'IconButton')) {
        // Hero Actions have solid backgrounds, so they need inverse text
        color = 'text-white';
    } else if (intent !== 'Neutral') {
        switch (intent) {
            case 'Brand': color = 'text-primary'; break;
            case 'Positive': color = 'text-success'; break;
            case 'Caution': color = 'text-warning'; break;
            case 'Critical': color = 'text-error'; break;
            case 'Info': color = 'text-info'; break;
        }
    }

    if (state.disabled) {
        color = 'text-text-subtle opacity-50';
    }

    return {
        size,
        weight,
        lineHeight: 'leading-normal',
        color
    };
}
