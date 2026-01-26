# Project Essence: Integrated Headless Middleware Hook Standard

**Version:** 1.0.0
**Author:** Chief Software Architect
**Target Audience:** Human Developers / Architects

---

## 1. Architecture Principles

### 1.1 The Facade of Stability (Aggregation)
Modern UI development relies on specialized "Primitive" libraries (e.g., `react-aria` for a11y, `dnd-kit` for physics). While powerful, these primitives are fragmented.
**Principle:** The Integrated Hook acts as a **Facade**, encapsulating the complexity of wiring multiple primitives together. It provides a stable, high-level API to the View layer, isolating it from the volatile implementation details of the primitives.

### 1.2 The Passive View (Pure Functionality)
The UI (View) must remain strictly **Passive**. It should strictly render the `Field` state and attach the `Bind` props.
**Principle:** The View is a function of the Hook's output: $View = f(Hook(Options))$. The View must contain **zero business logic** and **zero event handling logic**. All logic resides within the Hook.

---

## 2. Standard Interface Specification

All Integrated Hooks must strictly adhere to the **"Action-Field-Option"** pattern.

```typescript
/**
 * O: Options (Input Configuration)
 * F: Field (Read-only State for Rendering)
 * A: Action (Mutators / Business Logic)
 * B: Bind (Prop Getters / Spreadable Objects for UI)
 */
export type IntegratedHook<O, F, A, B> = (options: O) => {
  field: F;   // What to show (Data)
  action: A;  // What to do (Handlers)
  bind: B;    // How to connect (Props)
};
```

### Component Parts
1.  **Options (`O`)**: Dependency injection, initial state, callbacks (`onSave`, `onError`).
2.  **Field (`F`)**: Derived state simplified for the UI. No raw data if possible; formatted for display.
3.  **Action (`A`)**: Methods exposed for *programmatic* control (e.g., `reset()`, `submit()`). Rarely used directly by UI events (which use `bind`), but useful for composition.
4.  **Bind (`B`)**: The core of the AI-Proofing. These are pre-wired event handlers and accessibility attributes.
    *   *Rule:* Binds must be spreadable objects or functions returning spreadable objects.
    *   *Naming:* `bind.containerProps`, `bind.getItemProps(id)`.

---

## 3. Development Workflow (5-Step)

### Step 1: Domain Definition (Requirement Analysis)
Define the **Business Goal** and the **User Capability**.
*   *Input:* "Users need a Kanban board to move tasks between stages."
*   *Output:* "A Board has Columns; Columns have Items. Capabilities: Drag items, Keyboard navigation, Edit item title."

### Step 2: Primitive Selection (Ingredient Gathering)
Select the best-in-class headless primitives. **Do not reinvent the wheel.**
*   *Selection:*
    *   DnD -> `@dnd-kit/core`
    *   A11y (Focus/Keys) -> `react-aria`
    *   State -> `useImmer` or `zustand`

### Step 3: State & Action Aggregation (The "Black Box")
Write the hook logic. Connect the primitives.
*   *Task:* Wire the `onDragEnd` from DnD to the state update logic. Connect Arrow Key events from `react-aria` to the focus manager.
*   *Crucial:* Handle all edge cases here. The View will never know they exist.

### Step 4: Bind Object Creation (The Interface)
Map the internal event handlers to DOM attributes.
*   *Task:* Create the `bind` object.
    *   `bind.board`: `{ role: "application", "aria-label": "Kanban" }`
    *   `bind.item(id)`: `{ onKeyDown: handleKeyDown, tabIndex: 0, ...dragProps }`

### Step 5: Headless Testing (Validation)
Verify logic without a UI.
*   *Method:* Render the hook in a test runner. Simulate actions via `result.current.action` or mapped event handlers.
*   *Success Criteria:* State transitions correctly without a single `<div>` being rendered.

---

## 4. Best Practice Example: `useKanbanBoard`

```typescript
import { useState } from 'react';
import { useDragAndDrop } from './primitives/dnd'; // Hypothetical wrapper
import { useKeyboardList } from './primitives/a11y'; // Hypothetical wrapper

// 1. Interfaces
interface KanbanOptions {
  initialData: Record<string, string[]>; // { todo: ['id1', 'id2'] }
  onMove?: (itemId: string, targetCol: string) => void;
}

interface KanbanField {
  columns: string[];
  itemsByCol: Record<string, string[]>;
  isDragging: boolean;
  activeId: string | null;
}

interface KanbanAction {
  moveItem: (id: string, toCol: string) => void;
  addItem: (colId: string, item: string) => void;
}

interface KanbanBind {
  board: React.HTMLAttributes<HTMLElement>;
  column: (colId: string) => React.HTMLAttributes<HTMLElement>;
  item: (itemId: string) => React.HTMLAttributes<HTMLElement>;
  dragHandle: (itemId: string) => React.HTMLAttributes<HTMLElement>;
}

// 2. The Integrated Hook
export const useKanbanBoard = (options: KanbanOptions): 
  { field: KanbanField; action: KanbanAction; bind: KanbanBind } => {

  // --- Aggregation (Step 3) ---
  const [data, setData] = useState(options.initialData);

  // Primitive: Drag and Drop
  const { dndProps, isDragging, activeId } = useDragAndDrop({
    onDrop: (item, target) => action.moveItem(item, target)
  });

  // Primitive: Keyboard Navigation
  const { navProps, focusedId } = useKeyboardList({
    items:  Object.values(data).flat(),
    orientation: 'horizontal' 
  });

  // --- Logic ---
  const action: KanbanAction = {
    moveItem: (id, toCol) => {
      setData(prev => { /* updates state */ return prev; });
      options.onMove?.(id, toCol);
    },
    addItem: (col, item) => { /* ... */ }
  };

  const field: KanbanField = {
    columns: Object.keys(data),
    itemsByCol: data,
    isDragging,
    activeId
  };

  // --- Bind Creation (Step 4) ---
  const bind: KanbanBind = {
    board: {
      role: 'region',
      'aria-label': 'Kanban Board',
      ...navProps.root // Global keyboard listeners
    },
    column: (colId) => ({
      'data-column-id': colId,
      role: 'list' // simplified a11y
    }),
    item: (itemId) => ({
      role: 'listitem',
      'data-item-id': itemId,
      // Aggregating multiple primitives into one bind
      ...navProps.item(itemId), 
      ...dndProps.draggable(itemId).attributes,
    }),
    dragHandle: (itemId) => ({
      ...dndProps.draggable(itemId).listeners,
      style: { cursor: 'grab' }
    })
  };

  return { field, action, bind };
};
```

---

## 5. QA Checklist: AI-Proof Validation

Before finalizing a Hook, ask these 5 questions:

1.  **The "Blindfolded AI" Test:** If an AI rewrites the entire JSX structure but blindly spreads `{...bind.root}` and `{...bind.item(id)}`, does the feature still work 100%?
2.  **No Logic Leak:** Is there any event handler (e.g., `onClick={() => setOpen(true)}`) written manually in the View example? **Fail.** It must be `{...bind.trigger}`.
3.  **Primitive Masking:** Does the hook expose raw `react-aria` or `radix` types? **Fail.** It must expose only the proprietary `ProjectEssence` types to decouple dependencies.
4.  **The "Missing Style" Test:** If all CSS is removed, is the functionality (focus, state changes, selection) still perceivable via Screen Reader or DevTools?
5.  **Single Import Rule:** Does the User (AI) need to import anything other than `useMyHook`? If they need `useDraggable` alongside `useKanban`, integration is failed.
