# Registry Pattern - IDDL Component Architecture

## Overview

The **Registry Pattern** is a centralized configuration system for IDDL components. It provides a unified way to define, register, and retrieve role-based component configurations across all IDDL component types.

**Status**: ✅ Implemented (as of 2026-01-11)
**Version**: v4.1
**Affected Components**: Page, Section, Block, Action, Overlay (+ Text with specialized config, Field with runtime registry)

---

## Motivation

### Problems Before Registry Pattern

1. **Scattered Configuration**: Role-to-renderer mappings were hardcoded in switch statements within component files
2. **Inconsistent Naming**: `role-config.ts` vs `registry.ts` vs `configs/registry.ts`
3. **No Type Safety**: No shared base interface for role configurations
4. **Hard to Extend**: Adding custom roles required modifying component source code
5. **Duplication**: Each component re-implemented similar registry logic differently

### Benefits of Registry Pattern

1. **Centralized Configuration**: All role definitions in one place (`role-registry.ts`)
2. **Type Safety**: `BaseRoleConfig` interface enforced across all components
3. **Runtime Extensibility**: Custom roles can be registered via `registerRole()`
4. **Consistent API**: `getRoleConfig()`, `hasRenderer()`, `getRegisteredRoles()` standard across all components
5. **Better DX**: Clear separation of concerns, easier to understand and maintain
6. **Documentation**: Registry serves as live documentation of all available roles

---

## Architecture

### Core Type: `BaseRoleConfig`

Located in `/src/components/types/shared/role.base.ts`:

```typescript
export interface BaseRoleConfig<Props = any> {
  /** HTML semantic tag to render */
  htmlTag: keyof React.JSX.IntrinsicElements;

  /** ARIA accessibility attributes */
  ariaProps?: Record<string, string | boolean | number>;

  /** Base Tailwind CSS classes */
  baseStyles?: string;

  /** Optional custom renderer component */
  renderer?: ComponentType<Props>;

  /** Developer-facing description */
  description?: string;
}
```

### Extended Type: `ExtendedRoleConfig`

For components needing additional properties (e.g., Section with `gridArea` and `overflow`):

```typescript
export interface ExtendedRoleConfig<Props = any> extends BaseRoleConfig<Props> {
  gridArea?: string;
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible';
  defaultSize?: { width?: string; height?: string; /* ... */ };
  physics?: string;
}
```

### Registry API

All component registries implement this standard API:

```typescript
export interface RoleRegistryAPI<Role extends string, Config> {
  getRoleConfig(role: Role): Config;
  hasRenderer(role: Role): boolean;
  registerRole(role: Role | string, config: Config): void;
  getRegisteredRoles(): Role[] | string[];
}
```

---

## Component-Specific Implementations

### 1. Page (`/src/components/types/Page/role-registry.ts`)

**Roles**: 7 roles (Document, Application, Focus, Fullscreen, Immersive, Overlay, Paper)

**Config Type**: `PageRoleConfig extends BaseRoleConfig<PageProps>`

**Additions**:
- `physics`: Physical behavior configuration (viewport, scroll, overflow, position)
- `supportsMaxWidth`: Whether role supports max-width constraint
- `supportsCentered`: Whether role supports centered layout
- `usesGrid`: Whether role uses CSS Grid layout
- `defaultProminence`: Default prominence level

**Example**:
```typescript
Document: {
  htmlTag: 'div',
  ariaProps: { role: 'main' },
  baseStyles: 'relative min-h-screen w-full overflow-y-auto flex flex-col',
  physics: {
    heightConstraint: 'content',
    scrollBehavior: 'window',
    overflow: 'auto',
    position: 'relative',
  },
  supportsMaxWidth: true,
  supportsCentered: true,
  usesGrid: false,
  defaultProminence: 'Standard',
  description: 'Standard web document with window scroll (Blog, News, Docs)',
}
```

**Usage in Component**:
```typescript
export function Page({ role = 'Document', ...props }: PageProps) {
  const roleConfig = getRoleConfig(role); // Validates role
  // ... rest of component logic
}
```

---

### 2. Section (`/src/components/types/Section/configs/registry.ts`)

**Roles**: 50+ roles (modular by layout - Studio, HolyGrail, Sidebar, etc.)

**Config Type**: `RoleConfig extends ExtendedRoleConfig<SectionProps>`

