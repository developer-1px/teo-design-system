# Scroll Shadow Hint Pattern

**Date**: 2026-01-16
**Participants**: Teo (Lead), Min (Frontend), Sarah (A11y), Jordan (Performance)
**Topic**: Visual Scroll Indicators Without JavaScript

---

## Problem Statement

**Sarah**: Users don't know when content is scrollable, especially when scrollbars are hidden (macOS default, overlay scrollbars on mobile).

**Min**: I've been adding `overflow: auto`, but there's no visual hint that more content exists below.

**Teo**: There's a pure CSS solution using background gradients and `background-attachment`. We can show shadows that appear only when content is scrollable.

---

## The Classic Hack

**Original CSS** (from Lea Verou, 2012):
```css
.scroll-shadows {
  background:
    /* Shadow covers (hide shadows at edges) */
    linear-gradient(white 30%, rgba(255,255,255,0)) center top,
    linear-gradient(rgba(255,255,255,0), white 70%) center bottom,

    /* Actual shadows */
    radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), transparent) center top,
    radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), transparent) center bottom;

  background-repeat: no-repeat;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;

  /* The magic: */
  background-attachment: local, local, scroll, scroll;
}
```

**How It Works**:
- **Scroll attachment**: Shadows stay fixed while content scrolls
- **Local attachment**: White covers scroll with content, revealing shadows at edges
- When scrolled to top: Top cover hides top shadow
- When scrolled to bottom: Bottom cover hides bottom shadow
- When in middle: Both shadows visible

---

## Discussion

**Jordan**: This is brilliant, but it assumes white background. What about dark mode?

**Teo**: We use CSS variables:

```css
.scroll-shadows {
  --scroll-shadow-bg: var(--surface-base);
  --scroll-shadow-color: rgba(0, 0, 0, 0.15);

  background:
    linear-gradient(var(--scroll-shadow-bg) 30%, transparent) center top,
    linear-gradient(transparent, var(--scroll-shadow-bg) 70%) center bottom,
    radial-gradient(farthest-side at 50% 0, var(--scroll-shadow-color), transparent) center top,
    radial-gradient(farthest-side at 50% 100%, var(--scroll-shadow-color), transparent) center bottom;

  background-repeat: no-repeat;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;
}
```

In dark mode:
```css
[data-theme="dark"] {
  --scroll-shadow-bg: var(--surface-base); /* Dark background */
  --scroll-shadow-color: rgba(255, 255, 255, 0.1); /* Light shadow */
}
```

**Min**: How do we expose this in Frame API?

**Teo**: Simple boolean prop:

```tsx
<Frame
  overflow="auto"
  scrollShadows
  h={200}
>
  <LongContent />
</Frame>
```

---

## Modern Improvements

**Sarah**: The original hack is from 2012. Are there modern CSS features we can use?

**Teo**: Yes! We can combine with `scroll-snap` for better UX:

```tsx
<Frame
  overflow="auto"
  scrollShadows
  scrollSnap="y mandatory"
  scrollSnapAlign="start"
>
  <Section />
  <Section />
  <Section />
</Frame>
```

**Jordan**: What about performance? Four gradients seems heavy.

**Teo**: Browsers optimize background rendering. No layout cost, pure paint. In practice, negligible performance impact even with 100+ scrollable containers.

---

## Edge Cases

**Min**: What if content isn't tall enough to scroll?

**Teo**: Shadows don't appear because the scroll container never scrolls. The effect is automatic.

**Sarah**: What about horizontal scroll?

**Teo**: Same pattern, rotated:

```css
.scroll-shadows-x {
  background:
    linear-gradient(90deg, var(--scroll-shadow-bg) 30%, transparent) left center,
    linear-gradient(90deg, transparent, var(--scroll-shadow-bg) 70%) right center,
    radial-gradient(farthest-side at 0 50%, var(--scroll-shadow-color), transparent) left center,
    radial-gradient(farthest-side at 100% 50%, var(--scroll-shadow-color), transparent) right center;

  background-repeat: no-repeat;
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-attachment: local, local, scroll, scroll;
}
```

API:
```tsx
<Frame
  overflow="auto"
  scrollShadows="x"
  w={300}
>
  <Frame row>
    <Item />
    <Item />
    <Item />
  </Frame>
</Frame>
```

---

## Decision

**Frame Props**:
```tsx
interface FrameProps {
  scrollShadows?: boolean | 'x' | 'y';
  // Auto-enables when overflow="auto" or overflow="scroll"
}
```

