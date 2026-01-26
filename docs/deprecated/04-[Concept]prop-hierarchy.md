# Frame Prop Hierarchy

To ensure design consistency while allowing necessary flexibility, we define a clear 3-level hierarchy for `Frame` properties.

## The Hierarchy

1.  **Restricted Style** (Highest Precedence, "Escape Hatch")
2.  **Overrides** (Middle Precedence, "1-Tier Token Tweaks")
3.  **Preset Props** (Base Precedence, "2-Tier Semantic Design")

---

### 1. Restricted Style `style={{ ... }}`
*   **Role**: The "Escape Hatch".
*   **Usage**: Only for CSS properties **NOT** covered by the design system (e.g., `transform`, `filter`, `perspective`) or for **dynamic/data-driven values** (e.g., `backgroundColor: user.color`).
*   **Restriction**: 
    *   **Blocked**: Layout & Spacing (`width`, `height`, `margin`, `padding`, `gap`, `zIndex`). These typically destroy the layout system integrity.
    *   **Allowed**: Paint, Interaction, & Keywords (`color`, `cursor`, `flex`, `grid`). Properties that use standard CSS keywords are safe.
*   **Precedence**: Overrides everything else.

### 2. Overrides `override={{ ... }}`
*   **Role**: **"Token-Strict Tweaks"**.
*   **Usage**: When you need to deviate from the simplified "Strict Props" preset but **STILL** want to stay within the Design System.
*   **Restriction**: **Strictly 1-Tier Tokens only**. Do NOT use arbitrary values here.
    *   *Correct*: `override={{ w: Size.n320 }}`
    *   *Incorrect*: `override={{ w: "33px" }}` (Use `style` for this if absolutely necessary)
*   **Precedence**: Overrides Preset Props.

### 3. Preset Props (Top Level) `...`
*   **Role**: **"2-Tier Semantic Design"**.
*   **Definition**: Configurations based on the 3 Design Elements: **Surface (면), Border (선), Spacing (간격)**.
*   **Usage**: The standard way to build UI. These are simplified interfaces that map to multiple 1-Tier tokens or specific design logic.
*   **Future Vision**: Will evolve into simplified categories: `surface`, `layout`, `sizing`, `behavior` (Gradual Migration).
*   **Examples**: `gap`, `row`, `pack`, `fill`, `border`, `rounded`.
*   **Precedence**: Base level.

---

## Why this hierarchy?
We want to **induce** usage of **Preset Props** (2-Tier) for most work.
- Use **Preset Props** for standard layouts (Surface, Border, Spacing).
- Use **Overrides** (1-Tier) only when you need detailed token adjustments.
- Use **Restricted Style** only for raw CSS or dynamic values.
