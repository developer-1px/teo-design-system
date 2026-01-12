
# Action Component Fix: Missing Surface Background

The user reported that `Action` components with a label (which should default to the `surface` variant) are not showing their background color. This is likely due to the `background: 'none'` and `border: 'none'` inline style overrides on the `button` element in `Action.tsx`, which are overriding the CSS classes.

## Proposed Changes

### `src/design-system/Action.tsx`
- Remove `background: 'none'` and `border: 'none'` from the `button`'s inline `style` prop.
- Ensure that the classes `.action-surface`, `.action-primary`, and `.action-ghost` can manage their own backgrounds and borders.
- Consolidate the `flex` logic to use the `flex` prop more cleanly.

### `src/App.tsx`
- Ensure that `Present` button still works as intended (it currently has `variant="primary"` explicitly, which overrides the auto-surface logic).

## Status
- [x] Fix Action.tsx inline style overrides.
- [x] Verify visual appearance of labeled actions.
