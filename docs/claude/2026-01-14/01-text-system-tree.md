# Text System Tree

```
Text
│
├── TextRoot (Base Component)
│   ├── variant="heading-lg"
│   ├── variant="heading-md"
│   ├── variant="heading-sm"
│   ├── variant="body-lg"
│   ├── variant="body-md" (default)
│   ├── variant="body-sm"
│   ├── variant="caption"
│   ├── variant="caption-sm"
│   └── variant="code"
│
├── Prose (Context: Continuous Reading)
│   ├── Title
│   │   ├── variant="xl"     (Display, 80px)
│   │   ├── variant="lg"     (Heading 1, 56px)
│   │   ├── variant="md"     (Heading 2, 40px)
│   │   └── variant="sm"     (Heading 3, 24px)
│   ├── Body
│   ├── Note
│   └── Code
│
├── Card (Context: Summarized Chunks)
│   ├── Title
│   ├── Desc
│   ├── Note
│   └── Code
│
├── Field (Context: Input Units)
│   ├── Label
│   ├── Value
│   └── Note
│
├── Menu (Context: Action Items)
│   ├── Item
│   └── Group
│
└── Table (Context: Data Comparison)
    ├── Head
    └── Cell
```

## Usage Pattern

```
Text.{Context}.{Slot}.{Variant}
```

### Examples

```tsx
// Prose Context
<Text.Prose.Title variant="xl">Display Title</Text.Prose.Title>
<Text.Prose.Title variant="lg">Heading 1</Text.Prose.Title>
<Text.Prose.Title variant="md">Heading 2</Text.Prose.Title>
<Text.Prose.Title variant="sm">Heading 3</Text.Prose.Title>
<Text.Prose.Body>Body text</Text.Prose.Body>
<Text.Prose.Note>Caption text</Text.Prose.Note>
<Text.Prose.Code>Code snippet</Text.Prose.Code>

// Card Context
<Text.Card.Title>Card title</Text.Card.Title>
<Text.Card.Desc>Description</Text.Card.Desc>
<Text.Card.Note>Metadata</Text.Card.Note>
<Text.Card.Code>Code</Text.Card.Code>

// Field Context
<Text.Field.Label>Label</Text.Field.Label>
<Text.Field.Value>Value</Text.Field.Value>
<Text.Field.Note>Helper text</Text.Field.Note>

// Menu Context
<Text.Menu.Group>Section</Text.Menu.Group>
<Text.Menu.Item>Menu item</Text.Menu.Item>

// Table Context
<Text.Table.Head>Column header</Text.Table.Head>
<Text.Table.Cell>Cell data</Text.Table.Cell>

// Direct TextRoot (no context)
<Text variant="heading-lg">Generic heading</Text>
<Text variant="body-md">Generic body</Text>
<Text variant="code">Generic code</Text>
```
