# Context-Aware Layout: Solving the "Fill" Ambiguity

## 1. The Challenge: Axis Dependency

You asked a sharp question:
> *"If we make `w='fill'`, don't we need to know the parent's property (Row vs Column)?"*

**Yes, absolutely.**
The definition of "Fill Width" changes entirely based on the parent's Flex Direction:

| Parent Context | "Fill Width" Implementation | Mechanism |
| :--- | :--- | :--- |
| **Row (`hbox`)** | `flex-grow: 1` | Main Axis Expansion |
| **Column (`vbox`)** | `width: 100%` (or `align-self: stretch`) | Cross Axis Stretch |

If we calculate this in JavaScript (React Context), we introduce:
1.  **Render Overhead**: Every Frame needs to subscribe to a LayoutContext.
2.  **Complexity**: Wrappers and HOCs to pass context down.

---

## 2. The Solution: CSS Child Combinators (Zero-Runtime)

We can solve this purely in **CSS** by strictly classifying our containers.
If every Flex container carries a class (e.g., `.hbox` or `.vbox`), we can use the **Child Combinator (`>`)** to apply the correct rule.

### Technical Strategy

#### Step 1: Strict Classes on Parent
Ensure that your `Frame` component applies a semantic class based on its layout prop.
```typescript
// Frame.tsx
const className = clsx(
  layout === 'hbox' && 'hbox',
  layout === 'vbox' && 'vbox',
  // ...
);
```

#### Step 2: Data Attributes on Child
Instead of parsing `w="fill"` into inline styles, render it as a data attribute.
```typescript
// Child Frame
<div data-sizing-w="fill" />
```

#### Step 3: Context-Aware CSS
Define the logic once in your global CSS. The browser handles the "Context Awareness" for us.

```css
/* CASE A: Child is inside a Row (HBox) */
/* w="fill" means "Share the horizontal space" -> Flex Grow */
.hbox > [data-sizing-w="fill"] {
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0; /* Solves the auto issue! */
  width: auto;
}

/* CASE B: Child is inside a Column (VBox) */
/* w="fill" means "Stretch horizontally" -> Width 100% */
.vbox > [data-sizing-w="fill"] {
  align-self: stretch;
  width: 100%;
  flex-grow: 0; /* Do not grow vertically by accident */
}
```

### The Result
You can now write Figma-like code without worrying about the implementation details:

```tsx
<Frame layout="vbox">
  {/* Automatically becomes width: 100% */}
  <Frame w="fill" /> 
  
  <Frame layout="hbox">
    {/* Automatically becomes flex: 1 */}
    <Frame w="fill" /> 
  </Frame>
</Frame>
```

---

## 3. Alternative: "Universal Stretch" (The Flex-1 Hack)

There is a simpler, hackier way that works in *most* (but not all) cases.
If you set:
```css
[w="fill"] {
  flex: 1 1 0px;
  width: 100%;
}
```
- In **Row**: `flex: 1` wins. It ignores `width: 100%` (mostly) and uses `flex-basis: 0` to distribute space.
- In **Col**: `width: 100%` makes it wide. `flex: 1` makes it grow tall options.
- **Problem**: This makes the item grow in *both* dimensions effectively. If you wanted `w="fill"` but `h="fixed"`, this hack fails in a Column layout (it would grow height too).

**Conclusion**: The **CSS Child Combinator** strategy is the robust, "Smart" solution. It requires a disciplined class system (`hbox`/`vbox`), which fits perfectly with the MDK design philosophy.
