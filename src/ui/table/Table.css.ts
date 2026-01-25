import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "../theme.css";
import * as utils from "../utils.css";

// 1. Grid Configuration
export const tableContainer = style(utils.styled.grid({
    parent: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    layout: {
        overflow: "auto",
        minHeight: 0,
        borderRadius: vars.radius.n24, // Enforce rounded corners (Refactor UI Components)
        ...utils.surface.base,
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "13px",
    }
}));

// 2. Header
export const tableHeader = style(utils.styled.grid({
    parent: {
        ...utils.grid12.subgrid,
        position: "sticky",
        top: 0,
        zIndex: 10,
    },
    layout: {
        borderBottom: `1px solid ${vars.color.border}`,
        userSelect: "none",
        backgroundColor: vars.color.surface, // Override minimal surface mixin if needed, ensuring opacity
    }
}));

export const headerCell = style(utils.styled.flex({
    layout: {
        padding: `${vars.space.n8} ${vars.space.n12}`,
        borderRight: `1px solid ${vars.color.border}`,
        fontWeight: 600,
        alignItems: "center",
        cursor: "pointer",
        ...utils.text.truncate,
        backgroundColor: vars.color.surface,
    }
}));
// headerCell requires last-child selector which styled.flex doesn't simplify directly.
import { globalStyle } from "@vanilla-extract/css";

globalStyle(`${headerCell}:last-child`, {
    borderRight: "none",
});

// 3. Row
export const tableRow = recipe({
    base: utils.styled.grid({
        parent: {
            ...utils.grid12.subgrid,
        },
        layout: {
            borderBottom: `1px solid ${vars.color.border}`,
            backgroundColor: "transparent",
            transition: "background-color 0.1s ease",
        }
    }),
    variants: {
        selected: {
            true: {
                backgroundColor: "rgba(0, 0, 0, 0.04)", // utils.surface.highlight
            }
        },
        hover: {
            true: {
                // Recipe variant selectors are supported
            }
        }
    },
    defaultVariants: {
        selected: false,
        hover: false
    }
});

// Add hover selector outside since base uses styled.grid which returns a class name string/object
// But recipe expects an object. `styled.grid` definition returns StyleRule.
// Wait, `recipe` base expects StyleRule. `styled.grid` returns StyleRule. Ideally ok.
// However, `selectors` in recipe variants should be fine.

// 4. Cell
export const cell = recipe({
    base: utils.styled.flex({
        layout: {
            padding: `${vars.space.n8} ${vars.space.n12}`,
            borderRight: `1px solid ${vars.color.border}`,
            alignItems: "center",
            position: "relative",
            outline: "none",
            ...utils.text.truncate,
        }
    }),
    variants: {
        focused: {
            true: {
                boxShadow: `inset 0 0 0 2px ${vars.color.primary}`,
                zIndex: 2,
            }
        },
        selected: {
            true: {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                color: vars.color.primary,
            }
        },
        editing: {
            true: {
                padding: 0,
                zIndex: 3,
                background: vars.color.background,
                boxShadow: `inset 0 0 0 2px ${vars.color.primary}`,
            }
        },
        match: {
            true: {
                backgroundColor: "#fff3cd",
            }
        },
        activeMatch: {
            true: {
                backgroundColor: "#ffecb5",
                boxShadow: `inset 0 0 0 2px #ffc107`,
                zIndex: 2,
            }
        },
        copied: {
            true: {
                boxShadow: `inset 0 0 0 2px ${vars.color.primary}, inset 0 0 0 4px ${vars.color.surface}`,
                outline: `2px dashed ${vars.color.primary}`,
                outlineOffset: "-2px",
                zIndex: 2,
            }
        }
    },
    defaultVariants: {
        focused: false,
        selected: false,
        editing: false,
        match: false,
        activeMatch: false,
        copied: false
    }
});

globalStyle(`${cell()}:last-child`, {
    borderRight: "none",
});

export const input = style(utils.styled.box({
    layout: {
        width: "100%",
        height: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "inherit",
        font: "inherit",
        padding: "0 8px",
        margin: 0,
    }
}));
