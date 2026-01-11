import {
    TokenInput,
    TokenOutput,
    SpacingTokens,
    SurfaceTokens,
    GeometryTokens,
    TypographyTokens,
    ShadowTokens
} from './types';

import { generateSpacing } from './generators/spacing';
import { generateSurface } from './generators/surface';
import { generateGeometry } from './generators/geometry';
import { generateTypography } from './generators/typography';
import { generateShadow } from './generators/shadow';

export class TokenEngine {

    /**
     * Resolve all tokens based on Input Context
     */
    static resolve(input: TokenInput): TokenOutput {
        return {
            spacing: this.resolveSpacing(input),
            surface: this.resolveSurface(input),
            geometry: this.resolveGeometry(input),
            typography: this.resolveTypography(input),
            shadow: this.resolveShadow(input),
        };
    }

    private static resolveSpacing(input: TokenInput): SpacingTokens {
        return generateSpacing(input);
    }

    private static resolveSurface(input: TokenInput): SurfaceTokens {
        return generateSurface(input);
    }

    private static resolveGeometry(input: TokenInput): GeometryTokens {
        return generateGeometry(input);
    }

    private static resolveTypography(input: TokenInput): TypographyTokens {
        return generateTypography(input);
    }

    private static resolveShadow(input: TokenInput): ShadowTokens {
        return generateShadow(input);
    }
}
