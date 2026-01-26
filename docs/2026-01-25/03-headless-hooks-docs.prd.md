
# Runtime Headless Hook Docs PRD

## 1. Problem Statement (Why)
* **Zero Maintenance:** We want documentation that *cannot* drift from the code.
* **Instant Availability:** We want to see the docs *in the app* while developing, without running separate generation scripts.
* **User Constraint:** "No separate generation steps. Use Vite's glob import."

## 2. Target Audience
* **Primary:** Developers & AI Agents browsing the "Standard Library" of hooks.

## 3. Scope & Solution (What)
* **Core Philosophy:** "The Code *is* the Docs, rendered at runtime."
* **Mechanism:** **Vite Glob Import + Runtime Parsing**.
    *   **Data Source:** `import.meta.glob('/src/design-system/hooks/**/*.ts', { query: '?raw', eager: true })`.
        *   This provides the *raw source string* of every hook file at runtime.
    *   **Parsing:** A client-side utility (`parseHookSource.ts`) will:
        1.  Take the raw string.
        2.  Extract the top-level JSDoc comment (`/** ... */`).
        3.  Extract the exported function name.
        4.  Extract the `@example` block if present.
    *   **UI:** A new route `/docs/hooks`.
        *   **Sidebar:** List of hooks (grouped by folder structure).
        *   **Main:**
            *   **Header:** Hook Name.
            *   **Description:** Rendered Markdown from JSDoc.
            *   **Signature:** TypeScript Ref (or just the function signature from code).
            *   **Source:** Expandable `<pre>` block showing the actual code.

## 4. Implementation Plan
1.  **Route:** Add `/docs/hooks` to `src/App.tsx` (or main router).
2.  **Logic:** Create `src/docs/useHeadlessHooks.ts`.
    *   Uses `import.meta.glob` to load all hooks.
    *   Returns a list of `{ name, path, category, description, source }`.
3.  **UI:** Create `src/docs/HeadlessDocsPage.tsx`.
    *   Displays the list and selected hook details.
4.  **Parsing:** Implement regex-based JSDoc extractor.

## 5. Success Metrics
*   Navigation to `/docs/hooks` shows a list of all existing hooks.
*   Clicking a hook shows its JSDoc description and source code.
*   Adding a new file to `hooks/` immediately shows up in the UI (after HMR/Refresh).
