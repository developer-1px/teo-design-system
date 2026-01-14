# Layout System Tree

```
Layout
│
├── Stack (Vertical Flow - Document Rhythm)
│   ├── Section
│   │   ├── Default          gap: 16px, p: 24px
│   │   └── Tight            gap: 12px, p: 16px
│   │
│   ├── Content
│   │   ├── Default          gap: 12px
│   │   ├── Tight            gap: 8px
│   │   ├── Loose            gap: 16px
│   │   ├── None             gap: 0px
│   │   └── Scroll           gap: 12px, overflow: scroll
│   │
│   ├── List
│   │   ├── Default          gap: 8px (dense)
│   │   └── Dense            gap: 4px (very dense)
│   │
│   └── Form
│       ├── Default          gap: 20px
│       └── Center           gap: 16px, align: center
│
├── Row (Horizontal Flow - One-Line Structures)
│   ├── Header
│   │   ├── Default          justify: between, h: 44px, px: 16px
│   │   └── Sticky           justify: between, h: 44px, position: sticky, top: 0
│   │
│   ├── Toolbar
│   │   ├── Default          justify: between, h: 40px
│   │   ├── Compact          justify: between, h: 36px, gap: 8px
│   │   └── Sticky           justify: between, h: 44px, position: sticky, top: 0
│   │
│   ├── Item
│   │   ├── Default          align: center, gap: 12px
│   │   ├── Tight            align: center, gap: 8px
│   │   └── Compact          align: center, gap: 4px
│   │
│   ├── Meta
│   │   └── Default          align: baseline, gap: 8px
│   │
│   └── Actions
│       ├── Default          justify: end, gap: 8px
│       └── Between          justify: between, gap: 8px
│
├── Wrap (Wrap Flow - Variable Count Clusters)
│   ├── Chips
│   │   ├── Default          gap: 8px, wrap: wrap
│   │   └── Loose            gap: 12px, wrap: wrap
│   │
│   ├── Filters
│   │   └── Default          gap: 12px, wrap: wrap
│   │
│   └── Actions
│       └── Default          gap: 8px, wrap: wrap, justify: end
│
├── Grid (2D Repetition)
│   ├── Cards
│   │   ├── Default          gap: 12px, columns: auto-fit minmax(240px)
│   │   ├── Compact          gap: 8px, columns: auto-fit minmax(200px)
│   │   └── Scroll           gap: 12px, overflow: scroll
│   │
│   ├── Gallery
│   │   └── Default          gap: 8px, columns: auto-fit minmax(128px)
│   │
│   └── Dashboard
│       └── Default          gap: 12px, columns: auto-fit minmax(240px)
│
├── Slots (Role-Based Internal Contracts)
│   ├── Media
│   │   ├── Default          row, gap: 12px (leading/body/trailing)
│   │   └── Tight            row, gap: 8px
│   │
│   └── KeyValue
│       └── Default          grid, columns: "auto 1fr", gap: 8px
│
├── Center (Empty/Loading/Hero States)
│   ├── Default              align: center, justify: center, gap: 12px
│   └── Padded               align: center, justify: center, p: 24px
│
├── Base (Primitives)
│   ├── Default              (no style)
│   ├── Flex                 flex: 1
│   └── Fill                 w: full, h: full
│
└── Shape (Visual Presets)
    ├── Card                 surface: raised, rounded: md, shadow: sm
    ├── Well                 surface: sunken, rounded: sm
    └── Circle               rounded: full, align: center, justify: center
```

## Usage Pattern

```tsx
<Frame layout={Layout.{Category}.{Type}.{Variant}}>
```

## Examples

### Stack Layouts

```tsx
// Section with comfortable spacing
<Frame layout={Layout.Stack.Section.Default}>
  <Text.Prose.Title>Section Title</Text.Prose.Title>
  <Text.Prose.Body>Content here...</Text.Prose.Body>
</Frame>

// Content stack (standard vertical rhythm)
<Frame layout={Layout.Stack.Content.Default}>
  <Text.Card.Title>Card 1</Text.Card.Title>
  <Text.Card.Desc>Description</Text.Card.Desc>
</Frame>

// Tight content stack
<Frame layout={Layout.Stack.Content.Tight}>
  <Text.Field.Label>Label</Text.Field.Label>
  <Text.Field.Value>Value</Text.Field.Value>
</Frame>

// Form with proper field spacing
<Frame layout={Layout.Stack.Form.Default}>
  <Frame layout={Layout.Stack.Content.Tight}>
    <Text.Field.Label>Email</Text.Field.Label>
    <input />
  </Frame>
  <Frame layout={Layout.Stack.Content.Tight}>
    <Text.Field.Label>Password</Text.Field.Label>
    <input />
  </Frame>
</Frame>

// List container
<Frame layout={Layout.Stack.List.Default}>
  <Frame layout={Layout.Row.Item.Default}>Item 1</Frame>
  <Frame layout={Layout.Row.Item.Default}>Item 2</Frame>
</Frame>

// Dense list
<Frame layout={Layout.Stack.List.Dense}>
  <Frame layout={Layout.Row.Item.Compact}>Item 1</Frame>
  <Frame layout={Layout.Row.Item.Compact}>Item 2</Frame>
</Frame>
```

