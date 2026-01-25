# CMS Layout & Scrolling Analysis

## Issue
User reported that CMS sections appear "clumped together" (stuck in one place) or fail to scroll vertically.

## Layout Architecture
The current layout hierarchy is:

1. **`styles.app`** (`div`): Flex Row. Contains Sidebar + Main.
2. **`styles.main`** (`main`): Flex Column. Contains Overlays + CanvasScroll.
3. **`styles.canvasScroll`** (`div`): Flex Column. `overflow-y: auto`. This is the scroll container.
4. **`styles.viewportFrame`** (`div`): `min-height: 100vh`. Contains all sections.

## Findings

### 1. `viewportFrame` Configuration
The `viewportFrame` has `overflow: hidden` set in `CMSApp.styles.ts`:
```typescript
export const viewportFrame = css({
    // ...
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden", // <--- PROBLEM
    border: "1px solid var(--border-color)",
});
```
**Impact**:
- **Breaks Sticky Header**: `SiteHeader` uses `position: sticky`. For sticky positioning to work, no ancestor element can have `overflow: hidden`, `scroll`, or `auto` unless it is the scroll container itself. Here, `canvasScroll` is the scroll container, but `viewportFrame` (an intermediate wrapper) clips overflow. This prevents `SiteHeader` from sticking.
- **Clipping**: If content expands outside the frame bounds (e.g., negative margins for effect), it gets clipped.

### 2. "Clumping" / Overlap Theory
The sections (`HeaderHero`, `FeatureGridSection`, etc.) are predominantly standard `block` or `flex` elements. They should stacked vertically naturally inside the `viewportFrame` block context.

However, if "clumping" is occurring, checking the following is recommended:
- **Missing Flex Direction**: If `viewportFrame` inadvertently received `display: flex` (via a utility class collision or legacy CSS inheritance) without `flex-direction: column`, all sections would try to fit in a single row, appearing compressed or clumped.
- **Wrapper Height**: If `viewportFrame` has a fixed height that is too small, and `overflow: hidden` is on, subsequent sections would be invisible (clipped). `min-height: 100vh` prevents it from being too small, but doesn't cap it.

### 3. Engine & Class Names
The custom style engine generates atomic classes (e.g., `.pos(relative)`).
- We verified `ABBREVIATION_MAP` in `src/lib/full-table.ts`.
- `position` maps to `pos`, `padding` maps to `p`. There are no obvious collisions that would cause `position: absolute` to be applied unexpectedly.

## Recommendations

1. **Remove `overflow: hidden` from `viewportFrame`**:
   This allows `SiteHeader` to sticky-position correctly within the `canvasScroll` context and avoids aggressive clipping.

2. **Verify `FeatureGridSection` imports**:
   Ensure `CMSApp.legacy.css` is correctly loaded. In the refactor, we renamed it to `.legacy.css` and updated imports. If the hot module replacement (HMR) didn't pick this up immediately, fully refreshing the dev server is advised.

```typescript
// Proposed fix for CMSApp.styles.ts
export const viewportFrame = css({
    backgroundColor: "var(--surface-base)",
    boxShadow: "var(--elevation-n5)",
    transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    minHeight: "100vh",
    position: "relative",
    // overflow: "hidden", // <--- REMOVE THIS
    border: "1px solid var(--border-color)",
});
```
