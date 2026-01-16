# Proposal: Figma-to-Code Mapping Strategy

## 1. The Core Philosophy: "Flow-Relative" Naming

To align with Figma's mental model while keeping the code clean, we will rename the standard CSS axes to match their layout function:

- **Main Axis** (Flow Direction) → **`pack`** (Matches Figma's "Packed" vs "Space Between")
- **Cross Axis** (Perpendicular) → **`align`** (Matches Figma's "Alignment")

This eliminates the confusion of `justify-content` vs `align-items`. You simply ask: *"How are items packed along the flow?"* (`pack`) and *"How are they aligned across the flow?"* (`align`).

---

## 2. The Great Mapping Table

| Figma UI Control | Figma Value | Functional Class Syntax | CSS Implementation |
| :--- | :--- | :--- | :--- |
| **Direction** | Horizontal `→` | `hbox` | `flex-direction: row` |
| | Vertical `↓` | `vbox` | `flex-direction: column` |
| **Resizing (W)** | Fixed `[---]` | `w(120)`, `w(320)` | `width: N; flex: 0 0 auto;` |
| | Hug `>---<` | `w(hug)` | `width: max-content;` |
| | Fill `[<->]` | `w(fill)` | `flex: 1; min-width: 0;` |
| **Resizing (H)** | Fixed `[|]` | `h(48)` | `height: N; flex: 0 0 auto;` |
| | Hug `>|<` | `h(hug)` | `height: max-content;` |
| | Fill `[|^|]` | `h(fill)` | `align-self: stretch; height: auto;` (in Row)<br>`flex: 1; min-height: 0;` (in Col) |
| **Spacing Mode** | Packed | `pack(start)` (Default) | `justify-content: flex-start` |
| | | `pack(center)` | `justify-content: center` |
| | | `pack(end)` | `justify-content: flex-end` |
| | Space Between | `pack(space)` | `justify-content: space-between` |
| **Alignment** | Top / Left | `align(start)` | `align-items: flex-start` |
| | Center | `align(center)` | `align-items: center` |
| | Bottom / Right | `align(end)` | `align-items: flex-end` |
| | Stretch (Text) | `align(stretch)` | `align-items: stretch` |

---

## 3. Example Scenarios

### Scenario A: The Standard Header (Space Between)
*Figma: Horizontal, Fill Width, Space Between, Align Center*

```html
<div class="hbox w(fill) pack(space) align(center)">
  <div class="logo">Logo</div>
  <div class="nav">Menu</div>
</div>
```

### Scenario B: The Card (Stacked, Top-Left)
*Figma: Vertical, Fixed Width, Hug Height, Packed Top-Left*

```html
<div class="vbox w(320) h(hug) pack(start) align(start)">
  <div class="image h(200) w(fill)">Image</div>
  <div class="content w(fill) h(hug)">Text</div>
</div>
```

### Scenario C: The Centered Hero (Center / Center)
*Figma: Vertical, Fill Screen, Packed Center, Align Center*

```html
<div class="vbox w(screen) h(screen) pack(center) align(center)">
  <h1>Hero Title</h1>
</div>
```

---

## 4. Addressing `h="fill"` Ambiguity

You specifically asked about `h="fill"`. Like `w="fill"`, this also depends on the parent context, but our CSS Child Combinator strategy handles it effortlessly.

```css
/* CASE: Parent is Row (HBox) */
/* h="fill" means "Stretch Height to match container" */
.hbox > .h\(fill\) {
  align-self: stretch;
  height: auto; 
}

/* CASE: Parent is Column (VBox) */
/* h="fill" means "Share Vertical Space" */
.vbox > .h\(fill\) {
  flex-grow: 1;
  min-height: 0;
}
```

This confirms that the class-based functional syntax + context-aware CSS is a complete solution for porting the Figma mental model to code.
