# File Naming Convention (v5.0)

As of version 5.0, the IDDL project adopts a strict file naming convention to improve discoverability, maintainability, and code organization. This convention eliminates generic filenames and enforces descriptive naming.

## Principles

1.  **Descriptive Names**: Filenames must clearly indicate their content. Avoid `index.ts`, `types.ts`, `styles.ts` unless absolutely necessary (and even then, prefer specific names).
2.  **Explicit Imports**: Barrel files (files that only re-export others) are discouraged, especially for types. Import directly from the source file.
3.  **Co-location**: Related files (components, types, styles, renderers) should be grouped together in the same directory.

## Conventions

### Type Definitions

*   **Format**: `[ComponentName].types.ts`
*   **Example**: `Page.types.ts`, `Section.types.ts`, `Block.types.ts`
*   **Why**: Makes it easier to find type definitions using fuzzy search (Ctrl/Cmd + P) and distinguishes them from component implementation files.

### Configuration & Constants

*   **Format**: `[ComponentName].config.ts` or `[ComponentName].constants.ts`
*   **Example**: `role-config.ts` (for Role configurations), `interactive-tokens.ts`
*   **Why**: Clearly separates configuration data from type definitions and logic.

### Components

*   **Format**: `[ComponentName].tsx`
*   **Example**: `Page.tsx`, `Section.tsx`
*   **Note**: Directory integration files like `index.ts` should be avoided if they just re-export the main component. Import directly from `[ComponentName].tsx`.

## Migration Status

The following migrations have been completed:

*   `src/components/types/Page/types.ts` -> `Page.types.ts`
*   `src/components/types/Section/types.ts` -> `Section.types.ts`
*   `src/components/types/Block/types.ts` -> `Block.types.ts`
*   `src/components/types/Overlay/types.ts` -> `Overlay.types.ts`
*   `src/components/types/Element/Text/types.ts` -> `Text.types.ts`
*   `src/components/types/Element/Action/types.ts` -> `Action.types.ts`
*   `src/components/types/Element/Field/types.ts` -> `Field.types.ts`
*   `src/components/types/shared.ts` -> `Shared.types.ts`
*   `src/components/types/Element/types.ts` has been **removed**.

## Import Guidelines

**Bad:**
```typescript
import { PageProps } from '@/components/types/Page/types'; // Generic name
import { SectionProps } from '@/components/types/Element/types'; // Barrel file
```

**Good:**
```typescript
import { PageProps } from '@/components/types/Page/Page.types';
import { SectionProps } from '@/components/types/Section/Section.types';
```
