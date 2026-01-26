# useModal

A headless hook for managing modal dialogs, drawers, and overlays. Provides critical accessibility features including focus trapping, scroll locking, and screen reader announcements.

## Import

```tsx
import { useModal } from '@project-essence/hooks';
```

## Usage

### Basic Modal

```tsx
import { useModal } from '@project-essence/hooks';

function ConfirmDialog() {
  const { field, bind } = useModal({
    defaultOpen: false,
    onClose: () => console.log('Closed')
  });

  return (
    <>
      <button onClick={field.open}>Delete Account</button>

      {field.isOpen && (
        <div className="overlay">
           <div {...bind.dialog} className="dialog">
             <h2 {...bind.title}>Are you sure?</h2>
             <p {...bind.description}>This action cannot be undone.</p>
             
             <button onClick={field.close}>Cancel</button>
             <button onClick={doDelete}>Confirm</button>
           </div>
        </div>
      )}
    </>
  );
}
```

## API

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controlled state for visibility. |
| `defaultOpen` | `boolean` | `false` | Initial state (uncontrolled mode). |
| `onClose` | `() => void` | **Required** | Callback fired when closing via Escape or outside click. |
| `preventScroll` | `boolean` | `true` | Whether to lock body scroll when open. |
| `focusTrap` | `boolean` | `true` | Whether to trap focus inside the modal. |
| `restoreFocus` | `boolean` | `true` | Whether to restore focus to trigger on close. |

### Return Value

#### `field` (Read-Only State)

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Current visibility state. |

#### `action` (Methods)

| Method | Type | Description |
|--------|------|-------------|
| `open` | `() => void` | Open the modal. |
| `close` | `() => void` | Close the modal. |
| `toggle` | `() => void` | Toggle visibility. |

#### `bind` (Prop Getters)

| Name | Returns | Description |
|------|---------|-------------|
| `dialog` | `HTMLAttributes` | Spreads onto the dialog container. Handles `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, `onKeyDown` (Escape), `tabIndex="-1"`. |
| `title` | `HTMLAttributes` | Spreads onto the heading. Assigns `id` linked to `aria-labelledby`. |
| `description` | `HTMLAttributes` | Spreads onto the description. Assigns `id` linked to `aria-describedby`. |

## Accessibility

- **Focus Management**:
    - **Trap**: Focus is constrained within the dialog while open.
    - **Initial Focus**: Focus moves to the first focusable element (or the dialog itself) on open.
    - **Restoration**: Focus returns to the previously focused element on close.
- **Keyboard Support**:
    - `Escape`: Closes the modal.
    - `Tab`: Cycles focus only within the modal.
- **Screen Reader**:
    - `role="dialog"` or `role="alertdialog"` identifies the content.
    - `aria-modal="true"` tells AT that background content is inert.
    - `aria-labelledby` / `aria-describedby` provides context.

## Examples

### Slide-Over Drawer

Used for side panels.

```tsx
const { bind } = useModal({ onClose });

<div {...bind.dialog} className="drawer-right">
  <h2 {...bind.title}>Edit User</h2>
  {/* Drawer content */}
</div>
```
