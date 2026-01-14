import type { LayoutToken } from "../Layout";
import { Layout } from "../Layout";
import { Size, Space } from "../token/token.const.1tier";
import type { FrameProps } from "./props";

/**
 * Resolves a high-level LayoutToken (e.g. "stack.section")
 * into low-level FrameProps (flex, gap, padding, etc.)
 */
export function resolveLayout(layout: LayoutToken): Partial<FrameProps> {
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
        overflow: "scroll",
        minHeight: Size.n0,
      };

    case Layout.Stack.Section.Default:
      return { align: "start", gap: Space.n16, p: Space.n24 }; // Comfortable section padding
    case Layout.Stack.Section.Tight:
      return { align: "start", gap: Space.n12, p: Space.n16 };

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
        overflow: "hidden",
      };
    case Layout.Row.Header.Sticky:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n12,
        h: Size.n44,
        overflow: "hidden",
        override: { style: { position: "sticky", top: 0, zIndex: 10 } },
      };

    case Layout.Row.Toolbar.Default:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n12,
        h: Size.n40, // Standard toolbar
        overflow: "hidden",
      };
    case Layout.Row.Toolbar.Compact:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n8,
        h: Size.n36, // Compact toolbar
        overflow: "hidden",
      };
    case Layout.Row.Toolbar.Sticky:
      return {
        row: true,
        align: "center",
        justify: "between",
        gap: Space.n12,
        h: Size.n44, // Match header
        overflow: "hidden",
        override: { style: { position: "sticky", top: 0, zIndex: 10 } },
      };

    case Layout.Row.Item.Default:
      return { row: true, align: "center", justify: "start", gap: Space.n12 };
    case Layout.Row.Item.Tight:
      return { row: true, align: "center", justify: "start", gap: Space.n8 };
    case Layout.Row.Item.Compact:
      return { row: true, align: "center", justify: "start", gap: Space.n4 };

    case Layout.Row.Meta.Default:
      return {
        row: true,
        align: "baseline",
        justify: "start",
        gap: Space.n8,
        overflow: "hidden",
      };

    case Layout.Row.Actions.Default:
      return { row: true, align: "center", justify: "end", gap: Space.n8 };
    case Layout.Row.Actions.Between:
      return { row: true, align: "center", justify: "between", gap: Space.n8 };

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
        columns: "repeat(auto-fit, minmax(var(--w-60), 1fr))",
      };
    case Layout.Grid.Cards.Compact:
      return {
        grid: true,
        align: "start",
        gap: Space.n8, // was 2 -> 8px
        columns: "repeat(auto-fit, minmax(var(--w-50), 1fr))",
      };
    case Layout.Grid.Cards.Scroll:
      return {
        grid: true,
        align: "start",
        gap: Space.n12, // was 3 -> 12px
        overflow: "scroll",
        minHeight: Size.n0,
        columns: "repeat(auto-fit, minmax(var(--w-60), 1fr))",
      };
    case Layout.Grid.Gallery.Default:
      return {
        grid: true,
        align: "start",
        gap: Space.n8, // was 2 -> 8px
        columns: "repeat(auto-fit, minmax(var(--w-32), 1fr))",
      };
    case Layout.Grid.Dashboard.Default:
      return {
        grid: true,
        align: "start",
        gap: Space.n12, // was 3 -> 12px
        columns: "repeat(auto-fit, minmax(var(--w-60), 1fr))",
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

    default:
      return {};
  }
}
