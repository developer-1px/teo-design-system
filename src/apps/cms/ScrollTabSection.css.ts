import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// Container spans full width of the parent (viewportFrame)
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,

    // Vertical spacing
    paddingTop: vars.space.n32,
    paddingBottom: vars.space.n32,
    rowGap: vars.space.n16,

    borderBottom: `1px solid ${vars.color.border}`,
    backgroundColor: vars.color.background,
}));

// Scrollable Tab List (Centered 10 cols)
export const tabList = style(utils.createFlex({
    ...utils.grid12.center(10), // This adds gridColumn - valid in Flex Item (child of Grid)
    display: "flex",
    gap: vars.space.n32,
    overflowX: "auto",
    paddingBottom: vars.space.n8,

    // Hide scrollbar but keep functionality
    selectors: {
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },

    "@container": {
        "viewport (max-width: 600px)": {
            ...utils.grid12.fullWidth,
            paddingLeft: vars.space.n16,
            paddingRight: vars.space.n16,
        }
    }
}));

export const tabItem = style(utils.createFlex({
    display: "flex",
    alignItems: "center",
    gap: vars.space.n8,
    fontSize: "14px",
    fontWeight: 600,
    color: vars.color.textSecondary,
    cursor: "pointer",
    whiteSpace: "nowrap",
    padding: `${vars.space.n8} 0`,
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",

    selectors: {
        "&:hover": {
            color: vars.color.text,
        },
        "&[data-active='true']": {
            color: vars.color.primary,
            borderBottomColor: vars.color.primary,
        }
    }
}));
