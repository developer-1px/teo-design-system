# CSS Pattern Surface Optimization PRD

## 1. Problem Statement (Why)
* **Concept**: A Type-Safe Mixin architecture for the Runtime Atomic CSS Engine (Project-X).
**Goal**: Reduce CSS repetition and enforce consistency by extracting common "Surface" styles into reusable, type-safe mixins, similar to Vanilla Extract's `style` composition.
**Function Name Change**: `css()` -> `style()` (to avoid confusion and align with the mixin mental model).

## 1. Problem Statement (Why)
* **Core Problem:** 
    * **Repetition**: Every card, panel, and button repeats the same `backgroundColor`, `border`, `boxShadow`, `color`, and `:hover` logic.
    * **Inconsistency**: Manual input of `var(--surface-card)` vs `var(--surface-raised)` leads to visual drift.
    * **Complexity**: The raw `css()` calls are becoming unreadable due to verbosity.
* **Why now?** 
    * We have a stable Design System (Tokens defined in `legacy-design-system` and CSS variables).
    * We need a developer-friendly API (`style`) that enforces these system rules via TypeScript before the codebase grows further.

## 2. Target Audience (Who)
* Primary User: Developer (DX Improvement - Type Safety & auto-completion)
* Secondary User: Application (Consistency & potential CSS size reduction)

## 3. Scope & Features (What - MECE)
### 3.1. `style` Function (The Engine)
* **Start Requirement**: **Strict Vanilla Extract Compatibility**.
* **Signature**: `style(...args: (CSSObject | Mixin)[]) => string`
    * MUST accept an array of objects.
    * MUST supports deep merging (simulated or actual).
    * MUST return a class name string.
    * **Mental Model**: "It's just Vanilla Extract, but runs at runtime."

### 3.2. `pattern` Registry (The Mixins)
* **Role**: A central registry of reusable style objects.
* **Focus**: **Surface** (Primary target)
    * `pattern.surface.card`
    * `pattern.surface.panel`
    * `pattern.surface.ghost`
    * `pattern.surface.interactive` (hover/active states)
* **Structure**: Pure Objects (not functions) for easy spreading.
    * Example: `style({ ...pattern.surface.card, padding: 16 })`

### 3.3. Integration with Existing Tokens
* Source: `src/legacy-design-system/token/token.const.2tier.ts` (and CSS variables).
* Implementation: mapping `var(--surface-*)` variables to the mixin properties.

## 4. Success Metrics (How)
* Key Metric: (e.g., Lines of Code reduction, improved readability)
