# MDK Design Strategy: A Guide for AI Agents

**Target Audience:** AI Coding Assistants (Cursor, Windsurf, Copilot, etc.)
**Objective:** Prevent "Fake Design" and ensure System Integrity.

---

## 🛑 STOP. READ THIS BEFORE GENERATING CODE.

You are likely trained on millions of lines of Tailwind CSS, generic React `div` soup, and BEM methodology. **You must unlearn this.** MDK (Minimal Design Kit) is not a styling library; it is a **Strict Design Engine**.

If you write `<div className="flex items-center gap-2">`, you have already failed.

## 1. The Core Philosophy: "Physics over Painting"

In standard web development, you "paint" pixels using CSS properties.
In MDK, you **define physics** using Layout Tokens.

| Traditional Mental Model | MDK Mental Model |
| :--- | :--- |
| "I need to flex this row and center it." | "This is a `Row.Item.Default` layout." |
| "I'll add 12px padding and a border." | "This Surface is `sunken` and the Layout handles the padding." |
| "I need a hover effect." | "This Frame is `interactive`." |
| "I'll make this text gray and small." | "This content is `Text.Menu.Item`." |

**Key Rule:** Do not define *how* it looks. Define *what* it is.

## 2. The Golden Workflow

Follow this step-by-step process for every component.

### Step 1: Mapping the Layout (The Skeleton)
Before writing a single tag, identify the **Layout Preset**.
- Is it a vertical list? → `Layout.Stack.List.Dense`
- Is it a toolbar? → `Layout.Row.Toolbar.Default`
- Is it a modal content? → `Layout.Stack.Content.None`
- Is it a single centered item? → `Layout.Center.Default`

**❌ Bad:** `layout="flex"` or manual overrides.
**✅ Good:** `layout={Layout.Row.Item.Default}`

### Step 2: Choosing the Surface (The Skin)
Don't use background colors or borders directly. Use **Surface Tokens**.
- `surface="base"`: The page background.
- `surface="raised"`: Cards, Modals.
- `surface="sunken"`: Inputs, Wells.
- `surface="selected"`: Active states.

**❌ Bad:** `className="bg-gray-100 border border-gray-200"`
**✅ Good:** `surface="sunken"`

### Step 3: Typography (The Voice)
Never use `<span>` or `<p>`. Never use utility classes for font size.
- Use `<Text>` component.
- Better yet, use **Context Presets**: `<Text.Menu.Item>`, `<Text.Card.Title>`.

**❌ Bad:** `<span className="text-sm font-bold">`
**✅ Good:** `<Text variant="body-sm" weight="bold">` or `<Text.Menu.Item>`

### Step 4: Interaction (The Behavior)
Do not manually write hover states or cursor styles.
- Use `interactive` prop on `Frame`.

**❌ Bad:** `className="cursor-pointer hover:bg-blue-500"`
**✅ Good:** `interactive={true}` (or `interactive="button"`)

## 3. The "Forbidden" List 🚫

If you find yourself writing these, **HALT** and check the docs.

1.  **`className="..."`**:
    - *Exception:* Only allowed inside `override={{ className: ... }}` and ONLY for properties strictly NOT supported by MDK (e.g., complex animations).
2.  **`div`, `span`, `button`**:
    - Use `Frame` for containers.
    - Use `Text` for text.
    - Use `Action` (if available) or `Frame` + `interactive` for buttons.
3.  **String Literals**:
    - `w="200px"` ❌ → `w={Size.n200}` ✅
    - `gap="10px"` ❌ → `gap={Space.n10}` ✅
4.  **Utility Classes**:
    - `flex`, `grid`, `block` (Handled by Layout)
    - `p-4`, `m-2` (Handled by Layout/Space tokens)
    - `rounded` (Handled by Radius tokens)

## 4. Strategic Prompts for Yourself

When planning a component, ask yourself these questions (or output them in your thought process):

> "What is the **Layout Token** that best describes this container's physics?"

> "Am I trying to 'paint' this component with CSS, or am I assembling it with **Tokens**?"

> "Is this typography a unique snowflake, or does it belong to a system preset like **Menu** or **Card**?"

> "If I removed all `className` props, would the structure still hold up?" (The answer must be YES).

## 5. Emergency Recovery

If you get stuck or the type checker yells at you:
1.  **Don't force it.** Do not cast types `as any`.
2.  **Check `FrameProps.ts`.** The API is the source of truth.
3.  **Move to `override`.** If you absolutely must use a specific CSS value, encapsulate it in `override={{ ... }}`. This is the system's "Escape Hatch" — use it sparingly.

---

**Final Word:** MDK is designed to constrain you. **Love the constraints.** They guarantee consistency.
