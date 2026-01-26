# Product Requirements Document: Project Redefinition

## 1. Project Identity: Headless Hook Full Packages
**Concept**: A comprehensive interaction primitive layer for building complex web applications (like Admin UIs, Spreadsheets, Editors).
**Why Full Packages?**: 
- A web application requires more than just UI rendering. It needs deep interaction capabilities:
    - **Keyboard Control**: Full navigation without mouse.
    - **Interaction Models**: Cursor, Selection, Edit, Search, Navigation, Find/Replace.
    - **Data Integrity**: History (Undo/Redo), Smart Clipboard (Copy/Paste with parsing).
- **Goal**: Provide all these as **Headless Hooks**, allowing developers to build complex apps like `DataTable` or `Editors` by simply wiring these hooks up, decoupling logic from the visual layer.

## 2. Core Philosophy: AI-Native Core Layer
**The Principle**: "If the AI cannot use it well, it is widely useless."
- **Objective**: Create a Core Layer specifically designed to help AI (Gemini) generate consistent, aesthetically pleasing, and bug-free code.
- **Why Radix + Vanilla Extract?**: These are the technologies the AI handles best. By standardizing on them, we ensure that AI-generated code maintains high quality and consistency.
- **Value**: Enabling AI to act as a "Senior Developer" that produces reliable results because the underlying system supports it.

## 3. Technology Stack & Layout Strategy
- **Core**: React Hooks (Headless Interaction Logic)
- **UI Primitives**: Radix UI (Unstyled, Accessible, AI-friendly)
- **Styling Engine**: Vanilla Extract (Zero-runtime, Type-safe CSS)
- **Layout Strategy: Grid & Subgrid Centric**
    - **Why?**: Flexbox represents "Block-level composition," which is easy for micro-components but fails to guarantee macro-level layout consistency and aesthetic unity in complex Admin panels.
    - **Strategy**: 
        - **Grid/Subgrid**: Used for the overall layout architecture to enforce alignment and structure.
        - **Flexbox**: Restricted to specific use cases requiring `flex-wrap`.
        - **Margins**: Allowed freely, abandoning the strict "No Margin" rule to allow natural spacing where Grid feels overkill (though Grid Gap is preferred).

## 4. Visual & Design Strategy
- **Refactoring Goal**: Drastically reduce/prune existing visual components.
- **New Direction**: Rebuild essential UI patterns using Radix + Vanilla Extract.
- **Theme System**: 
  - **Surface + Tone**: Background, Border, Shadow, and Interactive states bundled together.
  - **Goal**: Maintain thematic consistency while allowing simpler implementation.

## 5. Execution Strategy: The "Mass Refactor"

### 5.1. Component Pruning & Migration
- **Decision**: **Archive & New Start (Option A)**
- **Action**: 
    1.  Move existing `src/design-system` to `src/legacy-design-system`.
    2.  Create a fresh `src/ui` directory for the new Radix + Vanilla Extract system.
    3.  Create `src/ui/primitives` for atomic components.
    4.  Extract **only** the raw design token values (colors, shadows, spacing) from the legacy system.

### 5.2. Flagship Implementation: Universal DataGrid
- **Goal**: Build a "Google Sheets-level" DataGrid/Spreadsheet hybrid that validates the Headless Hook architecture.
- **Why?**: This represents the "Endgame" of complex UI interaction. If we solve this headless capability, we solve everything else (cursor, selection, clipboard, undo/redo).
- **Scope**:
    - **Universal Features**: Undo/Redo (History), Smart Clipboard (OS-level integration), Keyboard Navigation (Excel-like), Range Selection.
    - **Reusability**: These hooks should be usable in *any* grid-based application (e.g., Gantt charts, Calendars), not just spreadsheets.

### 5.3. Theme System Migration
- **Strategy**: **Type-Safe Vanilla Extract Themes**
- **Approach**: 
    - Do NOT just copy-paste CSS variables.
    - Define a **Vanilla Extract Theme Contract** to ensure type safety.
    - Migrate existing token **values** (from `token.const.*.ts`) into this new contract.
    - **Benefit**: AI (Gemini) can infer available tokens via TypeScript types, ensuring fewer interruptions and "guessing" errors in styling.
