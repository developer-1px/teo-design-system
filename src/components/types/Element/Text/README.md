# Text Component

Registry-based extensible text component with 16 built-in roles and custom role support.

## Features

- ✅ **16 Built-in Roles**: Typography, Inline, Indicator, Data
- ✅ **Registry Pattern**: Centralized role management
- ✅ **Extensible**: Register custom roles at runtime
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Simple & Complex**: Support both CSS-only and component-based roles

## Built-in Roles

### Typography (5 roles)

Basic text hierarchy for content structure.

```tsx
<Text role="Title" content="Page Title" prominence="Hero" />
<Text role="Heading" content="Section Heading" spec={{ level: 2 }} />
<Text role="Body" content="Paragraph text" />
<Text role="Label" content="Form Label" />
<Text role="Caption" content="Helper text" prominence="Subtle" />
```

### Inline (5 roles)

Semantic inline text formatting.

```tsx
<Text role="Strong" content="Important text" />
<Text role="Emphasis" content="Stressed text" />
<Text role="Mark" content="Highlighted text" />
<Text role="Link" content="Click here" spec={{ href: '/path' }} />
<Text role="Code" content="const x = 1" />
```

### Indicator (5 roles)

Status indicators and metadata display.

```tsx
{/* Badge */}
<Text role="Badge" content="New" intent="Positive" />

{/* Alert */}
<Text
  role="Alert"
  intent="Critical"
  spec={{ title: 'Error', onClose: () => {} }}
  content="Something went wrong"
/>

{/* Avatar */}
<Text role="Avatar" spec={{ src: '/avatar.jpg', fallback: 'JD' }} prominence="Strong" />

{/* Keyboard shortcut */}
<Text role="Kbd" content="Ctrl" />

{/* Removable tag */}
<Text role="Tag" content="React" spec={{ onRemove: () => {} }} />
```

### Data (1 role)

Data formatting and display.

```tsx
{/* Relative time */}
<Text
  role="Time"
  spec={{
    value: new Date(),
    format: 'relative',
    live: true
  }}
/>

{/* Absolute time */}
<Text role="Time" spec={{ value: new Date(), format: 'date' }} />
```

## Custom Role Registration

### Simple Role (CSS-only)

For basic text styling without complex logic.

```tsx
import { registerTextRole, type SimpleRoleConfig } from '@/components/types/Element/Text/Text';

const QuoteConfig: SimpleRoleConfig = {
  type: 'simple',
  htmlTag: 'blockquote',
  baseStyles: 'border-l-4 border-accent pl-4 italic text-text-muted',
  prominence: {
    Hero: 'text-xl',
    Strong: 'text-lg',
    Standard: 'text-base',
    Subtle: 'text-sm',
  },
  description: 'Blockquote with left border',
};

registerTextRole('Quote', QuoteConfig);

// Usage
<Text role="Quote" content="Custom quote text" />
```

### Complex Role (Component-based)

For dynamic behavior or complex UI.

```tsx
import { registerTextRole, type ComplexRoleConfig } from '@/components/types/Element/Text/Text';
import type { TextProps } from '@/components/types/Element/Text/Text.types';

function CountdownRenderer({ spec, content, className }: TextProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const targetDate = spec?.targetDate as Date;

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = targetDate.getTime() - Date.now();
      // Calculate time left...
      setTimeLeft(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={className}>
      <span>{timeLeft}</span>
      <span>{content}</span>
    </div>
  );
}

const CountdownConfig: ComplexRoleConfig = {
  type: 'complex',
  renderer: CountdownRenderer,
  description: 'Live countdown timer',
};

registerTextRole('Countdown', CountdownConfig);

// Usage
<Text
  role="Countdown"
  content="until launch"
  spec={{ targetDate: new Date('2026-12-31') }}
/>
```

## Props Mapping

Text component props are mapped to role-specific props:

### Intent Mapping

```tsx
// Badge, Alert
intent="Positive" → variant="success" (green)
intent="Caution" → variant="warning" (yellow)
intent="Critical" → variant="error" (red)
intent="Info" → variant="info" (blue)
```

### Prominence Mapping

```tsx
// Avatar, Kbd, Tag
prominence="Hero" → size="xl" or "lg"
prominence="Strong" → size="lg"
prominence="Standard" → size="md"
prominence="Subtle" → size="sm"
```

### Spec Options

Role-specific configuration via `spec` prop:

```tsx
// Alert
spec={{ title: string, onClose: () => void }}

// Avatar
spec={{ src: string, fallback: string, alt: string }}

// Tag
spec={{ onRemove: () => void }}

// Time
spec={{ value: Date, format: 'relative' | 'date' | 'time', live: boolean }}

// Link
spec={{ href: string, target: string, external: boolean }}
```

## Registration Best Practices

1. **Register once** at app initialization (main.tsx or App.tsx)
2. **Use PascalCase** for role names (Quote, Countdown)
3. **Prefer simple roles** for pure styling
4. **Use complex roles** only when logic is needed
5. **Document spec options** in role description

## Examples

See working examples in:

- **TextShowcase.tsx** - All 16 built-in roles
- **examples/CustomRoleExample.tsx** - Custom role registration

## Registry API

```tsx
import {
  registerTextRole,      // Register new role
  getRoleConfig,         // Get role configuration
  getRegisteredRoles,    // List all role names
  type RoleConfig,       // Base config type
  type SimpleRoleConfig, // Simple role config
  type ComplexRoleConfig // Complex role config
} from '@/components/types/Element/Text/Text';

// Register role
registerTextRole('MyRole', config);

// Get configuration
const config = getRoleConfig('Title');

// List roles
const roles = getRegisteredRoles();
// → ['Title', 'Body', 'Badge', ...]
```

## Architecture

```
Text/
├── Text.tsx                    # Main component
├── Text.types.ts               # TypeScript types
├── configs/
│   ├── registry.ts             # Central registry
│   ├── types.ts                # Config type definitions
│   ├── simple/                 # Simple role configs
│   │   ├── typography.ts       # Title, Heading, Body, Label, Caption
│   │   └── inline.ts           # Strong, Emphasis, Mark, Link, Code
│   └── complex/                # Complex role configs
│       ├── indicator.ts        # Badge, Alert, Avatar, Kbd, Tag
│       └── data.ts             # Time
├── renderers/                  # Custom renderers
│   ├── BadgeRenderer.tsx
│   ├── AlertRenderer.tsx
│   ├── AvatarRenderer.tsx
│   ├── KbdRenderer.tsx
│   ├── TagRenderer.tsx
│   └── TimeRenderer.tsx
├── role/                       # Role components
│   ├── Badge.tsx
│   ├── Alert.tsx
│   ├── Avatar.tsx
│   ├── Kbd.tsx
│   └── Tag.tsx
└── examples/                   # Usage examples
    └── CustomRoleExample.tsx
```

## Migration from v1

No breaking changes. All v1 roles (Title, Body, Label, Caption, Code) continue to work.

New roles added:
- Heading, Strong, Emphasis, Mark, Link (Inline)
- Badge, Alert, Avatar, Kbd, Tag (Indicator)
- Time (Data)

## Performance

- **Simple roles**: Zero runtime overhead (CSS classes only)
- **Complex roles**: Lazy rendering (only when used)
- **Registry**: O(1) lookup

## Accessibility

All roles provide semantic HTML and ARIA attributes:

- Title/Heading → `<h1>`-`<h6>` with proper heading hierarchy
- Link → `role="link"` with keyboard support
- Alert → Semantic alert markup with icons
- Avatar → `alt` attribute support
- Kbd → `<kbd>` semantic element
