/**
 * MDK Layout Presets
 *
 * Defines the strict set of layout combinations available in the design system.
 * These map to specific combinations of flex/grid/gap/padding properties.
 *
 * Usage:
 * <Frame layout={Layout.Stack.Content.Default} />
 */

export const Layout = {
  // ⬇️ Vertical flow (document rhythm)
  Stack: {
    Section: {
      /** Section block: title/desc/content rhythm, inset spacing */
      Default: "stack.section",
      /** Section but tighter: title/desc/content rhythm, inset spacing */
      Tight: "stack.section.tight",
    },

    Content: {
      /** Generic body/content stack (default for most containers) */
      Default: "stack.content",
      /** Tighter body/content stack */
      Tight: "stack.content.tight",
      /** Looser body/content stack */
      Loose: "stack.content.loose",
      /** No gap content stack */
      None: "stack.content.none",
      /** Scrollable content stack */
      Scroll: "stack.content.scroll",
    },

    List: {
      /** List container rhythm (items stack). Dividers are NOT a layout concern. */
      Default: "stack.list",
      /** Dense list container rhythm */
      Dense: "stack.list.dense",
    },

    Form: {
      /** Field stack (forms/settings). Tight rhythm for labels/inputs */
      Default: "stack.form",
      /** Narrow form/CTA stack */
      Center: "stack.form.center",
    },
  },

  // ➡️ Horizontal flow (one-line structures)
  Row: {
    Header: {
      /** Split header row: left (title) / right (actions), bar-like rules */
      Default: "row.header",
      /** Sticky header */
      Sticky: "row.header.sticky",
    },

    Toolbar: {
      /** Control bar (stronger break protection) */
      Default: "row.toolbar",
      /** Compact toolbar */
      Compact: "row.toolbar.compact",
      /** Sticky toolbar */
      Sticky: "row.toolbar.sticky",
    },

    Item: {
      /** Generic row item: icon/avatar + text, baseline-safe */
      Default: "row.item",
      /** Tighter row item (gap: 2) */
      Tight: "row.item.tight",
      /** Compact row item (gap: 1) */
      Compact: "row.item.compact",
    },

    Meta: {
      /** Meta row: label/value/badge, typography-friendly alignment */
      Default: "row.meta",
    },

    Actions: {
      /** Actions row: primary/secondary buttons aligned to the end */
      Default: "row.actions",
      /** Actions row: split between start/end */
      Between: "row.actions.between",
    },
  },

  // ↩️ Wrap flow (variable count clusters)
  Wrap: {
    Chips: {
      /** Chips/tags cluster with wrapping */
      Default: "wrap.chips",
      /** Loose chips/tags cluster */
      Loose: "wrap.chips.loose",
    },

    Filters: {
      /** Filter options cluster */
      Default: "wrap.filters",
    },

    Actions: {
      /** Button cluster (right aligned) */
      Default: "wrap.actions",
    },
  },

  // ▦ Grid flow (2D repetition)
  Grid: {
    Cards: {
      /** Responsive card grid (auto-fit/minmax rules live in CSS) */
      Default: "grid.cards",
      /** Compact card grid */
      Compact: "grid.cards.compact",
      /** Scrollable card grid */
      Scroll: "grid.cards.scroll",
    },

    Gallery: {
      /** Thumbnail/media tile grid */
      Default: "grid.gallery",
    },

    Dashboard: {
      /** Dashboard widget grid */
      Default: "grid.dashboard",
    },
  },

  // 🎰 Slots flow (role-based internal contracts)
  Slots: {
    Media: {
      /** leading / body / trailing (list item, search result row) */
      Default: "slots.media",
      /** tight slots */
      Tight: "slots.media.tight",
    },

    KeyValue: {
      /** key/value 2-column grid */
      Default: "slots.keyvalue",
    },
  },

  // 🎯 Center flow (empty/loading/hero)
  Center: {
    /** Default center: loading/empty state */
    Default: "center",
    /** Padded center: screen inset included */
    Padded: "center.padded",
  },
} as const;

// Strict Type Extraction (Recursive)
type DeepValue<T> = T extends object
  ? { [K in keyof T]: DeepValue<T[K]> }[keyof T]
  : T;

export type LayoutToken = DeepValue<typeof Layout>;
