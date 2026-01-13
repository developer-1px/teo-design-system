# Minimal Design Kit: Retrospective & Feedback

Having implemented multiple complex applications (Linear, Slide, CMS) using the Minimal Design Kit, several patterns, strengths, and critical limitations have emerged. This document serves as a feedback loop for the next iteration of the design system.

## 1. Components & Primitives

### Frame: The "Div" Problem
The `Frame` component is the workhorse, replacing `div`. However, its initial strictness caused friction:
*   **Sizing Constraints**: We frequently needed `maxWidth`, `minWidth`, `maxHeight`, and `minHeight` for real-world layouts (sidebars, card grids, sticky headers). These were missing initially and added ad-hoc.
*   **Radius Limitations**: The `radius` prop was too opinionated (`pill` vs `round`). Real apps need `sm`, `md`, `lg`, `xl`, etc., or direct pixel values for "pixel-perfect" clones. We had to patch this to support `full` and numeric values.
*   **Scroll Management**: `overflow` props were crucial but sometimes insufficient without explicit height management, leading to layout breaks in "app-like" full-height interfaces.

### Text: Hierarchy vs. Reality
*   **Variant Rigidity**: The 4-level variant system (`1 | 2 | 3 | 4`) is great for consistency but failed for "Marketing" contexts (e.g., CMS Hero sections) where we needed massive display fonts (80px+). We often resorted to `style={{ fontSize: 80 }}`.
*   **Missing Semantic Tokens**: A conceptual gap exists between "Product UI" text (dense, small) and "Content" text (readable, loose).

### Action: The Button Overload
*   `Action` tried to do too much: buttons, icon-only toggles, navigational links, and tooltips.
*   **Complex States**: It lacked native support for sophisticated states like "Active + Hover" or distinct "Selected" visual styles distinct from "Pressed".

## 2. Missing Primitives

### Grid System
We consistently simulated grids using nested `Frame`s (Flexbox).
*   **Bento Grids**: Building complex dashboard layouts (like the CMS Features section) was verbose. A true `Grid` component with `columns`, `rows`, and `gap` props would reduce boilerplate significantly.

### Form Inputs
*   **The "Editable" Gap**: The kit lacks native `Input`, `Textarea`, or `Select` components.
*   We relied on `contentEditable` for the CMS, which is fragile. For a real app, a standardized input system sharing the `Frame` aesthetics (height tokens, radius, borders) is critical.

### Z-Index & Portals
*   **Floating Elements**: Floating toolbars and sticky headers required manual `zIndex` values (10, 40, 50, 100). This inevitably leads to wars. A `Layer` or `ZStack` primitive, or a compiled z-index registry, would be safer.

## 3. Developer Experience (DX)

### Token Type Safety
*   We invoke tokens via strings: `gap={4}` maps to `var(--space-4)`.
*   **Color Tokens**: Colors are often opaque strings (`var(--color-primary)`). If we mistyped a variable name in a `style` prop, there was no TS warning. Exposing tokens as a TypeScript object (e.g., `Tokens.color.primary`) would improve safety.

### "Too Many Frames"
*   The DOM structure became deeply nested with `div` soup (`Frame > Frame > Frame`).
*   While semantically neutral, debugging layout issues in DevTools involved sifting through dozens of identical-looking divs.

## 4. Aesthetics & Theme

### The "Zinc" Monotony
*   The system excels at "Clean/Minimal".
*   **Lack of Brand**: However, injecting "Brand" (e.g., a purple sidebar or a colorful header) required overriding the `surface` system or using raw inline styles. The `surface` prop (1-4) assumes a monochrome scale. Adding an `accent` or `tint` prop to `Frame` would allow for branded zones without breaking the system.

## Summary

The **Minimal Design Kit** successfully prevents "design drift" by enforcing constraints. However, as applications scale from simple tools to complex dashboards (CMS, IDEs), the **Flexibility** of the primitives needs to scale.

**Top 3 Recommendations:**
1.  **Unlock `Frame`**: Native support for all layout constraints (max/min W/H) and numeric values.
2.  **Add `Grid`**: First-class CSS Grid support.
3.  **Formalize `Inputs`**: A form primitive system matching the visual language.
