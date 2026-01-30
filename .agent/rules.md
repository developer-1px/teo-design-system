# Project Rules

## 1. Style System (Vanilla Extract)

### Surface System
The `surface` token is the primary unit of styling for UI elements. It is not just a color, but a **Semantic Set** comprising:
- `bg`: Background color
- `text`: Text color
- `border`: Border style
- `shadow`: Box shadow
- `hoverBg`: Background color on hover

**Do NOT** assign background colors manually. Always use the `surface()` utility.

### Style Composition (Mixins)
Use **Array Syntax** for `style()` when using Mixins (functions that return style objects like `surface` or `subgrid`). This ensures a clear separation between **Behavior/Theme** (Mixin) and **Structure/Layout** (Local Styles).

```typescript
// ✅ Good: Array Syntax
import { surface, subgrid } from '../styles/utils.css';

export const row = style([
    subgrid('x'),      // Behavior 1: Subgrid Layout
    surface('card'),   // Behavior 2: Surface Theme
    {
        height: '40px', // Structure: Local overrides
        alignItems: 'center'
    }
]);

// ❌ Bad: Spread Syntax
export const row = style({
    ...subgrid('x'),   // Hard to distinguish layer hierarchy
    ...surface('card'),
    height: '40px',
});
```

### Theme Contracts
All theme tokens must be defined in `vars.css.ts` using `createThemeContract` to ensure Type Safety across Light and Dark modes.

## 2. Red Team Protocols
- **Inbox Mandate**: All "Red Team" audits, reports, and architectural critiques must be created in `/docs/inbox`.
- **Refactoring Strategy**: Significant architectural refactoring should be planned with `ts-morph` automation scripts where possible.

## 3. Architecture Standards

### Component Tiering
Components must be classified into tiers to prevent circular dependencies and maintain clarity:
- **Primitives** (`src/components/primitives`): Dependency-free atoms (e.g., Button, Badge, Input). Pure UI.
- **Composites** (`src/components/composites`): Molecules combining primitives (e.g., Table, SearchFilterBar).
- **Layout** (`src/components/layout`): Structural shells (e.g., Sidebar, PageLayout).

### Feature Anatomy
All feature modules (`src/features/*`) must adhere to strict Separation of Concerns:
- `components/`: React View Layer (Visuals only).
- `model/`: Data Layer (Types, Constants, simple pure functions).
- `hooks/`: logic Layer (State management, API calls, side effects).

### Logic Extraction
- **Headless First**: Logic should exist outside of UI components whenever possible.
- **Global Kernel**: Shared logic goes to `src/hooks` or `src/utils`.

## 4. Documentation & Workflow
- **Plan First**: Always create a `task.md` or `implementation_plan.md` before coding complex features.
- **Visuals**: Use Mermaid diagrams for architecture flows.
- **Single Source of Truth**: Documentation should live close to the code or in dedicated `docs/` folders, avoiding duplication.