**Additions** (from ExtendedRoleConfig):
- `gridArea`: CSS Grid area name
- `overflow`: Overflow behavior

**Structure**: Modular registry by layout
```typescript
export const ROLE_REGISTRY = {
  universal: { Main, Header, Footer, Nav, Aside, ... },
  Studio: { ActivityBar, PrimarySidebar, Editor, Panel, ... },
  HolyGrail: { Header, Nav, Main, Aside, Footer, ... },
  Sidebar: { Header, Nav, Main, Footer, ... },
  // ...
};
```

**Example**:
```typescript
universal: {
  Main: {
    gridArea: 'main',
    overflow: 'auto',
    htmlTag: 'main',
    ariaProps: { role: 'main' },
    baseStyles: 'flex flex-col',
    description: 'Primary content area (universal)',
  },
}
```

**Usage in Component**:
```typescript
export function Section({ role = 'Main', ...props }: SectionProps) {
  const parentCtx = useLayoutContext();
  const config = getRoleConfig(role as string, parentCtx.layout as any);
  const { gridArea, overflow, htmlTag, ariaProps, baseStyles } = config;
  // ... rest of component logic
}
```

---

### 3. Block (`/src/components/types/Block/role-registry.ts`)

**Roles**: 25+ roles (Container, Card, Form, Toolbar, List, Grid, Tabs, Accordion, etc.)

**Config Type**: `BlockRoleConfig extends BaseRoleConfig<BlockProps>`

**No Additions**: Uses BaseRoleConfig directly

**Example**:
```typescript
Card: {
  htmlTag: 'div',
  ariaProps: { role: 'article' },
  baseStyles: 'bg-surface rounded-lg border border-default p-4',
  renderer: Layout.Card,
  description: 'Boxed content card with border and padding',
}
```

**Usage in Component**:
```typescript
export function Block({ role = 'Container', ...props }: BlockProps) {
  const roleConfig = getRoleConfig(role);
  const { htmlTag, ariaProps, baseStyles, renderer } = roleConfig;

  if (renderer) {
    const Renderer = renderer;
    return <Renderer {...props} />;
  }
  // Fallback rendering
}
```

---

### 4. Action (`/src/components/types/Element/Action/role-registry.ts`)

**Roles**: 3 roles (Button, IconButton, Link)

**Config Type**: `ActionRoleConfig extends BaseRoleConfig<ActionProps>`

**No Additions**: Uses BaseRoleConfig directly

**Example**:
```typescript
Button: {
  htmlTag: 'button',
  ariaProps: { role: 'button' },
  baseStyles: '',
  renderer: ButtonAction,
  description: 'Standard button with prominence and intent variations',
}
```

**Usage in Component**:
```typescript
export function Action({ role = 'Button', ...props }: ActionProps) {
  const config = getRoleConfig(role);
  if (config.renderer) {
    const Renderer = config.renderer;
    return <Renderer {...rendererProps} />;
  }
  // Fallback
}
```

---

### 5. Overlay (`/src/components/types/Overlay/role-registry.ts`)

**Roles**: 8 roles (Dialog, Drawer, Sheet, Popover, Toast, Tooltip, Lightbox, Floating)

**Config Type**: `OverlayRoleConfig extends BaseRoleConfig<OverlayProps>`

**Additions**:
- `hasBackdrop`: Whether overlay shows dimmed background
- `supportsDismiss`: Whether overlay can be dismissed on backdrop click
- `zIndex`: Default z-index level
- `defaultPlacement`: Default placement position

**Example**:
```typescript
Dialog: {
  htmlTag: 'div',
  ariaProps: { role: 'dialog', 'aria-modal': 'true' },
  baseStyles: 'bg-surface-overlay rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto',
  hasBackdrop: true,
  supportsDismiss: true,
  zIndex: 50,
  defaultPlacement: 'center',
  description: 'Modal dialog with backdrop and dismiss support',
}
```

**Usage in Component**:
```typescript
export function Overlay({ role, ...props }: OverlayProps) {
  const roleConfig = getRoleConfig(role); // Validates role
  // Rendering logic kept inline (each role is very different)
}
```

**Note**: Overlay uses registry for validation and configuration, but keeps rendering logic inline due to vastly different role behaviors.

---

### 6. Text (Specialized Config System)

**Location**: `/src/components/types/Element/Text/configs/`

