/**
 * MDK Frame.layout — Final Object Spec
 *
 * Goals
 * - Enum-like DX:   layout={Layout.Stack.Section}
 * - No prop-assembly: gap/padding/align/overflow/sizing are embedded in presets
 * - MECE taxonomy: dir (Stack/Row/Wrap/Grid/Slots/Center) → context (leaf)
 * - Type-safe token extraction: LayoutToken = union of all leaf strings
 *
 * Notes
 * - Values are intentionally short ("stack.section") so they can map to CSS
 *   classes easily (e.g., `.layout-stack-section { ... }`).
 * - If you prefer namespacing, change TOKEN_PREFIX to "layout." and keep
 *   everything else identical.
 */

export const Layout = {
  // ⬇️ Vertical flow (document rhythm)
  Stack: {
    /** Section block: title/desc/content rhythm, inset spacing */
    Section: "stack.section",

    /** Generic body/content stack (default for most containers) */
    Content: "stack.content",

    /** List container rhythm (items stack). Dividers are NOT a layout concern. */
    List: "stack.list",

    /** Field stack (forms/settings). Tight rhythm for labels/inputs */
    Field: "stack.field",
  },

  // ➡️ Horizontal flow (one-line structures)
  Row: {
    /** Split header row: left (title) / right (actions), bar-like rules */
    Header: "row.header",

    /** Actions row: primary/secondary buttons aligned to the end */
    Actions: "row.actions",

    /** Generic row item: icon/avatar + text, baseline-safe */
    Item: "row.item",

    /** Meta row: label/value/badge, typography-friendly alignment */
    Meta: "row.meta",

    /** Inline row: compact icon+text / small inline clusters (no wrap) */
    Inline: "row.inline",
  },

  // ↩️ Wrap flow (variable count clusters)
  Wrap: {
    /** Chips/tags cluster with wrapping */
    Chips: "wrap.chips",

    /** Flowing media/thumb items without strict grid */
    Gallery: "wrap.gallery",
  },

  // ▦ Grid flow (2D repetition)
  Grid: {
    /** Responsive card grid (auto-fit/minmax rules live in CSS) */
    Cards: "grid.cards",

    /** Metric/stat tiles grid (denser defaults than cards) */
    Stats: "grid.stats",
  },

  // 🎰 Slots flow (role-based internal contracts)
  Slots: {
    /** leading / body / trailing (list item, search result row) */
    Media: "slots.media",

    /**
     * App shell slots (optional).
     * Keep ONLY if you truly want Frame-level app-shell layout.
     * Otherwise move this to a higher-level <AppShell>.
     */
    App: "slots.app",
  },

  // 🎯 Center flow (empty/loading/hero)
  Center: {
    /** Empty/Loading states: centered stack with reasonable inset */
    State: "center.state",

    /** Hero block: centered content with larger inset/rhythm */
    Hero: "center.hero",
  },
} as const;