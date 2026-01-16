# Standardized Component Categorization

This proposal re-classifies the `Frame` interface based on **Universal Design Theory** (CSS Box Model) and **Industry Standards** (Figma Auto Layout terminology).
The goal is zero abstraction: every category maps directly to how browsers render pixels.

---

## The Taxonomy: "Box, Layout, Paint"
Aligning with the browser's rendering engine and modern design tools.

### 1. Layout (Container Logic)
*   **Industry Standard**: Figma "Auto Layout", CSS "Flexbox/Grid".
*   **Definition**: How this container simply **arranges its children**.
*   **Keywords**: `Direction`, `Gap`, `Distribution` (Justify/Align), `Padding` (In Figma, padding is part of the layout container).
*   **CSS Mapping**: `display`, `flex-direction`, `gap`, `justify-content`, `align-items`, `padding`.
*   **Why**: This answers "How does the content flow inside me?"

### 2. Sizing (Dimensional Constraints)
*   **Industry Standard**: Figma "Resizing" (Hug/Fill/Fixed), CSS Box Sizing.
*   **Definition**: How the container **sizes itself** within its parent.
*   **Keywords**: `Width`, `Height`, `Min/Max`, `Aspect Ratio`, `Shrink/Grow`.
*   **CSS Mapping**: `width`, `height`, `min-width`, `flex-basis`, `flex-grow`, `aspect-ratio`.
*   **Why**: This answers "How much space do I take up?"

### 3. Appearance (Visual Decoration)
*   **Industry Standard**: Figma "Appearance" / "Fill & Stroke", CSS "Decoration".
*   **Definition**: Visual properties that do not (usually) affect layout flow.
*   **Keywords**: `Fill` (Background), `Stroke` (Border), `Compass` (Radius), `Effects` (Shadow, Opacity).
*   **CSS Mapping**: `background-color`, `border`, `border-radius`, `box-shadow`, `opacity`.
*   **Why**: This answers "What do I look like?"

### 4. Positioning (Delegated)
*   **Status**: **REMOVED from Frame**
*   **Responsibility**: `Overlay`, `Absolute`, or specialized containers.
*   **Reasoning**: `Frame` should focus on flow (Layout) and substance (Appearance). Positioning is about "where I am relative to the viewport/parent", which is a higher-order concern often involving Portals or Z-Context.
*   **Exceptions**: `relative` might be needed for `Overlay` anchors, but `absolute`/`fixed`/`z-index` should be externalized.

---

## Comparision with Previous Terms

| Previous (Arbitrary) | **New (Standardized)** | Reasoning |
| :--- | :--- | :--- |
| **Surface** | **Appearance** | "Surface" is abstract. "Appearance" or "Decoration" is standard CSS terminology for visuals. |
| **Layout** | **Layout** | Kept. Maps perfectly to Figma Auto Layout / Flexbox. |
| **Sizing** | **Sizing** | Kept. Standard term for Dimensions. |
| **Behavior** | *(Removed/Split)* | "Behavior" is vague. Scroll goes to **Layout** (overflow), Click goes to Events. |

---

## Applied to API (Example)

```tsx
<Frame
  // 1. Layout (Inner Flow)
  flow="row"         // flex-direction
  gap="n4"           // gap
  align="center"     // align-items (Cross axis)
  distribute="start" // justify-content (Main axis)
  padding="n4"       // padding (Part of layout context)

  // 2. Sizing (Outer Constraints)
  width="fill"       // width: 100% / flex-grow: 1
  height="hug"       // height: auto
  
  // 3. Appearance (Visuals)
  fill="card"        // background-color token
  stroke="default"   // border token
  radius="n2"        // border-radius
  
  // 4. Positioning -> MOVED TO <Overlay />
  // z="n10" 
/>
```

## Architecture: Frame vs Overlay
*   **Frame**: The "Body". Handles what is *inside* and how it *looks*.
*   **Overlay**: The "Ghost". Handles where the body *floats* and how it *layers*.
