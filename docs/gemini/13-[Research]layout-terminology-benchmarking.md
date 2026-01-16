# Layout Terminology Benchmark: "Pack" vs. The World

You asked: *"Is 'pack' widely used? I like it because it's shorter than justify, but I'm curious."*

## 1. Industry Standard Comparison

We benchmarked the naming conventions of modern UI frameworks against Figma and CSS.

| Framework | Main Axis (Flow Direction) | Cross Axis (Perpendicular) | Note |
| :--- | :--- | :--- | :--- |
| **Figma** | **Spacing Mode** (Packed / Space Between) | **Alignment** | "Packed" is a core Figma term. |
| **CSS Flexbox** | `justify-content` | `align-items` | Standard web terminology. |
| **SwiftUI** | (Implicit via `Spacer`) | `alignment` | No direct "justify" prop. |
| **Jetpack Compose** | `horizontalArrangement` | `verticalAlignment` | Very explicit, but verbose. |
| **Flutter** | `mainAxisAlignment` | `crossAxisAlignment` | Very explicit, but verbose. |
| **GTK / QT** | `pack_start`, `pack_end` | `align` | Historic desktop GUI toolkits used "packing". |

---

## 2. Analysis of "Pack"

### Pros
1.  **Direct Figma Mapping**: Figma explicitly calls the default state **"Packed"**.
    - *UI Panel:* "Spacing Mode: Packed" vs "Space Between".
2.  **Short & Punchy**: `pack` (4 letters) vs `justify` (7 letters) vs `arrangement` (11 letters).
3.  **Verb-based**: "Pack items to the start", "Pack items to the center".

### Cons
1.  **Not Standard Web**: A typical CSS developer knows `justify`, not `pack`.
2.  **SwiftUI Divergence**: Apple ecosystem doesn't use this term.

## 3. Verdict

**"Pack" is an excellent choice for a *Figma-centric* Design System.**

While standard CSS uses `justify`, your goal is to bridge the mental model between Design (Figma) and Code.
- Since you are building a "Figma-to-Code" system, using **Figma's vocabulary (`Packed`)** is actually *more correct* than using CSS vocabulary.
- It also solves the verbosity problem of `justify-content` or `main-axis-alignment`.

**Recommendation:** Stick with **`pack`**. It is unique but logically sound within the context of translating Figma designs.
