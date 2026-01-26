# useAccordion

A headless hook for managing expandable/collapsible sections. Provides full keyboard navigation, ARIA attributes, and state management for single or multi-expand accordions.

## Import

```tsx
import { useAccordion } from '@project-essence/hooks';
```

## Usage

### Basic Accordion

```tsx
import { useAccordion } from '@project-essence/hooks';

function FAQ() {
  const { field, bind } = useAccordion({
    items: ['item-1', 'item-2', 'item-3'],
    allowMultiple: false, 
    defaultExpanded: ['item-1']
  });

  return (
    <div {...bind.root}>
      {field.items.map((id) => (
        <div key={id} className="accordion-item">
          <h3>
            <button {...bind.trigger(id)}>
              {id}
              <span className="icon">
                {field.isExpanded(id) ? '−' : '+'}
              </span>
            </button>
          </h3>
          <div {...bind.panel(id)}>
            <p>Content for {id}...</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## API

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `string[]` | **Required** | Array of unique identifiers for accordion items. |
| `allowMultiple` | `boolean` | `false` | Whether multiple items can be expanded at once. |
| `defaultExpanded` | `string[]` | `[]` | Array of item IDs to be expanded initially. |
| `disabled` | `string[]` | `[]` | Array of item IDs that cannot be toggled. |
| `onChange` | `(expanded: string[]) => void` | - | Callback fired when expanded state changes. |

### Return Value

#### `field` (Read-Only State)

| Property | Type | Description |
|----------|------|-------------|
| `expanded` | `string[]` | Array of currently expanded item IDs. |
| `disabled` | `string[]` | Array of disabled item IDs. |
| `items` | `string[]` | Copy of the items array passed options. |
| `isExpanded` | `(id: string) => boolean` | Helper to check expansion state. |

#### `action` (Methods)

| Method | Type | Description |
|--------|------|-------------|
| `expand` | `(id: string) => void` | Programmatically expand an item. |
| `collapse` | `(id: string) => void` | Programmatically collapse an item. |
| `toggle` | `(id: string) => void` | Toggle expansion state of an item. |
| `expandAll` | `() => void` | Expand all items (only if `allowMultiple: true`). |
| `collapseAll` | `() => void` | Collapse all items. |

#### `bind` (Prop Getters)

| Name | Returns | Description |
|------|---------|-------------|
| `root` | `HTMLAttributes` | Spreads onto the container. Adds `data-orientation`. |
| `trigger(id)` | `HTMLButtonAttributes` | Spreads onto the header button. Handles `onClick`, `onKeyDown` (Arrow keys, Home/End), `aria-expanded`, `aria-controls`. |
| `panel(id)` | `HTMLAttributes` | Spreads onto the content panel. Handles `id`, `aria-labelledby`, `hidden`. |

## Accessibility

- **Keyboard Support**:
    - `Enter` / `Space`: Toggle expansion.
    - `ArrowDown` / `ArrowUp`: Move focus between triggers.
    - `Home` / `End`: Move to first/last trigger.
- **ARIA Attributes**:
    - `aria-expanded`: Correctly set on triggers.
    - `aria-controls`: Links triggers to their panels.
    - `aria-labelledby`: Links panels to their triggers.
    - `aria-disabled`: Set on disabled triggers.

## Examples

### Multi-Expandable Data Table Row

Used for showing details within a table row.

```tsx
const { bind } = useAccordion({ 
  items: rowIds, 
  allowMultiple: true 
});

// ... inside table loop
<tr {...bind.trigger(row.id)}>
  <td>{row.name}</td>
</tr>
{field.isExpanded(row.id) && (
   <tr {...bind.panel(row.id)}>
      <td colSpan={4}>Details...</td>
   </tr>
)}
```
