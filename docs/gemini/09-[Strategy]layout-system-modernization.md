# Layout System Modernization: Bridging Figma \u0026 CSS

## 1. The Gap: Figma AutoLayout vs. CSS Flexbox

Designers and Developers often speak different languages when it comes to layout.
- **Figma (Designers)**: Think in "Intent" (Hug, Fill, Fixed).
- **CSS (Developers)**: Think in "Mechanism" (Flex grow/shrink/basis, min-width, width).

This dissonance leads to bugs like the `min-width: auto` overflow issue, where CSS defaults contradict the "Fill" intent.

### Comparison Table

| Feature | Figma AutoLayout | CSS Flexbox (Raw) | The Friction Point |
| :--- | :--- | :--- | :--- |
| **Hug Content** | The container hugs its children. | `width: fit-content` / `flex: 0 0 auto` | CSS defaults usually work, but sometimes require explicit `max-content`. |
| **Fill Container** | The item expands to fill available space. | `flex-grow: 1` | **The Bug Factory.** CSS defaults to `min-width: auto`, meaning it "fills space" but "refuses to shrink smaller than content". Figma's "Fill" implies `min-width: 0` automatically. |
| **Fixed Width** | Explicit pixel value. | `width: 200px` | If you set `width`, `flex-shrink` is still `1` by default. Figma assumes Fixed means "Do not shrink", necessitating `flex-shrink: 0` in CSS. |
| **Gap** | `Gap` | `gap` | (Mostly aligned now with modern CSS). |

---

## 2. Proposed Strategy: Intent-Based Layout Props

Instead of exposing raw CSS mechanics (`flexGrow`, `flexShrink`, `minWidth`), the Design System (`Frame`) should expose **Layout Intent**.

We propose deprecating "patch-work" props in favor of a `width` / `height` prop that accepts **Smart Keys**.

### The "Smart Sizing" API

```typescript
// Current (Raw CSS mechanism)
<Frame flex fill override={{ minWidth: 0, flexShrink: 0 }} />

// Proposed (Intent-based)
<Frame w="fill" />  // Automatically sets flex:1, min-width:0
<Frame w="hug" />   // Automatically sets width: fit-content
<Frame w={240} />   // Automatically sets width: 240px, flex-shrink: 0
```

### Technical Implementation

The `Frame` component will interpret these tokens and apply a "bundle" of strict CSS rules to enforcement the intent.

| Intent Token | Derived CSS | Why? |
| :--- | :--- | :--- |
| **`w="fill"`** | `flex: 1`<br>`min-width: 0` | Matches Figma's "Fill". Prevents the flex container from overflowing due to large children. |
| **`w="hug"`** | `width: max-content` (or `fit-content`)<br>`flex: 0 0 auto` | Matches Figma's "Hug". Ensures container expands to wrap children but doesn't force-stretch. |
| **`w={Number}`** | `width: {N}px`<br>`flex: 0 0 auto` | Matches Figma's "Fixed". **Crucially**, it disables shrinking (`flex: 0`) so the fixed element doesn't get squashed. |

---

## 3. Benefits

1.  **Zero "Patching"**: Developers stop manually writing `minWidth: 0` or `flexShrink: 0`. The system handles it.
2.  **Common Language**: Code matches Design. "Make this Fill" -> `w="fill"`.
3.  **Predictability**: "Fixed" things stay fixed. "Fill" things fill (and shrink if needed).

## 4. References

- **Chakra UI / Stitches**: Use `size`, `width` props with similar intent-based keywords.
- **Yoga Layout**: The layout engine behind React Native defaults to `flex-shrink: 0` for fixed dimensions, matching this strategy.
- **Figma Documentation**: "Resizing constraints" are the source of truth for modern UI layout mental models.
