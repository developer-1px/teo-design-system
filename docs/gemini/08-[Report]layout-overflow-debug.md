# Layout Debug & Token System Report

This report analyzes the global scrolling issue encountered in `CRMApp.tsx` and explains the token system enforcement that occurred during the fix.

## 1. The Layout Problem: Flexbox & `min-width`

### **The Symptom**
The `div.hbox` container grew to **1968px** (Sidebar 240px + Main Content 1728px), causing a horizontal scrollbar on the viewport (1728px).

### **The Cause: `min-width: auto`**
In CSS Flexbox, a flex item (like our Main Content area) has a default style of `min-width: auto`.
- This means **"cannot shrink smaller than my content"**.
- The `CRMTable` inside the Main Content has a very wide scroll width (~5000px).
- Therefore, the Main Content area "refused" to shrink below that content width, even though we wanted it to be flexible (`flex: 1`).
- It ignored the `flex-shrink` constraint because its "minimum content size" forced it to be huge.

### **The Solution: `min-width: 0`**
By setting `minWidth: 0` (or `Size.n0`), we override this default behavior.
- We tell the browser: **"You are allowed to shrink down to 0px if necessary."**
- This allows the `flex: 1` rule to take precedence, forcing the Main Content to fit into the remaining space (1488px) and letting the internal `overflow: auto` handle the table's scrolling.

---

## 2. Token System & Type Safety

### **Why `0` (number) caused a Type Error**
You asked: *"0 is not a token so it should type error, why didn't it?"*

**Actually, it DID type error.**

In the previous step, when I attempted to use the literal number `0`:
```typescript
override={{ borderRight: true, minWidth: 0 }}
```
The TypeScript compiler blocked it with this error:
> **Error**: `Type 'number' is not assignable to type 'WidthToken | undefined'.`

This confirms that the **Minimal Design Kit (MDK) strictly enforces tokens**. You cannot pass raw numbers like `0`, `100`, or `50%` to layout props.

### **Why `Size.n0` Works**
To fix the type error, I used the explicit token:
```typescript
import { Size } from "../../design-system/token/token.const.1tier";

// ...
override={{ minWidth: Size.n0 }}
```

- **`Size.n0`** is a branded string: `"var(--size-n0)" as SizeToken`.
- It satisfies the `WidthToken` type requirement.
- It compiles to the CSS variable `--size-n0`, which is defined as `0px` in the global CSS.

### **Summary**
1. **CSS Issue**: `min-width: auto` prevented the flex container from preventing overflow.
2. **Fix**: `min-width: 0` was needed to allow shrinking.
3. **Type Safety**: The MDK correctly prevented the usage of raw `0` and forced the use of the semantically defined `Size.n0` token.
