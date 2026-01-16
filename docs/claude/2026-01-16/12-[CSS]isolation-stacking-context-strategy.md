# Isolation: Stacking Context Strategy

**Date**: 2026-01-16
**Participants**: Teo (Lead), Min (Frontend), Dana (UI Engineer)
**Topic**: Preventing Z-Index Warfare with CSS Isolation

---

## Problem Statement

**Dana**: We have a z-index nightmare. Modal dialog is `z-index: 1000`, but a dropdown inside it is `z-index: 999`, so it gets clipped. Then someone adds a tooltip with `z-index: 9999`.

**Min**: I've seen `z-index: 999999999` in production code. It's a losing battle.

**Teo**: The root cause is **z-index leakage**. Child z-indexes affect siblings outside their parent. We need to use `isolation: isolate` to create stacking contexts.

```css
.isolate {
  isolation: isolate;
}
```

This forces a new stacking context. Z-indexes inside **cannot** affect elements outside.

---

## Discussion

**Dana**: So if I have a Card with a Badge at `z-index: 10`, and I add `isolation: isolate` to the Card, the Badge's 10 only applies inside the Card?

**Teo**: Exactly. The Badge can't escape to compete with sibling Cards or parent components.

**Example Without Isolation**:
```tsx
<Frame> {/* Global stacking context */}
  <Card> {/* Badge z:10 leaks to global */}
    <Badge zIndex={10} />
  </Card>
  <Modal> {/* Must use z:1000 to beat Badge */}
    <Content />
  </Modal>
</Frame>
```

**Example With Isolation**:
```tsx
<Frame>
  <Card isolate> {/* Creates stacking context */}
    <Badge zIndex={10} /> {/* z:10 only inside Card */}
  </Card>
  <Modal> {/* Can use z:1, still above Card */}
    <Content />
  </Modal>
</Frame>
```

**Min**: When should we apply isolation?

**Teo**: Any component that has:
1. Internal z-index complexity (overlapping children)
2. Repeated instances (Cards, list items, table rows)
3. Potential for z-index conflicts (dropdowns, popovers)

---

## MDK Integration

**Frame API**:
```tsx
<Frame isolate>
  {/* All z-indexes inside are isolated */}
</Frame>
```

**Auto-Isolation Rules**:

Certain patterns should automatically apply isolation:

1. **Cards with Overlays**:
```tsx
<Frame surface="raised" isolate>
  <img src="thumbnail.jpg" />
  <Frame stack>
    <Badge>New</Badge>
  </Frame>
</Frame>
```

2. **List Items**:
```tsx
<Frame row gap={2}>
  {items.map(item => (
    <Frame key={item.id} isolate>
      <ComplexItem {...item} />
    </Frame>
  ))}
</Frame>
```

3. **Modals/Dialogs** (should NOT use isolation):
```tsx
<Modal> {/* No isolate - needs to be in global stacking context */}
  <Frame isolate> {/* But content inside can be isolated */}
    <Header />
    <Body />
    <Footer />
  </Frame>
</Modal>
```

---

## Z-Index Token System

**Dana**: Should we tokenize z-index values?

**Teo**: Yes, but minimally. With isolation, we rarely need more than 1-10:

```css
/* tokens.css */
--z-base: 0;
--z-above: 1;
--z-dropdown: 10;
--z-sticky: 100;
--z-modal: 1000;
--z-toast: 10000;
```

**Usage**:
```tsx
<Frame zIndex="above"> {/* z-index: 1 */}
  <Content />
</Frame>

<Frame zIndex={2}> {/* Raw number also allowed */}
  <Content />
</Frame>
```

---

## Edge Cases

**Min**: What if I need a child to escape isolation? Like a dropdown that overflows the card?

**Teo**: You use **portals**:

```tsx
<Card isolate>
  <Button onClick={toggleDropdown} />
  {showDropdown && (
    <Portal> {/* Renders outside Card, in document.body */}
      <Dropdown />
    </Portal>
  )}
</Card>
```

**Dana**: What about `transform`, `filter`, or `perspective`? Don't those also create stacking contexts?

**Teo**: Yes! That's a gotcha. If you apply `transform: translateX(10px)`, you've implicitly created a stacking context. With `isolation: isolate`, it's **explicit** and intentional.

**Best Practice**:
```tsx
{/* BAD: Implicit stacking context */}
<Frame style={{ transform: 'scale(1)' }}>
  <Badge zIndex={10} />
</Frame>

{/* GOOD: Explicit isolation */}
<Frame isolate>
  <Badge zIndex={10} />
</Frame>
```

---

## Decision

**Frame Props**:
```tsx
interface FrameProps {
  isolate?: boolean;
  zIndex?: number | 'above' | 'dropdown' | 'sticky' | 'modal' | 'toast';
}
```

**Auto-Isolation** (applied by default when):
- `surface` prop is used (Cards, Panels)
- `stack` prop is used (Overlays)
- Component is in a repeating collection (via convention)

**Override**:
```tsx
<Frame surface="raised" isolate={false}>
  {/* Disable auto-isolation if needed */}
</Frame>
```

---

## Real-World Example

**Problem**: CRM Table with inline editing

```tsx
{/* WITHOUT ISOLATION */}
<table>
  {rows.map(row => (
    <tr key={row.id}>
      <td>
        <Dropdown> {/* z:10 */}
          <Option>Edit</Option>
        </Dropdown>
      </td>
      <td>
        <Badge zIndex={5}>Status</Badge>
      </td>
    </tr>
  ))}
</table>
```

Issue: All dropdowns and badges compete globally. Row 5's dropdown (z:10) appears above Row 1's dropdown (also z:10) based on DOM order, causing visual confusion.

**Solution**:
```tsx
{/* WITH ISOLATION */}
<table>
  {rows.map(row => (
    <tr key={row.id}>
      <Frame as="td" isolate>
        <Dropdown> {/* z:10 only inside this cell */}
          <Option>Edit</Option>
        </Dropdown>
      </Frame>
      <Frame as="td" isolate>
        <Badge zIndex={5}> {/* z:5 only inside this cell */}
          Status
        </Badge>
      </Frame>
    </tr>
  ))}
</table>
```

Now each cell is an isolated stacking context. Dropdowns and badges don't interfere across rows.

---

## AI Guidance

**System Prompt**:
> "Use `isolate` prop on Frame when:
> 1. Component has internal z-index complexity (badges, dropdowns, overlays)
> 2. Component is repeated (list items, cards, table cells)
> 3. You want to prevent z-index from leaking to parent/siblings
>
> Do NOT use `isolate` on:
> - Top-level Modals/Dialogs (they need global stacking)
> - Components that need children to escape (use Portal instead)
>
> Default z-index tokens: `above` (1), `dropdown` (10), `sticky` (100), `modal` (1000), `toast` (10000)"

---

## Performance & Browser Support

**Browser Support**: `isolation: isolate` is supported in all modern browsers (Chrome 41+, Firefox 36+, Safari 8+).

**Performance**: No performance cost. Isolation is a rendering hint, not a layout calculation.

**Debugging**:
```tsx
<Frame isolate debugIsolation>
  {/* Adds visual outline during development */}
</Frame>
```

CSS:
```css
.frame[data-debug-isolation] {
  outline: 2px dashed orange;
  outline-offset: -2px;
}
```

---

## Related Patterns

This hack works with:
- **Grid Stack**: Isolated overlays don't affect parent z-index
- **Hit Area Expansion**: Expanded ::before stays within stacking context
- **Portal Pattern**: Escape hatch when isolation is too restrictive
- **Z-Index Tokens**: Minimal token set because isolation reduces need
