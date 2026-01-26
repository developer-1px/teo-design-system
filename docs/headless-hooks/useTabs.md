# useTabs

A headless hook for managing tabbed interfaces. Handles active tab state, panel visibility, and keyboard navigation following WAI-ARIA best practices.

## Import

```tsx
import { useTabs } from '@project-essence/hooks';
```

## Usage

### Basic Tabs

```tsx
import { useTabs } from '@project-essence/hooks';

function Dashboard() {
  const { field, bind } = useTabs({
    tabs: ['overview', 'analytics', 'settings'],
    defaultTab: 'overview'
  });

  return (
    <div className="tabs">
      <div {...bind.list}>
        {field.tabs.map(tab => (
          <button 
            key={tab} 
            {...bind.tab(tab)}
            className={field.activeTab === tab ? 'active' : ''}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      
      <div {...bind.panel('overview')}>
        Overview Content
      </div>
      <div {...bind.panel('analytics')}>
        Analytics Content
      </div>
      <div {...bind.panel('settings')}>
        Settings Content
      </div>
    </div>
  );
}
```

## API

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `string[]` | **Required** | Array of unique tab identifiers. |
| `defaultTab` | `string` | First item | The initial active tab ID. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Controls arrow key navigation direction. |
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | Whether tabs activate on focus (automatic) or Enter/Space (manual). |
| `onChange` | `(tabId: string) => void` | - | Callback fired when active tab changes. |

### Return Value

#### `field` (Read-Only State)

| Property | Type | Description |
|----------|------|-------------|
| `activeTab` | `string` | The ID of the currently active tab. |
| `tabs` | `string[]` | Copy of the tabs array. |
| `isVertical` | `boolean` | Helper derived from orientation option. |

#### `action` (Methods)

| Method | Type | Description |
|--------|------|-------------|
| `select` | `(tabId: string) => void` | Programmatically activate a tab. |
| `next` | `() => void` | Move to the next tab. |
| `prev` | `() => void` | Move to the previous tab. |
| `first` | `() => void` | Move to the first tab. |
| `last` | `() => void` | Move to the last tab. |

#### `bind` (Prop Getters)

| Name | Returns | Description |
|------|---------|-------------|
| `list` | `HTMLAttributes` | Spreads onto the tab list container. Handles `role="tablist"`, `aria-orientation`. |
| `tab(id)` | `HTMLButtonAttributes` | Spreads onto each tab trigger. Handles `role="tab"`, `aria-selected`, `aria-controls`, `tabIndex`, `onClick`, `onKeyDown`. |
| `panel(id)` | `HTMLAttributes` | Spreads onto each panel. Handles `role="tabpanel"`, `aria-labelledby`, `hidden`. |

## Accessibility

- **Keyboard Support**:
    - `ArrowRight` / `ArrowLeft`: Move focus to next/prev tab (Automatic activation by default).
    - `Home` / `End`: Jump to first/last tab.
    - `Enter` / `Space`: Activate tab (if `activationMode: 'manual'`).
- **ARIA Attributes**:
    - `aria-selected`: Set on the active tab.
    - `aria-controls`: Links tabs to panels.
    - `aria-labelledby`: Links panels to tabs.
    - `tabindex`: Managed to ensure only active tab is in focus order.

## Examples

### Vertical Settings Menu

```tsx
const { bind } = useTabs({
  tabs: ['profile', 'account'],
  orientation: 'vertical'
});

<div style={{ display: 'flex' }}>
  <div {...bind.list} style={{ flexDirection: 'column' }}>
    <button {...bind.tab('profile')}>Profile</button>
    <button {...bind.tab('account')}>Account</button>
  </div>
  <div {...bind.panel('profile')}>...</div>
</div>
```