**Implementation**:
```tsx
// Frame.tsx
export function Frame({ scrollShadows, overflow, ...props }) {
  const className = clsx(
    'frame',
    scrollShadows === 'x' && 'scroll-shadows-x',
    scrollShadows === 'y' && 'scroll-shadows-y',
    scrollShadows === true && 'scroll-shadows-y', // Default to vertical
  );

  return <div className={className} {...props} />;
}
```

**CSS** (tokens.css or frame.css):
```css
.scroll-shadows-y {
  --scroll-shadow-bg: var(--surface-base);
  --scroll-shadow-color: rgba(0, 0, 0, 0.15);

  background:
    linear-gradient(var(--scroll-shadow-bg) 30%, transparent) center top,
    linear-gradient(transparent, var(--scroll-shadow-bg) 70%) center bottom,
    radial-gradient(farthest-side at 50% 0, var(--scroll-shadow-color), transparent) center top,
    radial-gradient(farthest-side at 50% 100%, var(--scroll-shadow-color), transparent) center bottom;

  background-repeat: no-repeat;
  background-color: var(--scroll-shadow-bg);
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;
}

[data-theme="dark"] .scroll-shadows-y {
  --scroll-shadow-color: rgba(255, 255, 255, 0.1);
}
```

---

## Use Cases

**1. Sidebar Navigation**:
```tsx
<Frame
  w={60}
  h="fill"
  overflow="auto"
  scrollShadows
  surface="sunken"
>
  <NavLinks />
</Frame>
```

**2. Chat Messages**:
```tsx
<Frame
  flex
  overflow="auto"
  scrollShadows
  p={4}
>
  {messages.map(msg => (
    <Message key={msg.id} {...msg} />
  ))}
</Frame>
```

**3. Table with Fixed Header**:
```tsx
<Frame surface="raised" rounded="md" overflow="hidden">
  <Frame surface="sunken" p={3}>
    <TableHeader />
  </Frame>
  <Frame overflow="auto" scrollShadows h={400}>
    <TableBody />
  </Frame>
</Frame>
```

**4. Horizontal Scroll Gallery**:
```tsx
<Frame
  overflow="auto"
  scrollShadows="x"
>
  <Frame row gap={3}>
    {images.map(img => (
      <Frame key={img.id} ratio="video" w={200}>
        <img src={img.src} alt={img.alt} />
      </Frame>
    ))}
  </Frame>
</Frame>
```

---

## Accessibility Notes

**Sarah**: This is purely visual. We still need proper ARIA attributes:

```tsx
<Frame
  overflow="auto"
  scrollShadows
  role="region"
  aria-label="Scrollable content"
  tabIndex={0}
>
  <Content />
</Frame>
```

**Keyboard Navigation**:
- `tabIndex={0}` makes container focusable
- Arrow keys scroll when focused
- Page Up/Down for faster scrolling

---

## AI Guidance

**System Prompt**:
> "When creating scrollable containers with hidden scrollbars (overflow: auto), add `scrollShadows` prop to Frame:
>
> ```tsx
> <Frame overflow=\"auto\" scrollShadows h={300}>
>   <LongContent />
> </Frame>
> ```
>
> This shows visual hints (shadows) at top/bottom edges when content is scrollable.
>
> For horizontal scroll: `scrollShadows=\"x\"`
>
> Common use cases:
> - Sidebar navigation
> - Chat message lists
> - Data tables with fixed headers
> - Horizontal image galleries"

---

## Browser Support & Fallback

**Browser Support**: All modern browsers. `background-attachment: local` is widely supported.

**Fallback**: If browser doesn't support, scrolling still works, just without shadow hints. Graceful degradation.

**Feature Detection** (optional):
```css
@supports (background-attachment: local) {
  .scroll-shadows-y {
    /* Apply effect */
  }
}
```

---

## Performance Benchmarks

**Jordan**: Testing on low-end devices:

| Metric | Without Shadows | With Shadows | Impact |
|--------|----------------|--------------|---------|
| First Paint | 120ms | 122ms | +1.6% |
| Scroll FPS | 60fps | 60fps | 0% |
| Memory | 12MB | 12MB | 0% |

**Conclusion**: No measurable performance impact.

---

## Related Patterns

This hack complements:
- **Frame Overflow**: Natural pairing with `overflow="auto"`
- **Grid/Flex Layout**: Works in any layout mode
- **Isolation**: Shadows stay within isolated stacking context
- **Dark Mode**: Theme-aware via CSS variables
