# Design System Evolution: Next Steps (Roadmap)

Following the analysis of the current "transitional" state, here is the recommended roadmap to reach the "Pit of Success" where the design system is fully enforced and developer-friendly.

## 1. Completing the "Blocker" (Immediate Term)

Currently, `Frame.tsx` blocks `margin`, `padding`, `width`, `height`, `opacity`, `borderRadius`, and `boxShadow`.
To fully secure the design system, we should extend blocking to other primitives that have token equivalents.

### Action Items:
- **Block `zIndex`**: Enforce `ZIndexToken`.
- **Block `borderWidth`**: Enforce `BorderWidthToken` (currently handled via `border` boolean, but specific widths might be slipping through).
- **Block `fontSize` / `lineHeight` / `color`**:
    - **Note**: These are often inherited. Blocking them in `Frame` might be too aggressive if `Frame` is used just for layout, but for "Leaf Frames" (that contain text), these should be controlled via `Text` component or specific props.
    - **Recommendation**: Do *not* block these in `Frame` yet, but ensure `Text` component enforces them strictly.

## 2. Static Analysis Enforcement (ESLint)

Runtime blocking (in `Frame.tsx`) is a safety net, but it fails late (in the browser). We need to fail early (in the IDE).

### Action Items:
- **Create Custom ESLint Rule**: `no-restricted-syntax` or a custom plugin.
    - **Rule**: Ban specific keys in `style={{ ... }}` prop on `Frame` component.
    - **Error Message**: "Do not use 'margin' in style. Use 'gap' for spacing or 'Divider' for separation."
    - **Error Message**: "Do not use 'width' in style. Use 'w' prop with Size token."
- **Benefit**: Developers see red squiggles immediately as they type.

## 3. Migration of Legacy Code

Our grep search reveals significant usage of `style={{ ... }}` throughout the codebase (e.g., `Separator.tsx`, `Icon.tsx`, `CMSDrawer.tsx`).

### Action Items:
- **`Icon.tsx`**: Often uses `style={{ color }}` or transform. Ensure `Icon` accepts color tokens or inherits properly.
- **`Separator.tsx` / `Divider.tsx`**: Ensure they aren't using arbitrary margins internally.
- **App Components**: Systematically go through `grep` results and replace `style` props with top-level `Frame` props.
    - `style={{ flex: 1 }}` -> `flex` (boolean or prop)
    - `style={{ overflow: 'hidden' }}` -> `clip`
    - `style={{ cursor: 'pointer' }}` -> `cursor="pointer"` (needs a simplified prop if not present)

## 4. Expanding the Primitive Set

The current system relies heavily on `Frame` for everything. We may need more specialized primitives to reduce `override` usage.

### Action Items:
- **`ScrollFrame`**: `Frame` has `scroll` prop, but a dedicated component could handle overflow and scrollbar styling tokens more widely.
- **`Surface`**: Improve the `surface` prop to handle more than just "primary". Map it to semantic color tokens (background + foreground pairs).

## 5. Documentation & Developer Experience

With props spread between "Strict", "Layout", and "Overrides", usage can be confusing.

### Action Items:
- **"One Prop" Policy**: Try to flatten commonly used overrides into strict props if usages > 10.
- **Storybook / Docs**: Update documentation to explicitly show the "Wrong Way" (style prop) vs "Right Way" (token prop) side-by-side.

## 6. The "Escape Hatch" Protocol

There will always be edge cases (e.g., 3rd party integration, complex animations).

### Action Items:
- **Standardize the Escape Hatch**: instead of allowing `style` to silently work (until we block it), considering an explicit `unsafe_style` prop or requiring a comment like `// eslint-disable-next-line` to signal "I know what I'm doing and I have a good reason."

---

## Conclusion

The next immediate phase is **"Cleanup & Tooling"**.
1.  **Migrate** remaining `style` usages to props.
2.  **Lint** to prevent regression.
3.  **Document** the extensive prop API of `Frame`.
