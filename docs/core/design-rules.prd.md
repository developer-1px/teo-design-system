# Design Rules PRD

## 1. Problem Statement (Why)
* **Core Problem:** 
    1. **Low Design Quality:** The current default "Frame Text" or pure CSS approach results in suboptimal aesthetics ("gemini designs poorly").
    2. **Disconnect between Logic & Style:** Pure CSS lacks the dynamic capabilities of JS (composability, type safety), while inline styles are unmaintainable.
    3. **Inefficiency:** Lack of strict rules leads to "double work" (refactoring poor designs).
* **Why now:** To establish a "One-Shot" standard where the first output is high-quality, type-safe, and architecturally sound, leveraging Radix + Vanilla CSS without the limitations of static CSS.

## 2. Target Audience (Who)
* Primary User: AI Agent (Antigravity) - to ensure consistent, high-quality output.
* Secondary User: Developer - to ensure code is maintainable and type-safe.

## 3. Scope & Features (What - MECE)
* **Constraint: Technical Stack**
    * **Mandatory:** **Vanilla Extract** (Zero-runtime, type-safe CSS).
        * Use `recipe` variants for component states.
        * Use `sprinkles` (or equivalent type-safe utility) for atomic styles if needed.
    * **Banned:** Inline styles, `.css` files, Runtime CSS-in-JS (e.g., styled-components).
    * **Mandatory:** Strict adherence to **Design Tokens** (colors, spacing, typography) and **Surface System**.

* **Constraint: Layout Strategy (The "Alignment Litmus Test")**
    * **Rule:** "Do the internal children of this component need to align with the internal children of *another* instance of this component?"
        * **YES -> Grid + Subgrid:** Mandatory. (e.g., Menu items, Tables, Property Panels).
        * **NO -> Grid (Preferred) or Flex:** 
            * **Grid:** Default choice even for cards, blog posts, and general containers.
            * **Flex:** Allowed *only* for specific interactions like `gap` handling in wrapping elements (tags) or simple 1D text groupings where Grid is overkill.
    * **Grid Preference:** Strong bias towards Grid for almost all structural layouts.

## 4. Success Metrics (How)
* **Key Metric: Static Analysis Compliance (Custom Linter)**
    * **Goal:** Implement a custom ESLint plugin/rule set to provide "nudges" (Warnings/Errors) for violation of design rules.
    * **Checklist:**
        * No inline `style={{ ... }}` detected.
        * No `.css` imports detected (except global reset).
        * Usage of `flex` is flagged for review (or restricted to specific meaningful names/comments).
        * `subgrid` usage validation (optional advanced goal).
