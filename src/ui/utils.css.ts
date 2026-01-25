import type { StyleRule } from "@vanilla-extract/css";
import { vars } from "./theme.css";

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

// Properties exclusive to Flex containers
/*
type FlexContainerProps =
    | "flexDirection"
    | "flexWrap"
    | "flexFlow"
    | "justifyContent"
    | "alignItems"
    | "alignContent";
*/

// Properties exclusive to Grid Items (children)
type GridItemProps =
    | "gridColumn"
    | "gridRow"
    | "gridArea"
    | "justifySelf"
    | "alignSelf"
    | "placeSelf";

// Properties exclusive to Flex Items (children)
/*
type FlexItemProps =
    | "flex"
    | "flexGrow"
    | "flexShrink"
    | "flexBasis"
    | "alignSelf";
*/

// 1. Strict Grid Style: Can contain Grid props, CANNOT contain Flex container props
// (Note: align-items/justify-content apply to Grid too, so we only ban specific flex ones like flex-direction)
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
    /**
     * Creates a style with strict separation between parent positioning and internal layout.
     * @param params.parent Properties determining how this element is positioned in its parent (Grid Item props, margins, dimensions)
     * @param params.layout Properties determining how this element behaves internally (display, children layout, colors, padding)
     */
    box: (params: { parent?: PositioningProps, layout?: LayoutProps }): StyleRule => {
        return {
            ...params.parent,
            ...params.layout
        } as StyleRule;
    },

    /**
     * Creates a Flex Container that is also a positioned item.
     * Forces 'display: flex'
     */
    flex: (params: { parent?: PositioningProps, layout?: Omit<LayoutProps, "display"> & { display?: never } }): StyleRule => {
        return {
            ...params.parent,
            display: "flex",
            ...params.layout
        } as StyleRule;
    },

    /**
     * Creates a Grid Container that is also a positioned item.
     * Forces 'display: grid'
     */
    grid: (params: { parent?: PositioningProps, layout?: Omit<LayoutProps, "display"> & { display?: never } }): StyleRule => {
        return {
            ...params.parent,
            display: "grid",
            ...params.layout
        } as StyleRule;
    }
};

// -----------------------------------------------------------------------------
// Mixins
// -----------------------------------------------------------------------------

export const text = {
    truncate: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    } as const,
};

export const surface = {
    // 1. Base: The default app background
    base: {
        background: vars.color.background,
        color: vars.color.text,
    } as const,

    // 2. Paper/Card: Elevated surface with border and subtle shadow
    card: {
        background: vars.color.surface,
        color: vars.color.text,
        border: `1px solid ${vars.color.border}`,
        boxShadow: vars.shadow.n1,
    } as const,

    // 3. Sunken: For inputs, sidebars, or emphasized areas
    sunken: {
        background: vars.color.surface, // or a darker/lighter token if available
        color: vars.color.text,
        border: `1px solid ${vars.color.border}`,
    } as const,

    // 4. Raised: For floating elements, dropdowns, etc.
    raised: {
        background: vars.color.surface,
        color: vars.color.text,
        border: `1px solid ${vars.color.border}`,
        boxShadow: vars.shadow.n2,
    } as const,

    // 5. Highlight: Interactive hover state
    highlight: {
        background: "rgba(0, 0, 0, 0.04)",
    } as const,
};

// 4. Specialized Grid Factories

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

// Layout Mixins
export const layout = {
    flexCenter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    } as const,
    flexRow: {
        display: "flex",
        alignItems: "center",
    } as const,
    absoluteFull: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    } as const,
    // Deprecated in favor of grid12.subgrid, but kept for compatibility
    gridSubgrid: {
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridColumn: "1 / -1",
    } as const
};
