# Hit Area Expansion for Action Component

**Date**: 2026-01-16
**Participants**: Teo (Lead), Min (Frontend), Sarah (A11y Engineer)
**Topic**: Implementing "Hit Area Expansion" Hack for Small Actions

---

## Problem Statement

**Sarah**: Our current Action component has accessibility issues. Icon-only buttons are 16px × 16px, but WCAG requires minimum 44px × 44px touch targets.

**Min**: I've been adding `p={3}` everywhere to compensate, but it ruins the visual layout. Designers want tight spacing.

**Teo**: There's a CSS hack for this: use `::before` pseudo-element to expand the clickable area without affecting layout.

```css
.clickable {
  position: relative;
  cursor: pointer;
}

.clickable::before {
  content: "";
  position: absolute;
  inset: -8px; /* Expands 8px in all directions */
}
```

---

## Discussion

**Sarah**: So the visible button stays small, but the click target is larger? That's perfect for accessibility.

**Teo**: Exactly. And it's layout-safe because `position: absolute` with empty content doesn't push anything around.

**Min**: How do we expose this in our API? A `hitArea` prop?

**Teo**: I'm thinking:

```tsx
<Action
  icon={IconTrash}
  size={16}           // Visual size: 16px
  hitArea={44}        // Touch target: 44px (default)
/>
```

If `hitArea > size`, we apply the `::before` expansion.

**Sarah**: What if the button already has padding?

**Teo**: We calculate the gap:

```
expansion = (hitArea - actualSize) / 2
```

If `actualSize` (size + padding) is already ≥ hitArea, we don't apply expansion.

---

## Edge Cases

**Min**: What about adjacent buttons? Won't the hit areas overlap?

**Teo**: Yes, but that's standard web behavior. The DOM order determines which one wins. We can document this:

> "When Actions are tightly spaced, hit areas may overlap. Ensure adequate visual spacing (`gap={2}` minimum) for clarity."

**Sarah**: What about debugging? Can we visualize the hit area during development?

**Teo**: Great idea. We can add a debug mode:

```tsx
<Action
  icon={IconTrash}
  hitArea={44}
  debugHitArea  // Shows semi-transparent overlay
/>
```

---

## Decision

**Implementation**:
1. Add `hitArea` prop to Action (default: `44` for WCAG compliance)
2. Calculate expansion needed: `(hitArea - actualSize) / 2`
3. Apply `::before` pseudo-element with `inset: -{expansion}px`
4. Add `debugHitArea` prop for visualization

**CSS Implementation**:
```css
/* In action.css */
.action {
  position: relative;
  cursor: pointer;
}

.action::before {
  content: "";
  position: absolute;
  inset: var(--hit-area-expansion, 0);
  /* Debug mode: */
  background: var(--debug-hit-area, transparent);
}
```

**TypeScript Interface**:
```tsx
interface ActionProps {
  size?: number;
  hitArea?: number; // Default: 44 (WCAG 2.5.5)
  debugHitArea?: boolean;
}
```

---

## Use Cases

**Toolbar Icons**:
```tsx
<Frame row gap={1}>
  <Action icon={IconBold} size={16} hitArea={44} />
  <Action icon={IconItalic} size={16} hitArea={44} />
  <Action icon={IconUnderline} size={16} hitArea={44} />
</Frame>
```

Visual: Tightly packed 16px icons
Reality: Each has 44px × 44px touch target

**Close Buttons**:
```tsx
<Action
  icon={IconX}
  size={12}
  hitArea={44}
  variant="ghost"
/>
```

Tiny visual × but large touch area.

---

## Token Integration

**Intent**: "Make small actions easier to click without breaking layout"

**WHY**: Accessibility requires 44px targets, but designers want compact visuals.

**HOW**: Invisible pseudo-element expands hit area.

**AI Prompt**:
> "For icon-only Actions smaller than 44px, always include `hitArea={44}` for accessibility."

---

## Related Patterns

This hack complements:
- **Grid Stack**: For overlapping close buttons on cards
- **Isolation**: Prevents z-index conflicts with expanded hit areas
- **Frame `gap`**: Ensures visual clarity when hit areas overlap
