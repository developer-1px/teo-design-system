# Refactoring Plan: Legacy Design System Cleanup

## 🎯 Goal
Refactor the `legacy-design-system` to remove heavy dependencies (`Frame`, `Text`) while preserving core interactive components and headless hooks.

## 📦 Scope

### ❌ Remove
- **Frame**: All variations and related files (`Frame.tsx`, `Layout`, etc.)
- **Text**: All variations and contexts (`Text.tsx`, `Text.Menu`, etc.)
- **Unused Components**: Any other legacy UI components not explicitly whitelisted.

### ✅ Keep
- **Headless Hooks**: All hooks in `src/legacy-design-system/hooks`
- **Action**: `src/legacy-design-system/Action.tsx`
- **Field**: `src/legacy-design-system/Field.tsx`
- **Option**: (Not found as standalone component)
- **Icons**: `src/legacy-design-system/Icon.tsx` (Required by Action)

## 🛠 Execution Steps

### 1. Analyze & Prep
- [x] Identify dependencies of `Action` and `Field`.
- [x] Locate `Option` component. (Result: Not found)
- [x] Verify `Icon` dependencies.

### 2. Refactor Components
#### `Action.tsx`
- [x] Replace `Frame` with standard `<button>` or `<div>`.
- [x] Replace `Text.Menu.Item` with `<span>` or `<div>` with equivalent styles.
- [x] Inline necessary styles from `Frame` and `Text`.
- [x] Remove `Layout` imports.

#### `Field.tsx`
- [x] Replace `Frame` with `<label>` or `<div>`.
- [x] Replace `Text` with `<span className="label-text">`.
- [x] Simplify styling.

#### `Option` (If found)
- [-] Ensure it does not depend on `Frame` or `Text`.
- [-] Refactor if necessary.

### 3. Deletion
- [x] Delete `src/legacy-design-system/Frame` directory.
- [x] Delete `src/legacy-design-system/text` directory.
- [x] Delete other unused components in `legacy-design-system` root.

### 4. Verification
- [ ] Verify `Action` and `Field` still work as expected.
- [ ] Verify Headless Hooks are untouched and working.
- [ ] Check for build errors.

## 📝 Notes
- `Action` and `Field` have been refactored to use standard HTML/CSS.
- `Frame` and `Text` directories have been deleted.
- `Option` component was not found in the codebase.
