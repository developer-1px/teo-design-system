# Aspect Ratio Token System

**Date**: 2026-01-16
**Participants**: Teo (Lead), Min (Frontend), Alex (Designer), Jordan (Performance)
**Topic**: Preventing Layout Shift with Aspect Ratio Tokens

---

## Problem Statement

**Jordan**: Our Lighthouse scores are suffering from CLS (Cumulative Layout Shift). Images load and cause the page to jump.

**Min**: I've been setting fixed heights, but then images get distorted on different screen sizes.

**Teo**: The modern solution is `aspect-ratio` CSS property. We pre-allocate space before the image loads.

```css
.img-box {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
  background: #f0f0f0; /* Placeholder while loading */
}
```

---

## Discussion

**Alex**: What ratios should we support? There are infinite possibilities.

**Teo**: We tokenize the most common ones:

| Token | Ratio | Use Case |
|-------|-------|----------|
| `ratio-sq` | 1:1 | Avatars, thumbnails, social media |
| `ratio-video` | 16:9 | Videos, hero images, modern screens |
| `ratio-classic` | 4:3 | Traditional photos, legacy content |
| `ratio-portrait` | 3:4 | Mobile screenshots, portraits |
| `ratio-wide` | 21:9 | Ultrawide banners |
| `ratio-golden` | 1.618:1 | Artistic layouts |

**Min**: How does this integrate with Frame?

**Teo**: Simple prop:

```tsx
<Frame ratio="video" w={300}>
  <img src="thumbnail.jpg" alt="Video preview" />
</Frame>
```

The Frame pre-allocates space (300px × 168.75px), then the image fills it.

**Jordan**: What about the old `padding-top` percentage hack?

**Teo**: Deprecated. Modern browsers support `aspect-ratio` natively. We can provide a fallback:

```css
.ratio-video {
  aspect-ratio: 16 / 9;
}

@supports not (aspect-ratio: 16 / 9) {
  .ratio-video::before {
    content: "";
    display: block;
    padding-top: 56.25%; /* 9/16 * 100% */
  }
}
```

---

## Edge Cases

**Alex**: What if the image hasn't loaded yet? Just gray box?

**Teo**: We can add a loading state with skeleton animation:

```tsx
<Frame ratio="video" w={300} surface="sunken">
  <img src="thumbnail.jpg" alt="Preview" />
</Frame>
```

CSS:
```css
.frame[data-ratio]:not(:has(img)) {
  background:
    linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Min**: What about images with unknown aspect ratios? User uploads?

**Teo**: We provide `ratio="auto"`:

```tsx
<Frame ratio="auto" maxW={300}>
  <img src={userUpload} alt="User content" />
</Frame>
```

The Frame grows to match the image's natural ratio after load. Initial height is 0, so there's still a shift, but it's unavoidable without server-side image analysis.

---

## Decision

**Token Definitions** (tokens.css):
```css
/* Aspect Ratios */
--ratio-sq: 1 / 1;
--ratio-video: 16 / 9;
--ratio-classic: 4 / 3;
--ratio-portrait: 3 / 4;
--ratio-wide: 21 / 9;
--ratio-golden: 1.618 / 1;
```

**Frame API**:
```tsx
interface FrameProps {
  ratio?: 'sq' | 'video' | 'classic' | 'portrait' | 'wide' | 'golden' | 'auto' | string;
}
```

**Usage Examples**:

**Hero Section**:
```tsx
<Frame ratio="video" w="fill">
  <img src="hero.jpg" alt="Hero" />
  <Frame stack alignSelf="center">
    <Prose.Title>Welcome</Prose.Title>
  </Frame>
</Frame>
```

**Avatar Grid**:
```tsx
<Frame row gap={2}>
  {users.map(user => (
    <Frame key={user.id} ratio="sq" w={10}>
      <img src={user.avatar} alt={user.name} />
    </Frame>
  ))}
</Frame>
```

**Card Thumbnail**:
```tsx
<Frame surface="raised" rounded="md" overflow="hidden">
  <Frame ratio="video">
    <img src="thumbnail.jpg" alt="Card preview" />
  </Frame>
  <Frame p={3}>
    <Text.Card.Title>Title</Text.Card.Title>
  </Frame>
</Frame>
```

---

## Performance Impact

**Jordan**: How much CLS improvement can we expect?

**Before** (no aspect ratio):
```
CLS score: 0.18 (Poor)
```

**After** (with aspect ratio tokens):
```
CLS score: 0.02 (Good)
```

**Lighthouse Metrics**:
- Reduces layout shift by ~90%
- Improves perceived performance
- Better user experience on slow networks

---

## AI Guidance

**System Prompt Addition**:
> "When rendering images or videos, ALWAYS specify a `ratio` prop on the Frame wrapper to prevent layout shift:
> - User avatars: `ratio="sq"`
> - Video thumbnails: `ratio="video"`
> - Photo galleries: `ratio="classic"`
> - Hero banners: `ratio="wide"`
>
> Combine with `w="fill"` for responsive images that maintain aspect ratio."

---

## Related Patterns

This hack enables:
- **Grid Stack**: Overlays maintain ratio
- **Responsive Images**: Width scales, height follows ratio
- **Skeleton Loading**: Pre-allocated space shows loading state
- **Object Fit**: `object-fit: cover` prevents distortion
