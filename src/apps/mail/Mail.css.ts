import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { styled } from "../../ui/utils.css";
import { vars } from "../../ui/theme.css";
import { globalStyle } from "@vanilla-extract/css";

// 1. Shell
export const shell = style(styled.grid({
    parent: {
        width: "100%",
        height: "100%",
    },
    layout: {
        overflow: "hidden",
        gridTemplateColumns: "240px 1fr",
        backgroundColor: vars.color.background,
    }
}));

// 2. Sidebar
export const sidebar = style(styled.flex({
    parent: {
        height: "100%",
    },
    layout: {
        flexDirection: "column",
        borderRight: `1px solid ${vars.color.border}`,
        backgroundColor: vars.color.surface, // sunken
        padding: vars.space.n8,
        gap: vars.space.n8,
    }
}));

export const sidebarButton = recipe({
    base: styled.flex({
        parent: {
            width: "100%",
        },
        layout: {
            alignItems: "center",
            padding: `${vars.space.n8} ${vars.space.n8}`,
            borderRadius: vars.radius.n12,
            cursor: "pointer",
            border: "none",
            backgroundColor: "transparent",
            gap: vars.space.n12,
            color: vars.color.text,
            textAlign: "left",
        }
    }),
    variants: {
        active: {
            true: {
                backgroundColor: vars.color.background, // Active state often lighter/inverse of sunken
                fontWeight: 600,
                boxShadow: vars.shadow.n1,
            },
            false: {
                selectors: {
                    "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.03)",
                    }
                }
            }
        },
        variant: {
            primary: {
                backgroundColor: vars.color.primary,
                color: vars.color.textInverse,
                justifyContent: "center",
                selectors: {
                    "&:hover": {
                        opacity: 0.9,
                    }
                }
            },
            ghost: {}
        }
    },
    defaultVariants: {
        active: false,
        variant: "ghost"
    }
});

// 3. Main Area
export const main = style(styled.grid({
    layout: {
        gridTemplateRows: "min-content 1fr",
        height: "100%",
        backgroundColor: vars.color.background,
    }
}));

// 4. Header
export const header = style(styled.flex({
    parent: {
        width: "100%",
    },
    layout: {
        height: vars.space.n64,
        padding: `0 ${vars.space.n20}`,
        borderBottom: `1px solid ${vars.color.border}`,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: vars.color.surface, // base
        gap: vars.space.n12,
    }
}));

export const searchBar = style(styled.flex({
    layout: {
        height: vars.space.n40,
        padding: `0 ${vars.space.n12}`,
        backgroundColor: vars.color.background, // sunken usually darker or lighter? let's use background or surface
        borderRadius: vars.radius.n12,
        alignItems: "center",
        gap: vars.space.n8,
        width: "400px",
    }
}));

export const searchInput = style(styled.box({
    layout: {
        border: "none",
        background: "transparent",
        flex: 1,
        outline: "none",
        fontSize: "13px",
        color: vars.color.text,
    }
}));

// 5. Content Split (List | Detail)
export const content = style(styled.grid({
    layout: {
        gridTemplateColumns: "384px 1fr",
        height: "100%",
        overflow: "hidden",
    }
}));

// 6. Mail List
export const mailList = style(styled.flex({
    layout: {
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        borderRight: `1px solid ${vars.color.border}`,
        backgroundColor: vars.color.background,
    }
}));

export const mailItem = recipe({
    base: styled.flex({
        layout: {
            flexDirection: "column",
            padding: `${vars.space.n12} ${vars.space.n16}`,
            gap: vars.space.n8,
            borderBottom: `1px solid ${vars.color.border}`,
            cursor: "pointer",
            transition: "background-color 0.1s ease",
        }
    }),
    variants: {
        selected: {
            true: {
                backgroundColor: vars.color.surface,
                borderLeft: `3px solid ${vars.color.primary}`,
            },
            false: {
                selectors: {
                    "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.02)",
                    }
                }
            }
        },
        read: {
            true: { opacity: 0.8 },
            false: { opacity: 1 }
        }
    },
    defaultVariants: {
        selected: false,
        read: false
    }
});

// 7. Mail Detail
export const mailDetail = style(styled.flex({
    layout: {
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        backgroundColor: vars.color.background,
    }
}));

export const detailToolbar = style(styled.flex({
    layout: {
        height: vars.space.n48,
        padding: `0 ${vars.space.n16}`,
        borderBottom: `1px solid ${vars.color.border}`,
        alignItems: "center",
        gap: vars.space.n8,
        backgroundColor: vars.color.surface,
    }
}));

export const detailContent = style(styled.flex({
    layout: {
        flexDirection: "column",
        padding: vars.space.n24,
        gap: vars.space.n24,
    }
}));

// Utils
export const iconButton = style(styled.flex({
    layout: {
        width: vars.space.n32,
        height: vars.space.n32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: vars.radius.n12,
        cursor: "pointer",
        color: vars.color.text,
        transition: "background-color 0.1s",
    }
}));

globalStyle(`${iconButton}:hover`, {
    backgroundColor: vars.color.surface,
});
