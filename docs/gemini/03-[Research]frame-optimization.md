# Frame Style Optimization Research

## Problem Statement
The current implementation of `Frame.tsx` manually destructors nearly 30 properties to block them from the `style` prop. This adds ~80 lines of noise to the component, making it harder to read and maintain.

## Optimization Strategies

### 1. Extraction pattern (Recommended)
Move the filtering logic to a specialized utility function.

**Pros:**
- Drastically cleans up `Frame.tsx`.
- Reusable runtime safety.

**Cons:**
- Logic still exists (just moved).

**Example:**
```typescript
// styleUtils.ts
export function sanitizeStyle(style: React.CSSProperties) {
  const { width, height, margin, padding, ...safe } = style;
  return safe;
}

// Frame.tsx
const safeUserStyle = sanitizeStyle(style);
```

### 2. Lint-Only Enforcement (Zero Runtime Cost)
Remove runtime blocking entirely and rely on ESLint to prevent usage.

**Pros:**
- `Frame.tsx` becomes extremely minimal.
- Zero runtime performance cost.

**Cons:**
- **Safety Reduction**: If a developer ignores lint or casts to `any`, the restricted styles *will* leak into the DOM.
- Requires custom ESLint setup.

### 3. Type-Level Exclusion
Redefine `style` prop to `Omit<React.CSSProperties, "width" | "height" ...>`.

**Pros:**
- TypeScript error appears immediately in usages.
- Zero runtime code.

**Cons:**
- Like Lint-Only, it provides no runtime guarantee against `any` casts or dynamic unchecked objects.

## Recommendation
**Implement Strategy 1 (Extraction).**
The goal of the design system is *strict enforcement*. Runtime blocking is the only way to guarantee this (The "Code as Gatekeeper" philosophy). Moving the mess to a utility file cleans the code while keeping the security.
