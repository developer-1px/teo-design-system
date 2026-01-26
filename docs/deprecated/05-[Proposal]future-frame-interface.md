# Future Frame Interface Proposals

This document explores potential "Ideal States" for the `Frame` component interface, targeting the goal of simplification into **Surface**, **Layout**, **Sizing**, and **Behavior** categories.

These are **concepts** to spark discussion on the direction of the design system.

---

## The Vision: 4 Core Pillars
We aim to move away from a "bag of props" towards strict functional groups:
1.  **Surface**: Visuals (Background, Border, Shadow, Opacity).
2.  **Layout**: Internal arrangement of children (Flex, Grid, Gap, Align).
3.  **Sizing**: Self-dimensions (Width, Height, Aspect Ratio).
4.  **Behavior**: Interaction & Mechanics (Scroll, Click, Hover, Animation).

---

## Proposal A: The "Categorized Prop" Interface
Group settings into typed objects. This keeps the root namespace clean and makes categories explicit.

```tsx
// Current
<Frame row gap="n4" w="full" surface="card" />

// Proposal A
<Frame
  layout={{ flow: "row", gap: "n4", align: "center" }}
  size={{ width: "full", height: "auto" }}
  surface={{ intent: "card", border: true }}
/>
```

### Pros/Cons
*   ✅ **Explicit**: No ambiguity about what affects layout vs. visual.
*   ✅ **Clean Root**: `override` and `style` become less necessary as strict types cover more.
*   ✅ **Scalable**: Adding new layout features doesn't clutter the main component props.
*   ❌ **Verbosity**: Typing `layout={{ ... }}` is heavier than `row gap="..."`.
*   ❌ **Performance**: Creation of new objects on every render (though minor).

---

## Proposal B: The "Semantic Component" Composition
Break `Frame` into specialized sub-components. `Frame` itself becomes strictly a container/surface.

```tsx
// Current
<Frame row gap="n4" surface="card">...</Frame>

// Proposal B
<Frame variant="card">
  <Layout.Row gap="n4" align="center">
    <Content />
  </Layout.Row>
</Frame>
```

### Pros/Cons
*   ✅ **Readability**: Code reads like a document structure.
*   ✅ **Separation of Concerns**: `Frame` handles visuals, `Layout.*` handles positioning.
*   ✅ **Discoverability**: `<Layout.` triggers autocomplete for layout-specific props only.
*   ❌ **Nesting Hell**: Potentially deep trees for simple UIs.
*   ❌ **Migration Cost**: High. Requires rewriting most JSX structure.

---

## Proposal C: The "Atomic Preset" Interface (Refined Current)
Keep the flat prop structure but enforce strict naming conventions that map to the 4 pillars. This is the **most likely evolution** of our current "Preset Props".

```tsx
// Current
<Frame row gap="n4" surface="card" w="full" />

// Proposal C (Standardized Naming)
<Frame
  // 1. Layout (Prefix-free or standardized)
  flow="row" // Replaces 'row' boolean for clarity?
  gap="n4"
  
  // 2. Sizing (Shortcodes)
  w="full"
  h="auto"

  // 3. Surface (Preset-driven)
  layer="card" // 'surface' -> 'layer' (Contextual depth)
  
  // 4. Behavior
  scroll="y"
  onClick={...}
/>
```

### Evolution Strategy
We can define strict interfaces for C:
```ts
interface FrameProps extends LayoutProps, SizingProps, SurfaceProps, BehaviorProps {}
```
And potentially deprecate ambiguous props (like `flex` number vs boolean) in favor of explicit ones.

---

## Proposal D: The "Variant-First" Approach
Drastically reduce props by forcing **everything** into defined variants in code/config.

```tsx
// Proposal D
<Frame variant="card-row-padded" />

// Variants defined in design-system/variants.ts
const variants = {
  "card-row-padded": {
    surface: "card",
    layout: "row",
    gap: "n4",
    padding: "n4"
  }
}
```

### Pros/Cons
*   ✅ **Ultimate Consistency**: Impossible to create "snowflake" designs.
*   ❌ **Developer Friction**: Must open a separate file to define a variant for every small tweak.
*   ❌ **Explosion of Names**: Naming things is hard (`card-row-padded-large-gap`?).

---

## Recommendation
**Evolve Proposal C (Atomic Preset)** while borrowing clarity from **A**.

1.  Keep props flat for developer experience (DX).
2.  Internally organize them into the 4 Pillars.
3.  Expose strict types: `FrameProps` = `SurfaceProps & LayoutProps & SizingProps`.
4.  Maybe introduce `layout={{ ... }}` as an optional *alternative* for complex layouts, but keep `<Frame gap="n4">` for speed.
