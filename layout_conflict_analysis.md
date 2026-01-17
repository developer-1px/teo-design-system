# Why `min-height: 0` Causes Layout Collapse in `w(fill) + h(fill)`

## The Problem
When using `h(fill)` in a `vbox` (Vertical Flex Container), it applies the following CSS:
```css
.frame.vbox > .frame.h\(fill\) {
  flex: 1 1 0;      /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
  min-height: 0;    /* allow shrinking below content size */
}
```

This works perfectly when the parent `vbox` has a **fixed height** or fills the screen. However, if the parent has **`height: auto`** (determined by its children), a circular dependency and collapse occurs:

1.  **`flex-basis: 0`**: Tells the browser "My initial height is 0px".
2.  **`flex-grow: 1`**: Tells the browser "Grow to fill remaining space".
3.  **Parent `height: auto`**: The parent looks at its children to determine its height. Since the child claims to start at 0px (basis), the parent sees "0px of content" from this child.
4.  **No Remaining Space**: Since the parent is only as tall as its content, and the content claims to be 0px, there is no *extra* space to grow into.
5.  **`min-height: 0`**: Crucially, this overrides the default `min-height: auto`. Normally, `auto` would say "stop shrinking at the content's text size". By setting it to `0`, we explicitly allow it to be 0px.
6.  **Result**: The element collapses to 0px height and becomes invisible, even if it has content inside.

## Why was `min-height: 0` added?
It is a common "Flexbox Hack" required for nested scrolling. By default, a flex item with `min-height: auto` cannot shrink smaller than its content. This prevents a child `overflow: auto` container from ever scrolling—instead, the parent flex item just expands to fit all the content, pushing layout off-screen.
`min-height: 0` allows the flex item to shrink, forcing the inner scrollable area to activate.

## Proposed Fixes

### Option A: Use `flex: 1 1 auto` (Recommended for Safety)
Change `.h(fill)` to use `flex-basis: auto`.
```css
.frame.vbox > .frame.h\(fill\) {
  flex: 1 1 auto;
  min-height: 0;
}
```
*   **Pros**: Prevents collapse in auto-height parents. If space is undefined, it respects content size. If space is defined, it still grows.
*   **Cons**: In a fixed-height parent with multiple `h(fill)` siblings, they will not share space strictly equally if their content sizes differ drastically (unless `width/height` is explicitly 0). Ideally `flex-basis: 0` is better for strict grids, but `auto` is safer for generic layouts.

### Option B: Remove `min-height: 0` from general `.h(fill)`
Only apply `min-height: 0` to elements that explicitly need to scroll (e.g., adding `.scroll` implies it).
```css
.frame.vbox > .frame.h\(fill\) {
  flex: 1 1 0;
  /* min-height: 0; removed */
}
```
*   **Pros**: Prevents collapse (defaults to `min-height: auto`).
*   **Cons**: Breaks nested scrolling layouts unless the developer manually adds `min-height: 0` or uses a `scroll` prop on the container.

## Recommendation
Since `h(fill)` is a layout structural token, its primary job is "Fill Available Space".
If you are using `h(fill)` inside an auto-height container, you likely "want it to be at least content height".

We should **modify `frame.css`** to use **Option A (`flex: 1 1 auto`)**.
This maintains the "fill" behavior in fixed containers but gracefully degrades to "fit-content" in auto containers, preventing the confusing 0-height collapse.

```css
/* Proposed Change in src/style/frame.css */

/* Old */
/* flex: 1 1 0; */

/* New */
flex: 1 1 auto;
min-height: 0;
```