**Type System**: `SimpleRoleConfig` | `ComplexRoleConfig` (discriminated union)

Text uses a **specialized config system** optimized for its domain:

```typescript
// Simple roles (HTML tag mapping)
export interface SimpleRoleConfig {
  type: 'simple';
  htmlTag: keyof React.JSX.IntrinsicElements;
  ariaRole?: string;
  baseStyles?: string;
  prominence?: { Hero?: string; Strong?: string; Standard?: string; Subtle?: string; };
  description?: string;
}

// Complex roles (custom renderer)
export interface ComplexRoleConfig {
  type: 'complex';
  renderer: ComponentType<TextProps>;
  fallback?: SimpleRoleConfig;
  description?: string;
}
```

**Roles**: 16 roles across 4 categories
- Typography (5): Title, Heading, Body, Label, Caption
- Inline (5): Strong, Emphasis, Mark, Link, Code
- Indicator (5): Badge, Alert, Avatar, Kbd, Tag
- Data (1): Time

**Why Not BaseRoleConfig?**: Text has domain-specific needs (prominence variations) that don't fit the base pattern.

**Custom Registration**:
```typescript
import { registerTextRole } from '@/components/types/Element/Text/Text';

registerTextRole('Quote', {
  type: 'simple',
  htmlTag: 'blockquote',
  baseStyles: 'border-l-4 border-accent pl-4 italic',
  description: 'Custom blockquote role',
});
```

---

### 7. Field (Runtime Map Registry)

**Location**: `/src/components/types/Element/Field/role-registry.ts`

**Type System**: Runtime `Map<string, ComponentType<FieldProps>>`

Field uses a **runtime Map-based registry** for maximum flexibility:

```typescript
const fieldRenderers = new Map<string, ComponentType<FieldProps>>();

export function registerField(role: string, component: ComponentType<FieldProps>) {
  fieldRenderers.set(role, component);
}

export function getFieldRenderer(role: string): ComponentType<FieldProps> | undefined {
  return fieldRenderers.get(role);
}
```

**Roles**: 12+ roles (TextInput, NumberInput, Select, Checkbox, Switch, RadioGroup, DateInput, TimeInput, FileInput, Slider, OTPInput, TagInput, Rating, etc.)

**Why Map-Based?**: Field roles are registered at runtime during initialization (`init-fields.ts`), allowing for dynamic loading and code splitting.

**Initialization**:
```typescript
// init-fields.ts
import { registerField } from './role-registry';
import { TextField } from './renderers/TextField';

registerField('TextInput', TextField);
registerField('NumberInput', NumberField);
// ...
```

---

## Usage Patterns

### Pattern 1: Static Object Registry (Block, Action, Overlay, Page)

**When to use**: Fixed set of roles known at build time

```typescript
// 1. Define config type
export interface ComponentRoleConfig extends BaseRoleConfig<ComponentProps> {
  // Additional properties if needed
}

// 2. Create registry
export const ROLE_REGISTRY: Record<string, ComponentRoleConfig> = {
  RoleA: { htmlTag: 'div', ariaProps: {}, baseStyles: '', renderer: RendererA },
  RoleB: { htmlTag: 'section', ariaProps: {}, baseStyles: '', renderer: RendererB },
};

// 3. Export standard API
export function getRoleConfig(role: string): ComponentRoleConfig { ... }
export function hasRenderer(role: string): boolean { ... }
export function registerRole(role: string, config: ComponentRoleConfig): void { ... }
export function getRegisteredRoles(): string[] { ... }

// 4. Use in component
export function Component({ role, ...props }: ComponentProps) {
  const config = getRoleConfig(role);
  if (config.renderer) {
    const Renderer = config.renderer;
    return <Renderer {...props} />;
  }
  // Fallback rendering
}
```

---

### Pattern 2: Modular Layout Registry (Section)

**When to use**: Different role sets per layout context

```typescript
// 1. Organize by layout
export const ROLE_REGISTRY = {
  universal: { Main: {...}, Header: {...}, ... },
  Studio: { Editor: {...}, Panel: {...}, ... },
  HolyGrail: { Nav: {...}, Aside: {...}, ... },
};

// 2. Layout-aware retrieval
export function getRoleConfig(role: string, layout?: LayoutName): RoleConfig {
  const layoutName = layout?.charAt(0).toUpperCase() + layout?.slice(1).toLowerCase();

  // Check layout-specific first
  if (layoutName && ROLE_REGISTRY[layoutName]?.[role]) {
    return ROLE_REGISTRY[layoutName][role];
  }

  // Fallback to universal
  if (ROLE_REGISTRY.universal[role]) {
    return ROLE_REGISTRY.universal[role];
  }

  // Unknown role warning
  console.warn(`Unknown role "${role}"`);
  return ROLE_REGISTRY.universal.Container;
}
```

