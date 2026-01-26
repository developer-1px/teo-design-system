# useDropdown

A headless hook for managing dropdown menus, select inputs, and flyout interactions. Supports type-ahead filtering, keyboard navigation, and robust focus management.

## Import

```tsx
import { useDropdown } from '@project-essence/hooks';
```

## Usage

### Simple Menu

```tsx
import { useDropdown } from '@project-essence/hooks';

function UserMenu() {
  const { field, action, bind } = useDropdown({
    items: ['Profile', 'Settings', 'Logout'],
  });

  return (
    <div {...bind.container}>
      <button {...bind.trigger}>
        Options {field.isOpen ? '▲' : '▼'}
      </button>
      
      {field.isOpen && (
        <ul {...bind.menu}>
          {field.items.map((item, index) => (
            <li 
              key={item}
              {...bind.item(item, index)}
              style={{ background: field.highlightedIndex === index ? '#eee' : '#fff' }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## API

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | **Required** | Array of data items to render in the menu. |
| `itemToString` | `(item: T) => string` | `String(item)` | Function to convert item to string for type-ahead and display. |
| `onSelect` | `(item: T) => void` | - | Callback fired when an item is selected. |
| `initialIsOpen` | `boolean` | `false` | Initial open state of the dropdown. |
| `closeOnSelect` | `boolean` | `true` | Whether to close the menu after selection. |

### Return Value

#### `field` (Read-Only State)

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Current visibility of the menu. |
| `highlightedIndex` | `number` | Index of the currently highlighted item (for keyboard nav). |
| `selectedItem` | `T \| null` | The currently selected item value. |
| `items` | `T[]` | The items array (useful if filtered internally). |

#### `action` (Methods)

| Method | Type | Description |
|--------|------|-------------|
| `open` | `() => void` | Open the menu. |
| `close` | `() => void` | Close the menu. |
| `toggle` | `() => void` | Toggle menu visibility. |
| `select` | `(item: T) => void` | Select an item programmatically. |
| `highlight` | `(index: number) => void` | Set the highlighted index. |

#### `bind` (Prop Getters)

| Name | Returns | Description |
|------|---------|-------------|
| `container` | `HTMLAttributes` | Spreads onto the wrapper. Handles strict outside-click logic. |
| `trigger` | `HTMLButtonAttributes` | Spreads onto the toggle button. Handles `aria-haspopup`, `aria-expanded`, `onKeyDown` (Arrow keys to open). |
| `menu` | `HTMLAttributes` | Spreads onto the list container. Handles `role="listbox"` or `menu`, `aria-activedescendant`. |
| `item(item, index)` | `HTMLAttributes` | Spreads onto each list item. Handles `onClick`, `onMouseEnter`, `role="option"`. |

## Accessibility

- **Keyboard Support**:
    - `Enter` / `Space`: Select highlighted item.
    - `ArrowDown` / `ArrowUp`: Cycle through items.
    - `Home` / `End`: Jump to first/last item.
    - `Escape`: Close menu and restore focus to trigger.
    - `Type Characters`: Focus moves to item starting with typed character (Type-ahead).
- **Focus Management**:
    - Focus is trapped within the menu when open (optional configuration).
    - Focus returns to trigger upon closing.

## Examples

### Combobox (Autocomplete)

Controlled input with dropdown suggestions.

```tsx
const { field, bind } = useDropdown({
  items: startItems.filter(i => i.includes(inputValue))
});

<div {...bind.container}>
  <input {...bind.input} value={inputValue} onChange={e => setInputValue(e.target.value)} />
  <ul {...bind.menu}>
    {field.items.map((item, index) => (
       <li {...bind.item(item, index)}>{item}</li>
    ))}
  </ul>
</div>
```