### Row Layouts

```tsx
// Header bar (split left/right)
<Frame layout={Layout.Row.Header.Default}>
  <Text.Prose.Title variant="sm">App Title</Text.Prose.Title>
  <Frame layout={Layout.Row.Actions.Default}>
    <Action icon={Save} />
    <Action icon={Share} />
  </Frame>
</Frame>

// Sticky header
<Frame layout={Layout.Row.Header.Sticky}>
  <Text.Prose.Title variant="sm">Sticky Header</Text.Prose.Title>
</Frame>

// Toolbar
<Frame layout={Layout.Row.Toolbar.Default}>
  <Action icon={Bold} />
  <Action icon={Italic} />
  <Action icon={Underline} />
</Frame>

// Compact toolbar
<Frame layout={Layout.Row.Toolbar.Compact}>
  <Action icon={Undo} size={24} />
  <Action icon={Redo} size={24} />
</Frame>

// Row item (icon + text)
<Frame layout={Layout.Row.Item.Default}>
  <User size={16} />
  <Text.Card.Title>John Doe</Text.Card.Title>
</Frame>

// Tight row item
<Frame layout={Layout.Row.Item.Tight}>
  <Mail size={14} />
  <Text.Card.Note>email@example.com</Text.Card.Note>
</Frame>

// Meta row (label/value pair)
<Frame layout={Layout.Row.Meta.Default}>
  <Text.Field.Label>Status:</Text.Field.Label>
  <Text.Field.Value>Active</Text.Field.Value>
</Frame>

// Actions row (buttons aligned right)
<Frame layout={Layout.Row.Actions.Default}>
  <Action variant="ghost" label="Cancel" />
  <Action variant="primary" label="Save" />
</Frame>

// Actions between
<Frame layout={Layout.Row.Actions.Between}>
  <Action variant="ghost" label="Delete" />
  <Frame layout={Layout.Row.Item.Compact}>
    <Action variant="ghost" label="Cancel" />
    <Action variant="primary" label="Save" />
  </Frame>
</Frame>
```

### Wrap Layouts

```tsx
// Chips/tags that wrap
<Frame layout={Layout.Wrap.Chips.Default}>
  <Frame layout={Layout.Shape.Well} p={Space.n8}>
    <Text.Card.Note>React</Text.Card.Note>
  </Frame>
  <Frame layout={Layout.Shape.Well} p={Space.n8}>
    <Text.Card.Note>TypeScript</Text.Card.Note>
  </Frame>
  <Frame layout={Layout.Shape.Well} p={Space.n8}>
    <Text.Card.Note>Vite</Text.Card.Note>
  </Frame>
</Frame>

// Loose chips
<Frame layout={Layout.Wrap.Chips.Loose}>
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
  <Badge>Tag 3</Badge>
</Frame>

// Filter options
<Frame layout={Layout.Wrap.Filters.Default}>
  <Action variant="surface" label="All" />
  <Action variant="ghost" label="Active" />
  <Action variant="ghost" label="Archived" />
</Frame>

// Button cluster (wraps if needed)
<Frame layout={Layout.Wrap.Actions.Default}>
  <Action label="Share" />
  <Action label="Export" />
  <Action label="Delete" />
</Frame>
```

### Grid Layouts

```tsx
// Responsive card grid
<Frame layout={Layout.Grid.Cards.Default}>
  <Frame layout={Layout.Shape.Card} p={Space.n16}>
    <Text.Card.Title>Card 1</Text.Card.Title>
    <Text.Card.Desc>Description</Text.Card.Desc>
  </Frame>
  <Frame layout={Layout.Shape.Card} p={Space.n16}>
    <Text.Card.Title>Card 2</Text.Card.Title>
    <Text.Card.Desc>Description</Text.Card.Desc>
  </Frame>
</Frame>

// Compact card grid
<Frame layout={Layout.Grid.Cards.Compact}>
  {cards.map(card => (
    <Frame layout={Layout.Shape.Card} p={Space.n12}>
      <Text.Card.Title>{card.title}</Text.Card.Title>
    </Frame>
  ))}
</Frame>

// Gallery grid (thumbnails)
<Frame layout={Layout.Grid.Gallery.Default}>
  <Frame ratio="1/1" surface="sunken" />
  <Frame ratio="1/1" surface="sunken" />
  <Frame ratio="1/1" surface="sunken" />
</Frame>

// Dashboard grid
<Frame layout={Layout.Grid.Dashboard.Default}>
  <Frame layout={Layout.Shape.Card} p={Space.n20}>
    <Text.Card.Title>Metric 1</Text.Card.Title>
    <Text.Prose.Title variant="lg">1,234</Text.Prose.Title>
  </Frame>
  <Frame layout={Layout.Shape.Card} p={Space.n20}>
    <Text.Card.Title>Metric 2</Text.Card.Title>
    <Text.Prose.Title variant="lg">5,678</Text.Prose.Title>
  </Frame>
</Frame>
```