---

### Pattern 3: Runtime Map Registry (Field)

**When to use**: Dynamic role registration, code splitting

```typescript
// 1. Create Map storage
const roleRenderers = new Map<string, ComponentType<Props>>();

// 2. Register function
export function registerRole(role: string, component: ComponentType<Props>) {
  roleRenderers.set(role, component);
}

// 3. Get function
export function getRoleRenderer(role: string): ComponentType<Props> | undefined {
  return roleRenderers.get(role);
}

// 4. Initialize at runtime
import { registerRole } from './role-registry';
import { Renderer1 } from './renderers/Renderer1';

registerRole('Role1', Renderer1);
```

---

### Pattern 4: Discriminated Union Registry (Text)

**When to use**: Multiple role types with different config shapes

```typescript
// 1. Define role types
export interface SimpleRoleConfig {
  type: 'simple';
  htmlTag: keyof React.JSX.IntrinsicElements;
  // ...
}

export interface ComplexRoleConfig {
  type: 'complex';
  renderer: ComponentType<Props>;
  // ...
}

export type RoleConfig = SimpleRoleConfig | ComplexRoleConfig;

// 2. Create registry
export const ROLE_REGISTRY: Record<string, RoleConfig> = {
  Title: { type: 'simple', htmlTag: 'h1', ... },
  Badge: { type: 'complex', renderer: BadgeRenderer, ... },
};

// 3. Type guards
export function isComplexConfig(config: RoleConfig): config is ComplexRoleConfig {
  return config.type === 'complex';
}

// 4. Conditional rendering
export function Component({ role, ...props }: Props) {
  const config = getRoleConfig(role);

  if (isComplexConfig(config)) {
    const Renderer = config.renderer;
    return <Renderer {...props} />;
  }

  // Simple config - direct rendering
  const Tag = config.htmlTag;
  return <Tag className={config.baseStyles}>{children}</Tag>;
}
```

---

## File Naming Conventions

**Standard**: All component registries use `role-registry.ts`

| Component | File Path |
|-----------|-----------|
| Page | `/src/components/types/Page/role-registry.ts` |
| Section | `/src/components/types/Section/configs/registry.ts` * |
| Block | `/src/components/types/Block/role-registry.ts` |
| Action | `/src/components/types/Element/Action/role-registry.ts` |
| Overlay | `/src/components/types/Overlay/role-registry.ts` |
| Text | `/src/components/types/Element/Text/configs/registry.ts` * |
| Field | `/src/components/types/Element/Field/role-registry.ts` |

\* *Section and Text use `configs/registry.ts` due to modular config structure*

---

## Migration Guide

### From Switch Statement to Registry

**Before** (v4.0):
```typescript
export function Component({ role, ...props }) {
  switch (role) {
    case 'RoleA':
      return <RendererA {...props} />;
    case 'RoleB':
      return <RendererB {...props} />;
    default:
      return <DefaultRenderer {...props} />;
  }
}
```

**After** (v4.1):
```typescript
// 1. Create role-registry.ts
export const ROLE_REGISTRY: Record<string, RoleConfig> = {
  RoleA: { htmlTag: 'div', renderer: RendererA, ... },
  RoleB: { htmlTag: 'section', renderer: RendererB, ... },
};

export function getRoleConfig(role: string): RoleConfig { ... }

// 2. Update Component.tsx
import { getRoleConfig } from './role-registry';

export function Component({ role, ...props }) {
  const config = getRoleConfig(role);
  if (config.renderer) {
    const Renderer = config.renderer;
    return <Renderer {...props} />;
  }
  // Fallback
}
```

---

## Custom Role Registration

### Example: Registering a Custom Block Role

