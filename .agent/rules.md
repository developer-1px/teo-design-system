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
