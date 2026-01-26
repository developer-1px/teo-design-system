# Layout Refactoring Analysis Report

## Issue Analysis: CMSSidebar.tsx:222

### The Breakage
In the recent refactoring of `CMSSidebar.tsx`, the `ratio="16/9"` prop was inadvertently removed from the thumbnail `Frame` when moving properties to the `override` object.

**Original Code:**
```tsx
<Frame
  // ...
  ratio="16/9"
  surface={active ? "base" : "sunken"}
  pack border
>
```

**Refactored Code:**
```tsx
<Frame
  // ...
  surface={active ? "base" : "sunken"}
  pack
  override={{ border: true, w: Size.fill, cursor: "pointer" }}
>
```

**Result:** The aspect ratio of the thumbnail was lost, causing the frame to collapse or take an arbitrary height (likely based on content, which is just an absolute positioned dot, or empty), resulting in a broken visual.

### Why Did This Happen?
The error occurred during a "Lint Fix" pass. The goal was to move "restricted" top-level props (like `border`) to the `override` object to satisfy strict TypeScript rules.
1.  **Over-Aggressive Cleaning:** While moving `border` to `override`, the agent (myself) incorrectly flagged `ratio` as either invalid or unnecessary, or simply missed copying it over.
2.  **Assumption of Layout Token Sufficiency:** There was an implicit assumption that applying a Semantic Layout or just `w={Size.fill}` would be sufficient, but aspect ratio is a specific visual property not covered by standard row/stack layout tokens.
3.  **Lack of `ratio` in `FrameProps` (Hypothesis):** If `ratio` is not a standard prop definition in `FrameProps.ts`, it might have been treated as an "unknown prop" to be cleaned up. However, it is a crucial design requirement for thumbnails.

## Broader Analysis: Risks of Layout Token Transition

Moving to a strict "Layout Token" system (`layout={Layout.Row...}`) is powerful for consistency, but carries specific risks demonstrated here:

### 1. Loss of Ad-Hoc Nuance
Semantic tokens (e.g., `Layout.Row.Item.Default`) prescribe `gap`, `align`, and `padding`. They often **overwrite** or ignore specific ad-hoc styles (`ratio`, specific `heights`, specific `flex-basis`) unless those are explicitly preserved in `override`.
*   **Risk:** "Simplifying" code often strips necessary visual details that don't fit the "perfect system" model.

### 2. The "Override" Trap
We are moving props to `override` to discourage ad-hoc styling. However, during refactoring, it is easy to:
*   Forget to move a prop (like `ratio`).
*   Move a prop that isn't actually supported in `override` (CSS vs props).
*   Create a messy `override` object that is harder to read than the original props, defeating the purpose of "clean code".

### 3. Visual Regression in "Strict" Mode
Enforcing strict rules (no top-level style props) on legacy code requires **pixel-perfect verification**. Automated refactors that just "move props around" often fail to account for:
*   **CSS Specificity:** `style={{ ... }}` usually beats class names. Moving things to `override` (which might map to classes or lower-specificity styles) can change behavior.
*   **Default Overwrites:** A Layout Token applies a set of defaults. If the original code relied on `gap={0}` but the token enforces `gap={Space.n4}`, the design "breaks" (shifts) subtlely.

## Recommendations

1.  **Preserve `ratio`:** Ensure `ratio` is either a first-class citizen in `FrameProps` or explicitly handled in `override`.
2.  **Audit Refactors:** When applying a Layout Token, check **every single prop** on the original component. If the token doesn't cover it, it **MUST** go into `override`.
3.  **Visual Regression Testing:** "Lint fixing" is not enough. Design properties (`ratio`, `opacity`, `z-index`) are often the first casualties of "code cleanup".
