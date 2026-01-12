/**
 * Token Engine v2.0 Integration Tests
 *
 * Verifies that the 3-Stage Pipeline works according to spec
 */

import {
  resolveColorStage,
  resolveFormStage,
  resolveIDDL,
  resolveToneStage,
} from '../resolver-logic';
import { TokenEngine } from '../TokenEngine';
import type { IDDLContext, TokenInput } from '../types';

describe('Token Engine v2.0', () => {
  // Helper: Create minimal context
  const createContext = (overrides?: Partial<IDDLContext>): IDDLContext => ({
    ancestry: {
      space: 'surface',
      depth: 0,
      parentZLevel: 0,
    },
    siblings: {
      count: 1,
      index: 0,
      isFirst: true,
      isLast: true,
      isOnly: true,
    },
    inheritance: {
      effectiveDensity: 'Standard',
    },
    state: {
      interaction: 'default',
      selection: 'unselected',
      validity: 'valid',
    },
    relationship: {
      toPrevious: 'related',
      toNext: 'related',
    },
    layout: {
      parentFlow: 'vertical',
      selfFlow: 'leaf',
    },
    ...overrides,
  });

  describe('Stage 1: Form', () => {
    test('Scale = f(Space, Prominence, Depth)', () => {
      const input: TokenInput = {
        role: 'Button',
        prominence: 'Hero',
      };

      const context = createContext({
        ancestry: {
          space: 'surface',
          depth: 0,
          parentZLevel: 0,
        },
      });

      const { scale } = resolveFormStage(input, context);

      // surface base = scale.md (index 3)
      // Hero offset = +1
      // depth 0 penalty = 0
      // Expected: scale.lg (index 4)
      expect(scale).toBe('scale.lg');
    });

    test('Gap = f(Relationship, Density, Space)', () => {
      const input: TokenInput = {
        role: 'Container',
        density: 'Comfortable',
      };

      const context = createContext({
        inheritance: { effectiveDensity: 'Comfortable' },
        relationship: { toPrevious: 'grouped', toNext: 'grouped' },
        ancestry: { space: 'canvas', depth: 0, parentZLevel: 0 },
      });

      const { gap } = resolveFormStage(input, context);

      // grouped base = space.sm (index 3)
      // Comfortable = 1.5×
      // canvas = 1.25×
      // 3 * 1.5 * 1.25 = 5.625 → 6 → space.lg
      expect(gap).toBe('space.lg');
    });

    test('Depth Attenuation', () => {
      const input: TokenInput = {
        role: 'Text',
        prominence: 'Standard',
      };

      // Shallow depth
      const shallowContext = createContext({
        ancestry: { space: 'surface', depth: 0, parentZLevel: 0 },
      });
      const { scale: shallowScale } = resolveFormStage(input, shallowContext);

      // Deep depth
      const deepContext = createContext({
        ancestry: { space: 'surface', depth: 4, parentZLevel: 0 },
      });
      const { scale: deepScale } = resolveFormStage(input, deepContext);

      // Deep should be smaller (depth 4 = -2 penalty)
      const scaleSteps = ['scale.2xs', 'scale.xs', 'scale.sm', 'scale.md', 'scale.lg'];
      const shallowIndex = scaleSteps.indexOf(shallowScale);
      const deepIndex = scaleSteps.indexOf(deepScale);

      expect(deepIndex).toBeLessThan(shallowIndex);
    });
  });

  describe('Stage 2: Tone', () => {
    test('Space → Surface Strategy', () => {
      const contexts = [
        { space: 'canvas', expected: 'surface.base' },
        { space: 'surface', expected: 'surface.raised' },
        { space: 'float', expected: 'surface.overlay' },
        { space: 'well', expected: 'surface.sunken' },
      ] as const;

      contexts.forEach(({ space, expected }) => {
        const input: TokenInput = { role: 'Container' };
        const context = createContext({
          ancestry: { space, depth: 0, parentZLevel: 0 },
        });

        const { surface } = resolveToneStage(input, context);
        expect(surface).toBe(expected);
      });
    });

    test('Space → Shadow', () => {
      const input: TokenInput = { role: 'Card' };

      const surfaceContext = createContext({
        ancestry: { space: 'surface', depth: 0, parentZLevel: 0 },
      });
      const { shadow: surfaceShadow } = resolveToneStage(input, surfaceContext);
      expect(surfaceShadow).toBe('shadow.subtle');

      const floatContext = createContext({
        ancestry: { space: 'float', depth: 0, parentZLevel: 0 },
      });
      const { shadow: floatShadow } = resolveToneStage(input, floatContext);
      expect(floatShadow).toBe('shadow.float');
    });

    test('Z-Level Accumulation', () => {
      const input: TokenInput = { role: 'Modal' };

      const context = createContext({
        ancestry: { space: 'float', depth: 0, parentZLevel: 2 },
      });

      const { shadow } = resolveToneStage(input, context);

      // parentZLevel 2 + float space (+1) = 3 → shadow.modal
      expect(shadow).toBe('shadow.modal');
    });

    test('Border Position (Bar/Rail)', () => {
      const barInput: TokenInput = { role: 'Header' };
      const barContext = createContext({
        ancestry: { space: 'bar', depth: 0, parentZLevel: 0 },
      });
      const { border: barBorder } = resolveToneStage(barInput, barContext);
      expect(barBorder.position).toBe('bottom');

      const railInput: TokenInput = { role: 'Sidebar' };
      const railContext = createContext({
        ancestry: { space: 'rail', depth: 0, parentZLevel: 0 },
      });
      const { border: railBorder } = resolveToneStage(railInput, railContext);
      expect(railBorder.position).toBe('right');
    });
  });

  describe('Stage 3: Color', () => {
    test('Intent + Prominence → Surface & Color', () => {
      const input: TokenInput = {
        role: 'Button',
        prominence: 'Hero',
        intent: 'Brand',
      };

      const context = createContext();

      const { surface, color } = resolveColorStage(input, context, 'surface.raised');

      // Hero + Brand = solid brand background + on-brand text
      expect(surface).toBe('intent.brand.default');
      expect(color).toBe('content.on-brand');
    });

    test('State Priority: Selection > Validity > Interaction', () => {
      const input: TokenInput = {
        role: 'Button',
        prominence: 'Standard',
        intent: 'Neutral',
      };

      // Priority 1: Selection
      const selectedContext = createContext({
        state: {
          interaction: 'hover',
          selection: 'selected',
          validity: 'valid',
        },
      });
      const { surface: selectedSurface } = resolveColorStage(
        input,
        selectedContext,
        'surface.raised'
      );
      expect(selectedSurface).toBe('surface.selected');

      // Priority 2: Validity (overrides hover)
      const invalidContext = createContext({
        state: {
          interaction: 'hover',
          selection: 'unselected',
          validity: 'invalid',
        },
      });
      const { surface: invalidSurface } = resolveColorStage(
        input,
        invalidContext,
        'surface.raised'
      );
      expect(invalidSurface).toBe('intent.critical.subtle');

      // Priority 3: Interaction (only if no selection/validity)
      const hoverContext = createContext({
        state: {
          interaction: 'hover',
          selection: 'unselected',
          validity: 'valid',
        },
      });
      const { surface: hoverSurface } = resolveColorStage(input, hoverContext, 'surface.raised');
      expect(hoverSurface).toBe('surface.hover');
    });

    test('Disabled State (Final Override)', () => {
      const input: TokenInput = {
        role: 'Button',
        prominence: 'Hero',
        intent: 'Brand',
      };

      const context = createContext({
        state: {
          interaction: 'disabled',
          selection: 'selected',
          validity: 'invalid',
        },
      });

      const { surface, color } = resolveColorStage(input, context, 'intent.brand.default');

      // Disabled overrides everything
      expect(surface).toBe('surface.disabled');
      expect(color).toBe('content.disabled');
    });
  });

  describe('Full Pipeline Integration', () => {
    test('Hero Brand Button in Surface Space', () => {
      const input: TokenInput = {
        role: 'Button',
        prominence: 'Hero',
        intent: 'Brand',
        density: 'Standard',
        context: {
          ancestry: { space: 'surface', depth: 2, parentZLevel: 0 },
        },
      };

      const output = TokenEngine.resolve(input);

      // Form Stage: scale should be md+1 = lg
      expect(output.fontSize).toBe('text-lg');

      // Tone Stage: surface space → shadow.subtle (but Hero might elevate)
      expect(output.boxShadow).toContain('shadow');

      // Color Stage: Hero + Brand = solid background
      expect(output.background).toContain('primary');
      expect(output.color).toContain('primary-foreground');
    });

    test('Subtle Text in Canvas', () => {
      const input: TokenInput = {
        role: 'Text',
        prominence: 'Subtle',
        intent: 'Neutral',
        context: {
          ancestry: { space: 'canvas', depth: 3, parentZLevel: 0 },
        },
      };

      const output = TokenEngine.resolve(input);

      // Form: canvas base = lg, subtle = -1, depth 3 = -1 → lg-2 = sm
      expect(output.fontSize).toBe('text-sm');

      // Tone: Subtle prominence → transparent surface
      expect(output.background).toBe('bg-transparent');

      // Color: Subtle + Neutral → subtle text color
      expect(output.color).toContain('subtle');
    });

    test('Invalid Input in Well Space', () => {
      const input: TokenInput = {
        role: 'Input',
        prominence: 'Standard',
        intent: 'Neutral',
        context: {
          ancestry: { space: 'well', depth: 0, parentZLevel: 0 },
          state: { interaction: 'default', selection: 'unselected', validity: 'invalid' },
        },
      };

      const output = TokenEngine.resolve(input);

      // Color Stage: Invalid → critical intent
      expect(output.background).toContain('destructive');
      expect(output.color).toContain('destructive');
    });
  });

  describe('Cache', () => {
    test('Cache Hit Performance', () => {
      const input: TokenInput = {
        role: 'Button',
        prominence: 'Standard',
      };

      // First call (cache miss)
      const start1 = performance.now();
      const output1 = TokenEngine.resolve(input);
      const duration1 = performance.now() - start1;

      // Second call (cache hit)
      const start2 = performance.now();
      const output2 = TokenEngine.resolve(input);
      const duration2 = performance.now() - start2;

      // Cache hit should be faster
      expect(duration2).toBeLessThan(duration1);

      // Output should be identical
      expect(output2).toEqual(output1);
    });

    test('Cache Clear', () => {
      TokenEngine.resolve({ role: 'Button' });

      const statsBefore = TokenEngine.getCacheStats();
      expect(statsBefore.size).toBeGreaterThan(0);

      TokenEngine.clearCache();

      const statsAfter = TokenEngine.getCacheStats();
      expect(statsAfter.size).toBe(0);
    });
  });
});
