# Design System Conventions

## No Hardcoded Pixels (px)
- **Strict Rule**: Never use hardcoded `px` values in component styles or props.
- **Token Usage**: All spacing, sizing, radius, and border properties must resolve to tokens.
- **Frame Component**: The `Frame` component is the primary layout tool. It automatically maps numeric values to tokens:
  - `p`, `m`, `gap`, `top`, `left`, etc. (Shorthands) -> `var(--space-*)`
  - `w`, `h`, `minWidth`, etc. -> `var(--size-*)`
  - `rounded` -> `var(--radius-*)`
- **Fallback**: If a value is not a token number (e.g., `100%`, `auto`, `inherit`), it is passed through as-is.

## Convergent Evolution (Philosophy)
- Design should be minimal, focusing on functionality and intention.
- Web Application focused.
- Surface area should imply padding (e.g., if a `Frame` has a `surface`, it defaults to `p={3}`).
