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

### Style Composition
Use **Array Syntax** for `style()` to compose the base surface with component-specific overrides.

```typescript
// ✅ Good
import { surface } from '../styles/utils.css';

export const card = style([
    surface('card'), // Applies bg, text, border, shadow, AND hover transition
    {
        padding: '16px',
        // ... overrides
    }
]);

// ❌ Bad
export const card = style({
    backgroundColor: vars.surface.card.bg, // Missing interaction and other props
    color: vars.surface.card.text,
});
```

### Theme Contracts
All theme tokens must be defined in `vars.css.ts` using `createThemeContract` to ensure Type Safety across Light and Dark modes.
