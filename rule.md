# Rule Table PRD: Headless Hook Verification

## 1. Objective
Refactor the existing `/table` route (`TableApp.tsx`) to implement a full-featured "Rule Management Table".
**Core Goal**: Verify that `useHeadlessTable` is truly "headless" and capable of driving a complex Grid UI with separated logic.

## 2. Scope
- **Target Route**: `/table`
- **Hook to Validate**: `src/legacy-design-system/hooks/data/useHeadlessTable.ts`
- **Data Entity**: "Rule" (Business Logic Rules)

## 3. Data Model: Rule
We will replace the mock Employee data with a "Rule" entity to test complex data types.
```typescript
interface Rule {
    id: string;
    name: string;        // Text (Editable)
    active: boolean;     // Checkbox/Toggle
    trigger: string;     // Select (e.g., "On Update", "On Create")
    condition: string;   // Code/Text (Monospaced)
    action: string;      // Text
    priority: number;    // Number (Sortable)
}
```

## 4. Feature Requirements (Powered by Headless Hook)

### 4.1. Cursor & Selection (Grid Physics)
- **Keyboard Navigation**: Arrow keys to move cursor.
- **Selection**: Shift+Arrow / Drag to select multiple cells.
- **Visuals**:
    - Highlight Active Cell (`cursor`).
    - Highlight Selected Range (`selection` area).
    - Row/Column Header highlighting.

### 4.2. Editing
- **Double Click** to enter Edit Mode.
- **Enter Key**: Enter edit mode (or move down if option set).
- **Typing**: Overwrite cell content immediately (Excel-like).
- **Commit**: Enter / Tab / Click Outside.
- **Cancel**: Esc.

### 4.3. Structural Changes
- **Insert/Delete**:
    - "Insert Row Below" (Cmd+Shift+= or Context Menu).
    - "Delete Row" (Cmd+Shift+-).
    - "Insert Column" (Right click header?).
- **Search**:
    - `Cmd+F` to open search bar.
    - Highlight matches.
    - `Cmd+G` / `Cmd+Shift+G` for next/prev.

### 4.4. History
- **Undo/Redo**: `Cmd+Z` / `Cmd+Shift+Z`.
- Should track ALL data changes.

### 4.5. IO
- **Copy/Paste**: `Cmd+C` / `Cmd+V`.
- Should support Tab-Separated Values (TSV) for compatibility with Excel/Sheets.

## 5. UI Implementation Checks
- **Strict Separation**: The UI component must ONLY receive state via `useHeadlessTable`. No local state for interaction logic.
- **Performance**: Ensure no distinct lag on cursor movement.
- **Styling**: Use existing "Design System" tokens.

## 6. Verification Steps
1.  **Cursor Test**: Move around, check boundaries.
2.  **Edit Test**: Type "Test", Enter. Check value updates. Undo. Check value reverts.
3.  **Search Test**: Find "active", iterate results.
4.  **Copy Test**: Select range, Copy, Paste into text editor. Paste from text editor back to table.