### Slots Layouts

```tsx
// Media object (icon + content + action)
<Frame layout={Layout.Slots.Media.Default}>
  {/* Leading */}
  <Frame w={Size.n40} h={Size.n40} layout={Layout.Shape.Circle}>
    <User size={20} />
  </Frame>

  {/* Body */}
  <Frame layout={Layout.Stack.Content.Tight} flex>
    <Text.Card.Title>John Doe</Text.Card.Title>
    <Text.Card.Desc>Software Engineer</Text.Card.Desc>
  </Frame>

  {/* Trailing */}
  <Action icon={MoreVertical} />
</Frame>

// Tight media object
<Frame layout={Layout.Slots.Media.Tight}>
  <Mail size={16} />
  <Frame flex>
    <Text.Card.Note>email@example.com</Text.Card.Note>
  </Frame>
</Frame>

// Key-value grid
<Frame layout={Layout.Slots.KeyValue.Default}>
  <Text.Field.Label>Name:</Text.Field.Label>
  <Text.Field.Value>John Doe</Text.Field.Value>

  <Text.Field.Label>Email:</Text.Field.Label>
  <Text.Field.Value>john@example.com</Text.Field.Value>

  <Text.Field.Label>Status:</Text.Field.Label>
  <Text.Field.Value>Active</Text.Field.Value>
</Frame>
```

### Center Layouts

```tsx
// Loading state
<Frame layout={Layout.Center.Default}>
  <Spinner />
  <Text.Card.Note>Loading...</Text.Card.Note>
</Frame>

// Empty state with padding
<Frame layout={Layout.Center.Padded}>
  <InboxIcon size={48} opacity={0.3} />
  <Text.Card.Title>No messages</Text.Card.Title>
  <Text.Card.Desc>Your inbox is empty</Text.Card.Desc>
</Frame>

// Hero section
<Frame layout={Layout.Center.Padded} h={Size.screen}>
  <Text.Prose.Title variant="xl">Welcome</Text.Prose.Title>
  <Text.Prose.Body>Get started with our platform</Text.Prose.Body>
  <Action variant="primary" label="Sign Up" />
</Frame>
```

### Base Layouts

```tsx
// Plain container (no preset)
<Frame layout={Layout.Base.Default}>
  {/* Custom layout */}
</Frame>

// Flex container
<Frame layout={Layout.Base.Flex}>
  {/* Takes available space */}
</Frame>

// Fill container (full width/height)
<Frame layout={Layout.Base.Fill}>
  {/* Fills parent */}
</Frame>
```

### Shape Layouts

```tsx
// Card surface
<Frame layout={Layout.Shape.Card} p={Space.n20}>
  <Text.Card.Title>Card Content</Text.Card.Title>
</Frame>

// Well (sunken surface)
<Frame layout={Layout.Shape.Well} p={Space.n16}>
  <Text.Card.Note>Inset content</Text.Card.Note>
</Frame>

// Circle avatar
<Frame layout={Layout.Shape.Circle} w={Size.n40} h={Size.n40}>
  <User size={20} />
</Frame>
```

## Override System

All layouts can be overridden with the `override` prop:

```tsx
<Frame
  layout={Layout.Stack.Content.Default}
  override={{
    gap: Space.n20,           // Override gap
    p: Space.n24,             // Add padding
    surface: "raised",        // Add surface
    style: {                  // Raw CSS overrides
      backgroundColor: "red"
    }
  }}
>
  {children}
</Frame>
```

## Resolution Priority

```
Layout Preset → Top-Level Props → Override Prop
```

Example:
```tsx
<Frame
  layout={Layout.Row.Header.Default}  // Sets: h: 44px, justify: between
  gap={Space.n20}                      // Overrides default gap
  override={{                          // Final override
    h: Size.n56,                       // Custom header height
    style: { borderBottom: "1px" }
  }}
>
```

## Key Principles

1. **Semantic Intent**: Choose layout based on purpose, not appearance
2. **Token-Driven**: All spacing/sizing uses design tokens (Space.*, Size.*)
3. **Composable**: Layouts nest cleanly (e.g., Row.Item inside Stack.List)
4. **Override Escape Hatch**: When preset doesn't fit, use `override`
5. **No Magic Numbers**: All values come from token system or Layout presets