```typescript
import { registerRole } from '@/components/types/Block/role-registry';
import { MyCustomRenderer } from './MyCustomRenderer';

// Register custom role
registerRole('MyCustomBlock', {
  htmlTag: 'div',
  ariaProps: { role: 'region', 'aria-label': 'Custom Block' },
  baseStyles: 'bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg',
  renderer: MyCustomRenderer,
  description: 'Custom gradient block for special use cases',
});

// Use in JSX
<Block role="MyCustomBlock">
  Custom content
</Block>
```

### Example: Registering a Custom Text Role

```typescript
import { registerTextRole } from '@/components/types/Element/Text/Text';

registerTextRole('Highlight', {
  type: 'simple',
  htmlTag: 'mark',
  baseStyles: 'bg-yellow-200 px-1 rounded',
  prominence: {
    Hero: 'bg-yellow-400 font-bold',
    Strong: 'bg-yellow-300',
    Standard: 'bg-yellow-200',
    Subtle: 'bg-yellow-100',
  },
  description: 'Highlighted text with yellow background',
});

// Use in JSX
<Text role="Highlight" prominence="Strong">
  Important text
</Text>
```

---

## Best Practices

### 1. Naming Consistency
- ✅ Use `role-registry.ts` for all new registries
- ✅ Place in component directory (e.g., `/Component/role-registry.ts`)
- ✅ For modular configs, use `/configs/registry.ts`

### 2. Type Safety
- ✅ Extend `BaseRoleConfig<ComponentProps>` for simple cases
- ✅ Extend `ExtendedRoleConfig<ComponentProps>` for layout-aware components
- ✅ Create custom config type only when domain-specific properties are needed

### 3. Documentation
- ✅ Add `description` field to all role configs
- ✅ Use JSDoc comments for complex role configurations
- ✅ Group related roles with section comments

### 4. Error Handling
- ✅ Always provide fallback role in `getRoleConfig()`
- ✅ Log warnings for unknown roles in development
- ✅ Never throw errors - graceful degradation

### 5. Extensibility
- ✅ Export `registerRole()` for runtime customization
- ✅ Validate role configs in development mode
- ✅ Document custom role registration patterns

---

## Testing

### Registry API Tests

```typescript
describe('ComponentRegistry', () => {
  it('should return config for known role', () => {
    const config = getRoleConfig('KnownRole');
    expect(config).toBeDefined();
    expect(config.htmlTag).toBe('div');
  });

  it('should return fallback for unknown role', () => {
    const config = getRoleConfig('UnknownRole');
    expect(config).toBeDefined(); // Should not throw
  });

  it('should register custom role', () => {
    registerRole('CustomRole', { htmlTag: 'section', ... });
    const config = getRoleConfig('CustomRole');
    expect(config.htmlTag).toBe('section');
  });

  it('should list all registered roles', () => {
    const roles = getRegisteredRoles();
    expect(roles).toContain('KnownRole');
  });
});
```

---

## Future Enhancements

### Phase 2: Role Schema Validation
- Runtime validation of role config using Zod
- TypeScript type generation from Zod schemas
- Strict mode option for production builds

### Phase 3: Role Composition
- Allow roles to extend other roles (inheritance)
- Mixin pattern for shared behaviors
- Role aliases for backward compatibility

### Phase 4: Performance Optimization
- Lazy-load renderers for code splitting
- Memoize role config lookups
- Tree-shake unused roles in production

---

## References

- **Base Interface**: `/src/components/types/shared/role.base.ts`
- **Implementation Examples**:
  - Page: `/src/components/types/Page/role-registry.ts`
  - Section: `/src/components/types/Section/configs/registry.ts`
  - Block: `/src/components/types/Block/role-registry.ts`
  - Action: `/src/components/types/Element/Action/role-registry.ts`
  - Overlay: `/src/components/types/Overlay/role-registry.ts`
  - Text: `/src/components/types/Element/Text/configs/registry.ts`
  - Field: `/src/components/types/Element/Field/role-registry.ts`

---

## Changelog

### v4.1 (2026-01-11)
- ✅ Created `BaseRoleConfig` and `ExtendedRoleConfig` interfaces
- ✅ Migrated all components to use registry pattern
- ✅ Standardized naming to `role-registry.ts`
- ✅ Updated all component imports and comments
- ✅ Created comprehensive documentation

### v4.0 (Previous)
- Initial role-based rendering pattern
- Switch statement approach
- Inconsistent config file naming

---

**Last Updated**: 2026-01-11
**Status**: ✅ Production Ready
**Maintainer**: IDDL Architecture Team
