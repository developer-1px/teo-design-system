# Post-Mortem: Command Palette Design Implementation Failure

**Date:** 2026-01-16
**Component:** Command Palette
** Outcome:** Implementation Reverted

## Executive Summary
The attempt to implement the `CommandPalette` component system failed to meet the "Minimal Design Kit" (MDK) v7.7 standards. Although functionally correct, the implementation fundamentally violated the core architectural principles of the system, resulting in "Fake Design" that looked correct but was built incorrectly.

## Root Cause Analysis

### 1. Architecture Violation: Utility Class Reliance
**The Failure:**
I relied heavily on Tailwind utility classes (`text-sm`, `font-medium`, `cursor-pointer`, `border-b`) within the `className` prop or raw string concatenations.
**The MDK Standard:**
MDK v7.7 enforces a **"Zero Utility Class"** policy for core components.
- **Styling**: Must use 1-Tier Tokens (`Space.n12`, `Radius2.md`, `Surface.raised`) passed to `Frame` props.
- **Overrides**: Arbitrary classes must be encapsulated in `override={{ className: ... }}` to explicitly signal deviation, not mixed into the main API.

### 2. Layout Physics: Preset Ignorance
**The Failure:**
I attempted to manually reconstruct layouts using `flex`, `items-center`, and `gap` utilities.
**The MDK Standard:**
MDK requires the usage of **Semantic Layout Presets** (`Layout.Row.Item.Default`, `Layout.Stack.List.Dense`). These presets encapsulate the "Physics" of the design system (spacing rhythm, alignment logic) which I bypassed, leading to inconsistent spacing and maintenance debt.

### 3. Interaction Model: Ad-hoc Implementation
**The Failure:**
I manually added `cursor-pointer`, `hover:bg-token`, and `onClick` handlers to `div` elements.
**The MDK Standard:**
The `Frame` component provides a standard `interactive` prop.
- **Correct usage**: `interactive={true}` or `interactive="button"`.
- This ensures consistent hover states, focus rings, and cursor behaviors system-wide without manual CSS.

### 4. Typography: Component Bypass
**The Failure:**
I used `<span>` tags with `className="text-sm font-medium text-color-subtle"`.
**The MDK Standard:**
Typography must be handled by the `Text` component and its semantic presets (`Text.Menu.Item`, `Text.Menu.Group`).
- **Reason**: This ensures font metrics, scaling, and specific "Menu" style tokens (e.g., caps for headers) are applied consistently. Bypassing this breaks the "Themeability" of the system.

## Corrective Action Plan (Learnings)

To successfully implement this component in the future, the following workflow must be strictly followed:

1.  **Map Layouts First**: Identify the specific `Layout` preset for every container before writing code.
2.  **Tokenize Everything**: Never use a string literal (e.g., "12px") or utility class (e.g., "p-3") where a Token (`Space.n12`) exists.
3.  **Use Composition**: Always use `Text` components for content, never raw HTML text nodes.
4.  **Trust the Frame**: If a visual feature (border, shadow, radius) is needed, look for a `Frame` prop first. If it's not there, question if it's truly needed.

## Conclusion
The implementation was rejected because it prioritized "Visual Output" over "System Integrity". In a strict Design System environment, *how* it is built is as important as *how* it looks.
