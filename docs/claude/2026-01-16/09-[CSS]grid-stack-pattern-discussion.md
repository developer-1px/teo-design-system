# Grid Stack Pattern Discussion

**Date**: 2026-01-16
**Participants**: Teo (Lead), Min (Frontend), Alex (Designer)
**Topic**: Implementing "Grid Stack" Hack in MDK Frame Component

---

## Background

Currently, developers use `position: absolute` for overlays, which causes common issues:
- Forgetting `position: relative` on parent
- Layout shift when content size changes
- Coordinate calculation errors with `top: 50%` + `transform: translate`

The Grid Stack pattern eliminates these issues by using CSS Grid's cell overlap feature.

---

## Discussion

**Teo**: I found this CSS Architecture hack called "Grid Stack". Instead of `position: absolute`, it uses CSS Grid to stack elements in the same cell. Much more robust.

```css
.stack {
  display: grid;
  grid-template-areas: "stack";
}

.stack > * {
  grid-area: stack;
  align-self: center;
  justify-self: center;
}
```

**Min**: Wait, so all children go to the same grid cell? That's clever. But how do we expose this in our token-based API?

**Teo**: I'm thinking we add a `stack` boolean prop to Frame:

```tsx
<Frame stack>
  <img src="hero.jpg" />
  <Frame as="h1">Overlay Title</Frame>
</Frame>
```

Internally, it sets `display: grid` and `grid-template-areas: "stack"`.

**Alex**: Love it. But what if I want the overlay at the bottom instead of center?

**Teo**: Good point. We can expose alignment props that work with the stack:

```tsx
<Frame stack>
  <img src="hero.jpg" />
  <Frame alignSelf="end" justifySelf="start">
    Bottom-left caption
  </Frame>
</Frame>
```

**Min**: This is way safer than teaching AI to use absolute positioning. The parent automatically grows with content, right?

**Teo**: Exactly. With absolute positioning, the parent doesn't know the child's size. With Grid Stack, it does.

---

## Decision

**Action Items**:
1. Add `stack` boolean prop to Frame component
2. When `stack={true}`:
   - Set `display: grid`
   - Set `grid-template-areas: "stack"`
   - Apply `grid-area: stack` to all children
3. Support `alignSelf` and `justifySelf` on child Frames for positioning
4. Default alignment: `center` / `center`

**Example Use Cases**:
- Hero images with text overlay
- Card thumbnails with badges
- Video players with control overlays
- Avatar with status indicator

---

## Implementation Note

```tsx
// Frame.tsx
export function Frame({ stack, alignSelf, justifySelf, ...props }) {
  const style = {
    ...(stack && {
      display: 'grid',
      gridTemplateAreas: '"stack"',
    }),
    ...(alignSelf && { alignSelf }),
    ...(justifySelf && { justifySelf }),
  };

  return <div style={style} {...props} />;
}
```

**Token Alignment**:
- This pattern fits MDK's "Intent-First" philosophy
- Intent: "I want to overlap elements safely"
- Solution: `stack` prop instead of raw CSS

**AI Prompt Addition**:
> "For overlapping layouts (image + text, card + badge), use `<Frame stack>` instead of `position: absolute`."
