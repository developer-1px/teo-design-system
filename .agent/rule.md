# Project Rules & Conventions

## 1. Design & Styling Rules (Strict)

### 1.1. Tech Stack
*   **Mandatory:** **Vanilla Extract** (Zero-runtime, type-safe CSS).
    *   Use `recipe` variants for component states.
    *   Use `sprinkles` (or equivalent type-safe utility) for atomic styles if needed.
*   **Banned:**
    *   Inline styles (`style={{ ... }}`).
    *   Classic `.css` / `.scss` files (except global reset).
    *   Runtime CSS-in-JS (styled-components, emotion).
*   **Mandatory:** Strict adherence to **Design Tokens** (colors, spacing, typography) and **Surface System**.

### 1.2. Layout Strategy (The "Alignment Litmus Test")
*   **Grid First Philosophy:** Default to CSS Grid for almost all structural layouts (Pages, Containers, Cards, Blogs).
*   **Subgrid Mandatory:**
    *   **Rule:** If internal children of a component need to align with internal children of *another* instance of that component (e.g., Menu items, Tables, Property Panels), you **MUST** use `subgrid`.
*   **Flex Restricted:**
    *   **Allowed ONLY** for:
        *   Content-dependent sizing (where Grid is too rigid).
        *   Wrapping elements (e.g., a tag cloud with `gap`).
        *   Simple 1D groupings where alignment with siblings is not required.

## 2. Core Directive: Semantic HTML
*   **Rule:** Do NOT use `Frame`, `Text` components.
*   **Standard:** Use Semantic HTML (`div`, `section`, `h1`, `button`) combined with Vanilla Extract classes.
*   **Why:** AI Agents and LLMs work best with standard HTML/CSS.

## 3. Workflow Rules
- **PRD 작성 시 규칙:** 사용자의 답변에 항상 '5 Whys' 기법을 적용하여 근본 원인을 파악하기 전까지는 다음 섹션으로 넘어가지 말 것.
