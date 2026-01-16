# Design System Analysis Report

## 1. Executive Summary

The **Minimal Design Kit** is evolving from a flexible, CSS-in-JS style system into a **strict, constraint-based design system**.

The core philosophy has shifted to **"Enforcement by Code"**:
- **`Frame.tsx`** now actively **blocks** developers from using arbitrary CSS values (like `margin: "10px"` or `width: "50%"`).
- **`token.const.1tier.ts`** uses **Branded Types** to ensure that only valid design tokens can be passed to these properties at the TypeScript level.

This transition aims to eliminate "magic numbers," ensure pixel-perfect consistency across the application, and reduce technical debt by centralizing all visual decisions into the token registry.

---

## 2. Component Analysis: `Frame.tsx`

`Frame` is not just a UI component; it is the **gatekeeper** of the design system. It is the fundamental building block for all layouts.

### Key Mechanism: The "Blocker"
Recent changes (observed in Git history) have introduced a filtering mechanism that strips "dangerous" properties from the `style` prop.

```typescript
// Frame.tsx (Simplified Logic)
const {
  width, height, margin, padding, gap, opacity, borderRadius, ...safeUserStyle
} = props.style;

// outcome: 'safeUserStyle' no longer contains these properties.
// Developers MUST use the dedicated props (w, h, p, gap) which enforce tokens.
```

### Recent Evolutions (Git History)
1.  **Block Sizing**: `width`, `height`, `min/max` dimensions are now filtered out.
2.  **Block Spacing**: `margin` has been blocked to force the use of `gap` (for layouts) or explicit `Divider` components. `padding` is blocked to enforce `p` props.
3.  **Block Visuals**: `opacity`, `borderRadius` (`rounded`), and `boxShadow` are blocked to enforce their respective tokens.

### Design Intent
- **Layouts**: Move away from `margin` (external spacing) towards `gap` (internal spacing) and Flex/Grid patterns.
- **Visuals**: Ensure every radius, shadow, and opacity level comes from the system.

---

## 3. Token System Analysis: `token.const.1tier.ts`

The "1-Tier" token system indicates a **flat, numeric scale** designed for speed and precision.

### Type Safety (Branded Types)
The system uses a sophisticated TypeScript pattern to prevent accidental usage of raw numbers.

```typescript
// Enforced by TypeScript
px(Space.n8); // ✅ Valid
px(8);        // ❌ Compiler Error: number is not assignable to SpaceToken
```

### Token Categories
- **Space**: Linear scale (2, 4, 8... 160) for padding/gap.
- **Sizes**: Combination of numeric steps and keywords (`full`, `screen`, `min`/`max`).
- **Visuals**: Granular control over `Opacity`, `Radius`, `Shadow`, and `ZIndex`.
- **Text**: `FontSize` and `LineHeight` are decoupled for fine-tuning.

---

## 4. Evolution & Future Direction

### Phase 1: Flexibility (Past)
Initially, `Frame` likely acted as a convenient wrapper around `div` with some flexbox helpers, but allowed full CSS overrides via the `style` prop.

### Phase 2: Enforcement (Current)
We are currently in a transition phase where:
1.  **Strictness is increasing**: The `Frame` component is being updated to reject arbitrary values.
2.  **Migration**: Existing code uses are being refactored (e.g., converting `260px` to `Size.n256`, `margin: 0 auto` to `pack` props).
3.  **Educational Tooling**: The code itself teaches the developer. If you try to pass `style={{ marginTop: 10 }}`, it simply won't work, forcing you to find the correct API.

### Phase 3: The "Pit of Success" (Future)
The direction points toward a state where **it is harder to write "bad" UI code than "good" UI code.**

- **AutoComplete Driven Development**: Developers will rely heavily on IDE autocomplete for token values.
- **Zero Layout Drift**: Because every value is a token, pages designed by different developers will align perfectly.
- **Themability**: By locking down values to CSS variables (`var(--space-n8)`), the entire application's look and feel can be changed instantly by updating the CSS variables, without touching React code.

## 5. Summary of Changes

| Feature | Previous State | Current/Future State |
| :--- | :--- | :--- |
| **Spacing** | `margin`, `padding` in style prop | `gap`, `p` props with `SpaceToken` |
| **Sizing** | Arbitrary `px` / `%` values | `SizeToken` / `ContainerSizeToken` |
| **Opacity** | `0` ~ `1` number | `OpacityToken` (step 5 scale) |
| **Overrides** | `style` prop allowed everything | `style` is filtered; usage of `override` prop required for specific tokens |
| **Philosophy** | Convention over Configuration | **Configuration enforced by Compiler** |
