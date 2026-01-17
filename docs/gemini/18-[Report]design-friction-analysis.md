# [Report] MDK Design Friction Analysis

**Date:** 2026-01-16
**Subject:** Friction points encountered during the design of `CommandBarDesignApp`

## 1. Executive Summary

Designing with the Minimal Design Kit (MDK) enforces a strict "Physics over Painting" philosophy. This is powerful for consistency but introduces significant initial friction for agents (and developers) used to "painting" with CSS or Tailwind. The most significant friction point is the **Type Compatibility of Tokens**, specifically distinguishing between conceptually similar but type-incompatible tokens (e.g., `Size` vs `ContainerSize`).

## 2. Friction Points

### 2.1. Token Type Incompatibility (`Size` vs `ContainerSize`)

**The Issue:**
Attempting to use `Size.n320` for `maxHeight` resulted in a type error:
> `Type 'SizeToken' is not assignable to type 'ContainerSizeToken'`

**Why it's confusing:**
To an AI/user, `320px` is just a size. However, the system strictly separates "Content/Layout Size" (`Size`) from "Container/Constraint Size" (`ContainerSize`).
-   `Size` includes small units (4, 8, 16...)
-   `ContainerSize` includes breakpoints and large container widths (320, 480, 640...)

**Impact:**
I had to re-read the type definitions definition or trial-and-error to find the correct token enum.

### 2.2. Component API Discovery (`Text` Dot-Notation)

**The Issue:**
I assumed the existence of `Text.Caption` based on `Text.Menu.Item` and other dot-notation presets.
> `Property 'Caption' does not exist on type 'Text'`

**Why it's confusing:**
The library uses a mix of:
1.  **Context Presets:** `Text.Menu.Item`, `Text.Card.Title` (Dot notation)
2.  **Variants:** `<Text variant="caption">` (Prop based)

Consistency is key for predictability. Mixed patterns lead to guessing.

### 2.3. Icon Component Interface

**The Issue:**
I treated `Icon` like a typical library component string prop: `<Icon name="search" />`.
The actual API was: `<Icon src={Search} />` (requiring a component reference).

**Impact:**
Requires importing every single icon individually from `lucide-react`, increasing import overhead compared to a string-based approach.

### 2.4. Import Overhead

**The Issue:**
To design one simple component, I had to import:
-   `Frame`, `Layout`, `Text`, `Icon` (Components)
-   `Space`, `Size`, `ContainerSize`, `Radius`, `Radius2`, `Opacity`, `IconSize` (Tokens)
-   `Search`, `File`, `Zap`, ... (Icons)

**Impact:**
The strictness requires verbose imports. It forces explicit opt-in to every constraint, which keeps the bundle clean but makes the "Time to Hello World" longer.

## 3. Recommendations for Future Agents

1.  **Always Check `Constraint` Types**: Before using a token, check if the prop expects a generic `Size` or a specific constraint like `ContainerSize` or `MaxWidth`.
2.  **Verify Component APIs**: Do not assume dot-notation exists for all variants. Check `Text.tsx` or `Icon.tsx` explicitly.
3.  **Use `1-Tier` Tokens**: Stick to `token.const.1tier.ts` unless you specifically need Semantic tokens (2-Tier).

## 4. Conclusion

The MDK prevents "Fake Design" effectively by making it a compile-time error to use the wrong value. The friction experienced valid proof that the system is working—it rejected my attempt to just "throw a pixel value" at the problem and forced me to choose a semantically correct token.
