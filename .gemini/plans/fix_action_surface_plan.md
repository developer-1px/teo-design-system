
# Implementation Plan - Fix Action Surface Background

We will remove the restrictive inline styles from the `Action` component's `button` element that were preventing the CSS class backgrounds (`.action-surface`, `.action-primary`) from rendering.

## Steps

1. **Modify `src/design-system/Action.tsx`**:
   - Locate the `button` element's `style` object.
   - Remove `background: 'none'` and `border: 'none'`.
   - These styles were intended to reset default browser button styles, but since we are using specific variant classes (`action-surface`, etc.), we should let the classes define these properties or move the reset to the base `.action-base` class if needed.
   - Actually, `.action-base` already has `border-radius: inherit`. I'll make sure `index.css` has a proper reset for `button`.

2. **Verify `src/index.css`**:
   - Check if `button` has a global reset. (It does: `border: none; background: none;`).
   - If `button` already has a reset, then the inline overrides in `Action.tsx` are doubly redundant and only serve to block the variant classes.

3. **Validation**:
   - Use the browser subagent to confirm the surface background is now visible on the 'Share' button.

## Risk Assessment
- Low risk. Removing these overrides should allow the intended styles to flow through.

## User Review Required
- No, this is a bug fix for a previously requested feature.
