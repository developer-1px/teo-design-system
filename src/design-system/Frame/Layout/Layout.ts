/**
 * MDK Layout Presets
 *
 * This file defines the **Standard Layout Combinations** for the Design System.
 * Instead of manually setting `flex`, `row`, `gap`, `align`, `justify`, and `padding` for every Frame,
 * you should select a semantic `Layout` preset that matches your design intent.
 *
 * These presets enforce consistent spacing rhythm and alignment rules across the application.
 *
 * ---
 *
 * **Core Concepts:**
 * - **Stack (Vertical)**: Standard document flow. Content stacks top-to-bottom.
 * - **Row (Horizontal)**: Single-line flow. Content sits side-by-side.
 * - **Wrap (Cluster)**: Multi-line flow. Content wraps to new lines (e.g., tags).
 * - **Grid (2D)**: Two-dimensional layout. Repeating cards, tiles, or defined columns.
 * - **Center (Placement)**: Alignment utilities for centering content.
 * - **Slots (Structural)**: Specific structures for recurring patterns (e.g., Media object).
 *
 * ---
 *
 * **Usage:**
 * ```tsx
 * // Standard vertical page content
 * <Frame layout={Layout.Stack.Content.Default}>
 *
 * // Horizontal header bar
 * <Frame layout={Layout.Row.Header.Default}>
 *
 * // Grid of cards
 * <Frame layout={Layout.Grid.Cards.Default}>
 * ```
 */

import type React from "react";
import { Size, Space } from "../../token/token.const.1tier.ts";
import type { FrameOverrides } from "../FrameProps.ts";

