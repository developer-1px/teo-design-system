# Proposal: Functional Class Syntax for Layouts

## 1. The Idea: Functional Class Names

You proposed replacing data attributes (`data-sizing-w="fill"`) with a cleaner class-based syntax:
> `class="hbox w(fill)"`

This approach (Functional CSS) heavily simplifies the DOM output and improves readability during debugging. It aligns well with modern utility-first frameworks (like Tailwind) while keeping our semantic "Context-Aware" logic intact.

---

## 2. Technical Feasibility: `w(fill)`

Can we use parentheses `()` in CSS class names? **Yes.**
According to the CSS spec, virtually any character can be used in a class name, but special characters must be **escaped** in the stylesheet.

### Implementation Details

#### JSX / HTML Output
In your component, you simply join the strings. Use `key` as the dynamic part if needed.
```tsx
// Frame.tsx
const className = clsx(
  "frame",
  layout === "hbox" && "hbox",
  layout === "vbox" && "vbox",
  w === "fill" && "w(fill)",   // Cleaner!
  w === "hug" && "w(hug)",
  w === "fixed" && "w(fixed)"
);

return <div className={className} />;
```

#### CSS Implementation (The Escaping Trick)
In CSS, we must escape the parentheses using a backslash `\`.
*Note: In CSS strings, it looks like `.` + `class` + `\` + `(`.*

```css
/* ----------------------------------------------------
   Context-Aware Sizing with Class Syntax
   Pattern: .parent-context > .child-intent
---------------------------------------------------- */

/* CASE A: Inside a Row (HBox) */
.hbox > .w\(fill\) {
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  width: auto;
}

.hbox > .w\(hug\) {
  width: fit-content;
  flex: 0 0 auto;
}

/* CASE B: Inside a Column (VBox) */
.vbox > .w\(fill\) {
  align-self: stretch;
  width: 100%;
  flex-grow: 0;
}

.vbox > .w\(hug\) {
  height: fit-content; /* Hug in VBox usually means height */
  flex: 0 0 auto;
}
```

---

## 3. Comparison: Data Attribute vs. Class

| Feature | Data Attribute (`[data-w="fill"]`) | Functional Class (`.w(fill)`) |
| :--- | :--- | :--- |
| **DOM Readability** | Verbose: `<div data-w="fill" ...>` | Clean: `<div class="w(fill) ...">` |
| **CSS Syntax** | Standard: `[data-w="fill"]` | Escaped: `.w\(fill\)` |
| **Specificity** | Equal (0-1-0) | Equal (0-1-0) |
| **JS Bundling** | No impact | standard string usage |
| **Developer DX** | Good | **Excellent** (matches mental model) |

## 4. Recommendation

**Adopt the `w(fill)` class syntax.**
It is visually distinct, communicates "Intent" clearly (it looks like a function: `width("fill")`), and works perfectly with the CSS Child Combinator strategy (`.hbox > .child`).

This creates a highly readable DOM structure:
```html
<div class="vbox fill surface-base">
  <!-- Header -->
  <div class="hbox w(fill) h(fixed)">...</div>
  
  <!-- Content -->
  <div class="hbox w(fill) h(fill)">...</div>
</div>
```
