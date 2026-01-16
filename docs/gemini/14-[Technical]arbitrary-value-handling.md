# Technical Strategy: Handling Arbitrary Values

## The Concern: Class Explosion

You asked:
> *"I like `w(200)`, but won't that create too many CSS classes?"*

**You are absolutely right.**
If we generated a static CSS class for every possible number (`.w(200)`, `.w(201)`, `.w(202)`...), our CSS file would grow infinitely. This is known as "Atomic CSS Bloat" (unless using a JIT compiler like Tailwind).

## The Solution: Hybrid Approach (Class + Inline Style)

We can support the *syntax* `w={200}` without generating infinite classes by splitting the responsibility:

1.  **Behavior (CSS Class)**: Handles the layout rules (flex-shrink, grow, etc.).
2.  **Value (Inline Style)**: Handles the specific pixel dimension.

### Implementation Logic

When the `Frame` component receives a number for `w` or `h`:

```typescript
// Frame.tsx implementation logic

const isFixedW = typeof w === 'number';

// 1. Apply a generic "Fixed" class for behavior
const className = clsx(
  // ...
  isFixedW && "w(fixed)", // Sets flex-shrink: 0, etc.
  w === 'fill' && "w(fill)"
);

// 2. Apply the specific number as an inline style
const style = {
  // ...
  width: isFixedW ? `${w}px` : undefined
};

return <div className={className} style={style} />;
```

### The Resulting DOM

**Scenario A: Keyword (Fill)**
API: `<Frame w="fill" />`
DOM: `<div class="w(fill)"></div>`

**Scenario B: Arbitrary Number (200px)**
API: `<Frame w={200} />`
DOM: `<div class="w(fixed)" style="width: 200px;"></div>`

### Why this is perfect
1.  **Zero Bloat**: You only need one CSS class `.w(fixed)` to handle *all* fixed widths.
2.  **Correct Behavior**: `.w(fixed)` ensures `flex-shrink: 0`, so the generic `width: 200px` style doesn't get squashed.
3.  **Consistent API**: The developer just writes `w={200}` or `w="fill"` and doesn't need to know how it renders.

### The CSS Definition

```css
/* w(fixed) just ensures the layout mechanics are correct */
/* The actual width comes from the inline style */
.w\(fixed\) {
  flex-grow: 0;
  flex-shrink: 0;
  /* width is handled by style attribute */
}
```