export const Layout = {
  // ⬇️ Vertical Flow (Stack)
  // Use for: Page layouts, Sidebar lists, Form groups, Content blocks.
  Stack: {
    /**
     * **Section container**
     * - Rhythm: Vertical stack of heavy content blocks.
     * - Spacing: Comfortable gap (`Space.n16`) and padding (`Space.n40` to breathe).
     * - Use for: Main page sections, Cards with internal padding.
     */
    Section: {
      Default: "stack.section",
      /** Tighter version: `Space.n12` gap, `Space.n24` padding. */
      Tight: "stack.section.tight",
    },

    /**
     * **Content body**
     * - Rhythm: Vertical stack of related elements (Title + Text + Button).
     * - Spacing: `Space.n12` gap. No padding.
     * - Use for: Default content flow inside a container.
     */
    Content: {
      Default: "stack.content",
      /** Tighter: `Space.n8` gap. Use for high-density UI or small areas. */
      Tight: "stack.content.tight",
      /** Looser: `Space.n16` gap. Use for landing pages or marketing copy. */
      Loose: "stack.content.loose",
      /** Zero gap: `Space.n0`. Use when elements need to touch or manage their own margins. */
      None: "stack.content.none",
      /** Scrollable: Standard gap but enables `overflow: scroll`. */
      Scroll: "stack.content.scroll",
    },

    /**
     * **List container**
     * - Rhythm: Vertical stack of repeated items (List Items).
     * - Spacing: `Space.n8` gap.
     * - Use for: Navigation lists, Menus, Data lists.
     */
    List: {
      Default: "stack.list",
      /** Dense: `Space.n4` gap. Use for tight menus or file trees. */
      Dense: "stack.list.dense",
    },

    /**
     * **Form stack**
     * - Rhythm: Vertical stack of Labal+Input groups.
     * - Spacing: `Space.n20` gap (distinct separation between fields).
     * - Use for: Forms, Settings panels.
     */
    Form: {
      Default: "stack.form",
      /** Center aligned: Items centered. Used for newsletter signups, login forms. */
      Center: "stack.form.center",
    },
  },

  // ➡️ Horizontal Flow (Row)
  // Use for: Headers, Toolbars, List Items, Action bars.
  Row: {
    /**
     * **Headings / Bars**
     * - Layout: Horizontal, `justify: between`, `align: center`.
     * - Sizing: Fixed height `Size.n44` (min-tap target).
     * - Use for: Panel headers, Dialog titles, Page tops.
     */
    Header: {
      Default: "row.header",
      /** Sticky: Stays at top (`position: sticky`). */
      Sticky: "row.header.sticky",
    },

    /**
     * **Toolbars**
     * - Layout: Horizontal, `justify: between`, `align: center`.
     * - Sizing: `Size.n40` (Default) or `Size.n36` (Compact).
     * - Use for: Editor toolbars, Action strips, Filter bars.
     */
    Toolbar: {
      Default: "row.toolbar",
      Compact: "row.toolbar.compact",
      /** Sticky: Stays at top. Height `Size.n44`. */
      Sticky: "row.toolbar.sticky",
    },

    /**
     * **List Items / Component Rows**
     * - Layout: Horizontal, `justify: start`, `align: center`.
     * - Gap: `Space.n12`.
     * - Use for: Individual rows in a list, Sidebar items, Table rows.
     */
    Item: {
      Default: "row.item",
      /** Tight: `Space.n8` gap. */
      Tight: "row.item.tight",
      /** Compact: `Space.n4` gap. High density. */
      Compact: "row.item.compact",
    },

    /**
     * **Label-Value Pair**
     * - Layout: Horizontal, `justify: between`.
     * - Use for: 'Label ... Value' rows, Property inspectors.
     */
    LabelValue: {
      Default: "row.labelvalue",
    },

    /**
     * **Meta Interaction**
     * - Layout: Horizontal, `justify: start`, `align: baseline`.
     * - Spacing: `Space.n8`.
     * - Use for: "Label: Value" pairs in read-only views.
     */
    Meta: {
      Default: "row.meta",
    },

    /**
     * **Action Groups**
     * - Layout: Horizontal, `align: center`.
     * - Spacing: `Space.n8`.
     * - Use for: Button groups, Icon groups.
     */
    Actions: {
      /** End-aligned: `justify: end`. Standard for modal footers. */
      Default: "row.actions",
      /** Space-between: `justify: between`. Split actions (Cancel ... Save). */
      Between: "row.actions.between",
      /** Center: `justify: center`. Centered action groups. */
      Center: "row.actions.center",
    },

    /**
     * **App Container**
     * - Layout: Horizontal, `align: stretch`.
     * - Spacing: `Space.n0`.
     * - Use for: Top-level App container (Sidebar + Content).
     */
    AppContainer: {
      Default: "row.appcontainer",
    },
  },

  // ↩️ Wrap Flow (Cluster)
  // Use for: Tags, Filters, Chip arrays.
  Wrap: {
    /**
     * **Chips / Tags**
     * - Layout: Wrap, `justify: start`, `align: center`.
     * - Spacing: `Space.n8`.
     */
    Chips: {
      Default: "wrap.chips",
      Loose: "wrap.chips.loose",
    },

    /**
     * **Filter Group**
     * - Layout: Wrap, `Space.n12` gap.
     */
    Filters: {
      Default: "wrap.filters",
    },

    /**
     * **Wrapped Actions**
     * - Layout: Wrap, `justify: end`.
     */
    Actions: {
      Default: "wrap.actions",
    },
  },

  // ▦ Grid Flow (2D)
  // Use for: Card collections, Dashboards, Galleries.
  Grid: {
    /**
     * **Card Grid**
     * - Layout: Auto-fit columns.
     * - Spacing: `Space.n12`.
     * - Use for: Resource cards, team members.
     */
    Cards: {
      /** Standard: min-width 240px (`Size.n240`) */
      Default: "grid.cards",
      /** Compact: min-width 192px (`Size.n192`) */
      Compact: "grid.cards.compact",
      /** Scrollable: Standard grid with vertical scroll enabled */
      Scroll: "grid.cards.scroll",
    },

    /**
     * **Analysis Grid**
     * - Layout: Dashboard widget layout.
     * - Min-width: 240px (`Size.n240`).
     */
    Dashboard: {
      Default: "grid.dashboard",
    },

    /**
     * **Visual Gallery**
     * - Layout: Smaller tiles.
     * - Min-width: 128px (`Size.n128`).
     */
    Gallery: {
      Default: "grid.gallery",
    },
  },

  // 🎰 Slot Patterns (Structural)
  // Use for: Specific composite component internals.
  Slots: {
    /**
     * **Media Pattern**
     * - Structure: [Icon/Image] - [Content] - [Action?].
     * - Layout: Standard Row but structurally semantic.
     */
    Media: {
      Default: "slots.media",
      Tight: "slots.media.tight",
    },
    /**
     * **Key-Value Pattern**
     * - Structure: [Label] - [Value].
     * - Layout: Grid.
     */
    KeyValue: {
      Default: "slots.keyvalue",
    },
  },

  // 🎯 Alignment Patterns
  Center: {
    /** Centered content (horizontal & vertical). Use for loaders, empty states. */
    Default: "center",
    /** Centered with padding. Use for full-page error screens. */
    Padded: "center.padded",
  },

  // @FIXME: for dev mark
  RowTemp: "row.temp",
  StackTemp: "stack.temp",
} as const;

