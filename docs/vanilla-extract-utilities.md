# Vanilla Extract Utilities Documentation

This document provides a MECE (Mutually Exclusive, Collectively Exhaustive) overview of all Vanilla Extract utilities available in the project. These utilities are designed to enforce design consistency, type safety, and efficient styling.

---

## 1. Core Utilities (Sprinkles)
**Location:** `src/design-system/sprinkles.css.ts`

The foundational atomic CSS layer. Use this for 80% of your styling needs involving spacing, layout, and typography.

### `atoms`
A function that generates atomic classes based on defined properties and conditions (responsive breakpoints, color modes).

```typescript
import { atoms } from "@/design-system/sprinkles.css";

// Usage
className={atoms({
  display: "flex",
  flexDirection: { mobile: "column", tablet: "row" },
  padding: "n4",
  gap: "n2",
  color: "primary"
})}
```

**Categories Covered:**
- **Layout:** `display`, `flex`, `grid`, `position`, `overflow`, `zIndex`
- **Spacing:** `padding`, `margin`, `gap`
- **Sizing:** `width`, `height`, `maxWidth`, `minWidth`
- **Typography:** `fontSize`, `fontWeight`, `textAlign`
- **Interactive:** `cursor`, `mixBlendMode`

---

## 2. Mixin Utilities
**Location:** `src/design-system/mixins.ts` & `src/ui/utils.css.ts`

Reusable style objects and functions for common UI patterns that are too complex for simple atoms.

### 2.1 Typography
| Utility | Type | Description |
| :--- | :--- | :--- |
| `truncate` | Object | Forces text to single line with ellipsis (`...`). |
| `lineClamp(n)` | Function | Limits text to `n` lines with ellipsis. |

### 2.2 Visual & Accessibility
| Utility | Type | Description |
| :--- | :--- | :--- |
| `visuallyHidden` | Object | Hides content visually but keeps it accessible to screen readers. |
| `hideScrollbar` | Object | Hides scrollbars (Firefox/Webkit) while allowing scrolling. |

### 2.3 Positioning & Layout
| Utility | Type | Description |
| :--- | :--- | :--- |
| `absoluteFill` | Object | Positions absolute covering parent (`top:0, left:0...`). |
| `layout.flexCenter` | Object | `flex` + `center` alignment (both axes). |
| `layout.flexRow` | Object | `flex` + `center` alignment (vertical only). |
| `layout.absoluteFull` | Object | Alias for `absoluteFill`. |
| `layout.gridSubgrid` | Object | Sets `display: grid` and `grid-template-columns: subgrid`. |

### 2.4 Motion
| Utility | Type | Description |
| :--- | :--- | :--- |
| `transition(props, duration?, timing?)` | Function | Standardizes transitions using theme tokens. Default: `normal`, `easeInOut`. |

---

## 3. Strict Layout Factories (Type Safety)
**Location:** `src/ui/utils.css.ts`

Utilities designed to enforce strict separation of concerns and prevent invalid CSS combinations (e.g., using Flex props on a Grid container).

### 3.1 Constraints
| Function | Description |
| :--- | :--- |
| `createGrid(style)` | Accepts only Grid-compatible properties. Errors if Flex props are used. |
| `createFlex(style)` | Accepts only Flex-compatible properties. Errors if Grid props are used. |

### 3.2 Styled Factory (Experimental)
Separates "Parent Positioning" props from "Internal Layout" props.

- **`styled.box`**: Generic box.
- **`styled.flex`**: Enforces `display: flex`.
- **`styled.grid`**: Enforces `display: grid`.

```typescript
export const container = styled.flex({
  parent: { marginTop: "n4", gridColumn: "span 2" }, // External positioning
  layout: { flexDirection: "column", gap: "n2" }      // Internal layout
});
```

---

## 4. Grid System Utilities
**Location:** `src/ui/utils.css.ts`

Specialized grid patterns for consistent layouts.

### 4.1 Master Grid (`grid12`)
A 12-column master grid system.
- `grid12.root`: Defines the 12-col container.
- `grid12.subgrid`: Passes the grid down to children.
- `grid12.span(n)`: Spans `n` columns.
- `grid12.center(n)`: Centers an element spanning `n` columns.
- `grid12.fullWidth`: Spans `1 / -1`.

### 4.2 Form Grid (`gridForm`)
Standardized 2-column layout for forms (Label | Input).
- `gridForm.root`: Container.
- `gridForm.label`: column 1.
- `gridForm.input`: column 2.
- `gridForm.full`: spanned across both.

### 4.3 Named Grid Factory (`createNamedGrid`)
**Recommended for complex layouts.** Generates type-safe grid areas.

```typescript
const layout = createNamedGrid({
  areas: ["header", "content"],
  columns: "1fr",
  templateAreas: ['"header"', '"content"']
});
// Use: layout.container, layout.assign("header")
```

---

## 5. Surface System
**Location:** `src/design-system/surfaces.css.ts` & `src/design-system/mixins.ts`

Utilities for managing background colors, borders, and shadows consistently.

### 5.1 Recipe (`surface`)
A **Vanilla Extract Recipe** handling complex variants and states (hover, active, disabled, selected, error).
**Variants:** `base`, `subtle`, `sunken`, `raised`, `overlay`, `primary`.

### 5.2 Mixin (`surface` function)
Legacy/Simple function-based approach in `mixins.ts`.
- `surfaces.card`: Preset for cards.
- `surfaces.panel`: Preset for panels.
- `surfaces.elevated`: Preset for floating elements.

> **Note:** Prefer the Recipe (`src/design-system/surfaces.css.ts`) for React components, and the Mixin for raw style object composition.
