import {
    TokenInput,
    TokenOutput,
    SpacingTokens,
    SurfaceTokens,
    BorderTokens,
    TypographyTokens,
    ShadowTokens
} from './types';
import { getRoleBase } from './constants/role-base';
import { getTypeScale } from './constants/type-scale';

export class TokenEngine {

    static resolve(input: TokenInput): TokenOutput {
        return {
            spacing: this.resolveSpacing(input),
            surface: this.resolveSurface(input),
            border: this.resolveBorder(input),
            typography: this.resolveTypography(input),
            shadow: this.resolveShadow(input),
        };
    }

    // ==========================================
    // 1. Spacing Algorithm
    // Formula: Base(Role) * Scale(Type) * Density * Prominence
    // ==========================================
    private static resolveSpacing(input: TokenInput): SpacingTokens {
        const { role, sectionType, prominence = 'Standard', density = 'Standard' } = input;

        // 1. Base Lookup
        const base = getRoleBase(role);

        // 2. Type Scale
        const typeScale = getTypeScale(sectionType);

        // 3. Density Multiplier
        const densityMap = { Comfortable: 1.25, Standard: 1.0, Compact: 0.75 };
        const densityMult = densityMap[density] ?? 1.0;

        // 4. Prominence Scale
        const prominenceMap = { Hero: 1.5, Standard: 1.0, Subtle: 0.75, Hidden: 0 };
        const prominenceMult = prominenceMap[prominence] ?? 1.0;

        // Calculation function
        const calc = (baseVal: number) => {
            const raw = baseVal * typeScale.scaleFactor * densityMult * prominenceMult;
            // Snap to 4px grid
            return Math.round(raw / 4) * 4;
        };

        return {
            padding: `${calc(base.basePaddingY)}px ${calc(base.basePaddingX)}px`,
            gap: `${calc(base.baseGap)}px`,
        };
    }

    // ==========================================
    // 2. Surface Algorithm
    // Formula: SectionRole + State + Intent
    // ==========================================
    private static resolveSurface(input: TokenInput): SurfaceTokens {
        const { sectionRole, state, intent = 'Neutral' } = input;

        // 1. Base Layer (Section Dependent)
        let color = 'bg-surface-0'; // Default
        if (sectionRole === 'Sidebar' || sectionRole === 'Header') color = 'bg-surface-1';
        if (sectionRole === 'Modal' || sectionRole === 'Popover') color = 'bg-surface-2';

        // 2. State Interaction (Simplified for MVP - typically handles alpha overlay)
        let opacity = 1.0;
        if (state?.disabled) opacity = 0.5;

        // 3. Intent Tint
        if (intent !== 'Neutral') {
            // In a real implementation, this would mix colors.
            // For class-based tailwind, we might change the class.
            // This is a placeholder for the logic.
        }

        return { background: color, opacity };
    }

    // ==========================================
    // 3. Border Algorithm
    // Formula: Structure(Role) || Focus(State)
    // ==========================================
    private static resolveBorder(input: TokenInput): BorderTokens {
        const { role, state, intent = 'Neutral' } = input;
        const base = getRoleBase(role);

        let width = 0;
        let color = 'border-transparent';

        // Default borders for specific roles
        if (role === 'Input' || role === 'Card' || role === 'Button') {
            width = 1;
            color = 'border-border-default';
        }

        // State overrides
        if (state?.focus) {
            width = 2;
            color = 'border-accent';
        } else if (state?.active) {
            color = 'border-border-active';
        }

        // Intent overrides
        if (intent === 'Critical') color = 'border-intent-critical';

        return {
            width,
            color,
            radius: `${base.baseRadius}px`,
        };
    }

    // ==========================================
    // 4. Typography Algorithm (Placeholder)
    // ==========================================
    private static resolveTypography(input: TokenInput): TypographyTokens {
        return {
            size: '14px',
            weight: '400',
            lineHeight: '1.5',
            color: 'text-text-primary',
        };
    }

    // ==========================================
    // 5. Shadow Algorithm (Placeholder)
    // ==========================================
    private static resolveShadow(input: TokenInput): ShadowTokens {
        return { boxShadow: 'none' };
    }
}