// Strict Type Extraction (Recursive)
type DeepValue<T> = T extends object
  ? { [K in keyof T]: DeepValue<T[K]> }[keyof T]
  : T;

export type LayoutToken = DeepValue<typeof Layout>;

/**
 * Resolves a high-level LayoutToken (e.g. "stack.section")
 * into low-level FrameProps (flex, gap, padding, etc.)
 */
export function resolveLayout(
  layout: LayoutToken,
): FrameOverrides & { style?: React.CSSProperties } {
  switch (layout) {
    // --- Stack ---
    case Layout.Stack.Content.Default:
      return { align: "start", gap: Space.n12 }; // Standard content gap
    case Layout.Stack.Content.Tight:
      return { align: "start", gap: Space.n8 };
    case Layout.Stack.Content.Loose:
      return { align: "start", gap: Space.n16 };
    case Layout.Stack.Content.None:
      return { align: "start", gap: Space.n0 };
    case Layout.Stack.Content.Scroll:
      return {
        align: "start",
        gap: Space.n12,
        scroll: true,
        minHeight: Size.n0,
      };

    case Layout.Stack.Section.Default:
      // UPDATED: Space.n40 (40px) for better modern section breathing.
      // Was n24 (24px)
      return { align: "start", gap: Space.n16, p: Space.n40 };
    case Layout.Stack.Section.Tight:
      return { align: "start", gap: Space.n12, p: Space.n24 };

    case Layout.Stack.Form.Default:
      return { align: "start", gap: Space.n20 }; // Standard form spacing
    case Layout.Stack.Form.Center:
      return { align: "center", gap: Space.n16 };

    case Layout.Stack.List.Default:
      return { align: "start", gap: Space.n8 }; // Dense list
    case Layout.Stack.List.Dense:
      return { align: "start", gap: Space.n4 }; // Very dense list

    // --- Row ---
    case Layout.Row.Header.Default:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n12,
        px: Space.n16, // 16px horizontal padding
        h: Size.n44, // Minimal standard
        clip: true,
      };
    case Layout.Row.Header.Sticky:
      return {
        row: true,
        align: "center",
        gap: Space.n12,
        h: Size.n44,
        clip: true,
        style: { position: "sticky", top: 0, zIndex: 10 },
      };

    case Layout.Row.Toolbar.Default:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n12,
        h: Size.n40, // Standard toolbar
        clip: true,
      };
    case Layout.Row.Toolbar.Compact:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n8,
        h: Size.n36, // Compact toolbar
        clip: true,
      };
    case Layout.Row.Toolbar.Sticky:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n12,
        h: Size.n44, // Match header
        clip: true,
        style: { position: "sticky", top: 0, zIndex: 10 },
      };

    case Layout.Row.Item.Default:
      return { row: true, align: "center", justify: "start", gap: Space.n12 };
    case Layout.Row.Item.Tight:
      return { row: true, align: "center", justify: "start", gap: Space.n8 };
    case Layout.Row.Item.Compact:
      return { row: true, align: "center", justify: "start", gap: Space.n4 };

    case Layout.Row.LabelValue.Default:
      return { row: true, align: "center", justify: "between", gap: Space.n12 };

    case Layout.Row.Meta.Default:
      return {
        row: true,
        align: "baseline",
        justify: "start",
        gap: Space.n8,
        clip: true,
      };

    case Layout.Row.Actions.Default:
      return { row: true, align: "center", justify: "end", gap: Space.n8 };
    case Layout.Row.Actions.Between:
      return { row: true, align: "center", justify: "between", gap: Space.n8 };
    case Layout.Row.Actions.Center:
      return { row: true, align: "center", justify: "center", gap: Space.n8 };

    case Layout.Row.AppContainer.Default:
      return { row: true, align: "stretch", gap: Space.n0, maxWidth: "100%" };

    // --- Wrap ---
    case Layout.Wrap.Chips.Default:
      return {
        row: true,
        wrap: "wrap",
        align: "center",
        justify: "start",
        gap: Space.n8, // was 2 -> 8px
      };
    case Layout.Wrap.Chips.Loose:
      return {
        row: true,
        wrap: "wrap",
        align: "center",
        justify: "start",
        gap: Space.n12, // was 3 -> 12px
      };
    case Layout.Wrap.Filters.Default:
      return {
        row: true,
        wrap: "wrap",
        align: "center",
        justify: "start",
        gap: Space.n12, // was 3 -> 12px
      };
    case Layout.Wrap.Actions.Default:
      return {
        row: true,
        wrap: "wrap",
        align: "center",
        justify: "end",
        gap: Space.n8, // was 2 -> 8px
      };

    // --- Grid ---
    case Layout.Grid.Cards.Default:
      return {
        grid: true,
        align: "start",
        gap: Space.n12, // was 3 -> 12px
        // UPDATED: Use --size-n240 (240px)
        columns: "repeat(auto-fit, minmax(var(--size-n240, 240px), 1fr))",
      };
    case Layout.Grid.Cards.Compact:
      return {
        grid: true,
        align: "start",
        gap: Space.n8, // was 2 -> 8px
        // UPDATED: Use --size-n192 (192px)
        columns: "repeat(auto-fit, minmax(var(--size-n192, 192px), 1fr))",
      };
    case Layout.Grid.Cards.Scroll:
      return {
        grid: true,
        align: "start",
        gap: Space.n12, // was 3 -> 12px
        scroll: true,
        minHeight: Size.n0,
        // UPDATED: Use --size-n240 (240px)
        columns: "repeat(auto-fit, minmax(var(--size-n240, 240px), 1fr))",
      };
    case Layout.Grid.Gallery.Default:
      return {
        grid: true,
        align: "start",
        gap: Space.n8, // was 2 -> 8px
        // UPDATED: Use --size-n128 (128px)
        columns: "repeat(auto-fit, minmax(var(--size-n128, 128px), 1fr))",
      };
    case Layout.Grid.Dashboard.Default:
      return {
        grid: true,
        align: "start",
        gap: Space.n12, // was 3 -> 12px
        // UPDATED: Use --size-n240 (240px)
        columns: "repeat(auto-fit, minmax(var(--size-n240, 240px), 1fr))",
      };

    // --- Slots ---
    case Layout.Slots.Media.Default:
      return { row: true, align: "start", justify: "start", gap: Space.n12 }; // was 3
    case Layout.Slots.Media.Tight:
      return { row: true, align: "start", justify: "start", gap: Space.n8 }; // was 2
    case Layout.Slots.KeyValue.Default:
      return {
        grid: true,
        align: "start",
        gap: Space.n8, // was 2
        columns: "var(--kv-key-w, auto) 1fr",
      };

    // --- Center ---
    case Layout.Center.Default:
      return { align: "center", justify: "center", gap: Space.n12 }; // was 3
    case Layout.Center.Padded:
      return {
        align: "center",
        justify: "center",
        gap: Space.n12,
        p: Space.n24,
      }; // was 6 units (24px)

    // --- Temporary / Dev ---
    case Layout.RowTemp:
      return { row: true, align: "center", gap: Space.n0 };
    case Layout.StackTemp:
      return { align: "start", gap: Space.n0 };

    default:
      return {};
  }
}
