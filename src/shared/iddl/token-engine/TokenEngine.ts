import { generateGeometry } from './generators/geometry';
import { generateShadow } from './generators/shadow';
import { generateSpacing } from './generators/spacing';
import { generateSurface } from './generators/surface';
import { generateTypography } from './generators/typography';
import type {
  GeometryTokens,
  ShadowTokens,
  SpacingTokens,
  SurfaceTokens,
  TokenInput,
  TokenOutput,
  TypographyTokens,
} from './types';

// LRU Cache Implementation
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private readonly maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    if (value === undefined) return undefined;

    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    // Remove if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Evict oldest if over capacity
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

export class TokenEngine {
  // Cache with 100 item limit
  private static cache = new LRUCache<string, TokenOutput>(100);

  /**
   * Generate cache key from input
   */
  private static getCacheKey(input: TokenInput): string {
    // Serialize input to deterministic string
    // Only include relevant fields (exclude functions, undefined values)
    const key = {
      role: input.role,
      sectionRole: input.sectionRole,
      pageRole: input.pageRole,
      sectionType: input.sectionType,
      prominence: input.prominence,
      intent: input.intent,
      density: input.density,
      state: input.state,
    };
    return JSON.stringify(key);
  }

  /**
   * Clear cache (useful for testing or theme changes)
   */
  static clearCache(): void {
    TokenEngine.cache.clear();
  }

  /**
   * Get cache stats (for debugging)
   */
  static getCacheStats(): { size: number; maxSize: number } {
    return { size: TokenEngine.cache.size, maxSize: 100 };
  }

  /**
   * Resolve all tokens based on Input Context (with caching)
   */
  static resolve(input: TokenInput): TokenOutput {
    // Check cache first
    const cacheKey = TokenEngine.getCacheKey(input);
    const cached = TokenEngine.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate tokens
    const output: TokenOutput = {
      spacing: TokenEngine.resolveSpacing(input),
      surface: TokenEngine.resolveSurface(input),
      geometry: TokenEngine.resolveGeometry(input),
      typography: TokenEngine.resolveTypography(input),
      shadow: TokenEngine.resolveShadow(input),
      extraClasses: TokenEngine.resolveExtraClasses(input),
    };

    // Store in cache
    TokenEngine.cache.set(cacheKey, output);

    return output;
  }

  private static resolveExtraClasses(input: TokenInput): string {
    const classes: string[] = [];
    const { role, prominence, pageRole } = input;

    // 1. All premium elements get smooth hardware-accelerated transitions
    classes.push('transition-all duration-200 ease-out transform-gpu');

    // 2. High-end subtle inner highlight for Strong/Hero containers
    if (prominence === 'Strong' || prominence === 'Hero') {
      if (role === 'Card' || role === 'Panel' || role === 'Modal' || role === 'Button') {
        classes.push('ring-1 ring-inset ring-white/10 dark:ring-white/5');
      }
    }

    // 3. Page Role specific polish
    if (pageRole === 'Immersive') {
      classes.push('selection:bg-primary/30 selection:text-white');
    }

    if (pageRole === 'Focus') {
      classes.push('tracking-tight');
    }

    return classes.join(' ');
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
