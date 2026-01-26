import type { StyleRule } from "@vanilla-extract/css";
import { vars } from "../design-system/theme.css";

// -----------------------------------------------------------------------------
// Type Enforcements
// -----------------------------------------------------------------------------

type CSSProperties = StyleRule; // Alias for Vanilla Extract's style object type

// Properties exclusive to Grid containers
type GridContainerProps =
    | "gridTemplateColumns"
    | "gridTemplateRows"
    | "gridTemplateAreas"
    | "gridAutoColumns"
    | "gridAutoRows"
    | "gridAutoFlow"
    // | "gap" // Gap is shared by Flex and Grid
    | "columnGap"
    | "rowGap";

// Properties exclusive to Grid Items (children)
type GridItemProps =
    | "gridColumn"
    | "gridRow"
    | "gridArea"
    | "justifySelf"
    | "alignSelf"
    | "placeSelf";

// 1. Strict Grid Style: Can contain Grid props, CANNOT contain Flex container props
type StrictGridStyle = Omit<CSSProperties, "flexDirection" | "flexWrap" | "flexFlow"> & {
    display: "grid" | "inline-grid";
};

// 2. Strict Flex Style: Can contain Flex props, CANNOT contain Grid container props
type StrictFlexStyle = Omit<CSSProperties, GridContainerProps | GridItemProps> & {
    display: "flex" | "inline-flex";
};

// Helper function to enforce Grid constraints
export function createGrid(style: StrictGridStyle): StyleRule {
    return style as StyleRule;
}

// Helper function to enforce Flex constraints
export function createFlex(style: StrictFlexStyle): StyleRule {
    return style as StyleRule;
}

// -----------------------------------------------------------------------------
// Experimental: Strict Separation Factory
// -----------------------------------------------------------------------------

type PositioningProps = Pick<CSSProperties, GridItemProps | "margin" | "marginBottom" | "marginTop" | "marginLeft" | "marginRight" | "zIndex" | "position" | "top" | "bottom" | "left" | "right" | "width" | "height">;
type LayoutProps = Omit<CSSProperties, GridItemProps>; // Everything else

export const styled = {
    box: (params: { parent?: PositioningProps, layout?: LayoutProps }): StyleRule => {
        return {
            ...params.parent,
            ...params.layout
        } as StyleRule;
    },
    flex: (params: { parent?: PositioningProps, layout?: Omit<LayoutProps, "display"> & { display?: never } }): StyleRule => {
        return {
            ...params.parent,
            display: "flex",
            ...params.layout
        } as StyleRule;
    },
    grid: (params: { parent?: PositioningProps, layout?: Omit<LayoutProps, "display"> & { display?: never } }): StyleRule => {
        return {
            ...params.parent,
            display: "grid",
            ...params.layout
        } as StyleRule;
    }
};

// -----------------------------------------------------------------------------
// 4. Specialized Grid Factories
// -----------------------------------------------------------------------------

// 4.1 Master Layout Grid (12 Columns)
const COL_12 = 12;
export const grid12 = {
    // Defines the master grid root
    root: {
        display: "grid",
        gridTemplateColumns: `repeat(${COL_12}, minmax(0, 1fr))`,
        gridColumn: "1 / -1",
    } as const,

    // Defines a subgrid container
    subgrid: {
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridColumn: "1 / -1",
    } as const,

    // Span across N columns
    span: (cols: number) => ({
        gridColumn: `span ${cols}`
    }),

    // Center an element spanning N columns
    center: (cols: number) => {
        const start = ((COL_12 - cols) / 2) + 1;
        return {
            gridColumn: `${start} / span ${cols}`
        };
    },

    // Utilities
    fullWidth: {
        gridColumn: "1 / -1"
    } as const
};

// 4.2 Form Grid (2 Columns: Label | Input)
export const gridForm = {
    root: {
        display: "grid",
        gridTemplateColumns: "minmax(120px, auto) 1fr", // Label | Input
        gap: vars.space.n16,
        alignItems: "center",
    } as const,
    label: { gridColumn: "1" } as const,
    input: { gridColumn: "2" } as const,
    full: { gridColumn: "1 / -1" } as const
};

// 4. Table Grid
export const gridTable = {
    container: {
        display: "grid",
        width: "100%",
    } as const,
    row: {
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridColumn: "1 / -1",
    } as const
};

// -----------------------------------------------------------------------------
// 5. Named Grid Factory
// -----------------------------------------------------------------------------

/**
 * Creates a type-safe named grid container and assignment utility.
 * Enforces usage of named slots (grid-area) instead of column/row numbers.
 * 
 * @example
 * const layout = createNamedGrid({
 *   areas: ["header", "sidebar", "content"],
 *   columns: "240px 1fr",
 *   template: `
 *     "header header"
 *     "sidebar content"
 *   `
 * });
 * 
 * const headerStyle = style(layout.assign("header")); // OK
 * const invalidStyle = style(layout.assign("footer")); // TS Error
 */
export function createNamedGrid<Area extends string>(config: {
    areas: readonly Area[];
    columns?: string | string[];
    rows?: string | string[];
    templateAreas: string[];
    gap?: keyof typeof vars.space | string;
}) {
    const { columns, rows, templateAreas, gap } = config;

    return {
        // Container style
        container: {
            display: "grid",
            gridTemplateColumns: Array.isArray(columns) ? columns.join(" ") : columns,
            gridTemplateRows: Array.isArray(rows) ? rows.join(" ") : rows,
            gridTemplateAreas: templateAreas.map(row => `"${row}"`).join("\n"),
            gap: gap,
        } as StyleRule,

        // Item assigner (Typed to Area)
        assign: (area: Area): StyleRule => {
            return {
                gridArea: area
            } as StyleRule;
        }
    };
}
