# Hook System Architecture

The MDK Hook System follows a **Logic-First, UI-Optional** architecture. The goal is to separate business logic, state management, and interaction patterns from the visual rendering. This ensures that complex behaviors (like data grids, keyboard navigation, and undo/redo) are reusable across different visual implementations and are testable in isolation.

## Architectural Layers

The system is organized into four distinct layers of abstraction:

### 1. Primitives (`/primitives`)
**Low-level DOM or React behaviors.**
These hooks abstract raw browser APIs or fundamental React patterns. They are unopinionated about the data they manipulate.

- **`useClickOutside`**: Handles click detection outside a specific DOM element.
- **`useControlledState`**: Unifies controlled (prop-driven) and uncontrolled (internal state) patterns.
- **`useFocusTrap`**: Manages focus containment for modals and overlays.
- **`useScrollLock`**: Manages `document.body` overflow states.

### 2. State (`/state`)
**Pure data state management.**
These hooks manage data structures and state transitions. They do not concern themselves with user input methods (mouse vs keyboard) or DOM events.

- **`useHistory`**: Provides time-travel (Undo/Redo) capabilities for any state shape. Now supports `replace` for soft updates.
- **`useGlobalClipboard`**: Manages cross-component clipboard state using Zustand.
- **`useSelection`**: General-purpose selection state management.

### 3. Interaction (`/interaction`)
**User intent and input patterns.**
These hooks map user inputs (keyboard, mouse) to abstract "Commands" or "Sessions". They bridge the gap between specific events and state updates.

- **`useCommandSystem`**: The core interaction engine. It maps Keyboard Events → Command IDs → Handler Functions. This allows keybindings to be fully decoupled from implementation.
- **`useEditSession`**: Manages the lifecycle of a temporary editing state (Start → Change → Commit/Cancel).
- **`useFocusRef`**: specialized ref for managing focusable elements, often used with virtualization or command systems.

### 4. Data / Composition (`/data`)
**High-level logic composition.**
These hooks compose Primitives, State, and Interaction hooks to form complete logical components (e.g., a Spreadsheet).

- **`useHeadlessTable`**: A "Headless" implementation of a Data Grid. It composes:
    - **State**: `useTableHistory` (Data + Selection with Undo/Redo).
    - **Interaction**: `useCommandSystem` (Cursor navigation, Clipboard, Editing).
    - **Logic**: `useGridSelection` (2D Coordinate math).
- **`useGridSelection`**: Logic for 2D cursor movement and range selection strategies (Clamp, Loop, Expand).
- **`useTableHistory`**: A specialized wrapper around `useHistory` that synchronizes Data and Selection state to ensure pasting and undoing works intuitively.

---

## Universal Abstraction Principles

### 1. Controlled Abstraction
When abstracting specific logic (like Selection), always design it to be **Controllable**.
- **Pattern**: Provide `value` and `onChange` props to the hook.
- **Benefit**: This allows the hook to be "lifted" into a parent state manager (like `useHistory`) without rewriting the logic.
- **Example**: `useGridSelection` was refactored to support being driven by `useTableHistory`, enabling Selection Undo/Redo.

### 2. Command-Oriented Interaction
Do not write `onKeyDown` handlers with direct logic.
- **Pattern**: Define a **Command** (string ID) and map inputs to it.
- **Benefit**: Keybindings become configuration, not code. Multiple inputs (Menu Click, Shortcut, Command Palette) can trigger the same logic.
- **Example**: `useHeadlessTable` defines `nav.move` and maps `ArrowUp`, `Tab`, and `Enter` to it based on context.

### 3. Unified History State
For complex applications, "Data" is rarely just the raw values.
- **Pattern**: Include UI State (Cursor, Selection) in the History stack if it is relevant to the user's perception of "Undoing".
- **Benefit**: The user is never lost after an Undo. They return exactly to where they were working.
- **Example**: `useTableHistory` groups `{ data, cursor, selection }` into a single history snapshot.

### 4. Headless UI
Hooks should return **Props**, not Elements.
- **Pattern**: Return `gridProps`, `rowProps`, `cellProps` getter functions.
- **Benefit**: The UI component (`TableApp`) has full control over styling and DOM structure (`div` vs `table`) while the hook manages all accessibility attributes (`role`, `aria-selected`, `tabIndex`).
