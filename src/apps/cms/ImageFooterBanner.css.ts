import { style } from "@vanilla-extract/css";
import { vars } from "@/ui/theme.css";
import * as utils from "@/ui/utils.css";

// 1. Container (Full Width, Dark Background)
export const container = style(utils.createGrid({
    ...utils.grid12.root,
    ...utils.grid12.subgrid,
    paddingTop: vars.space.n80,
    paddingBottom: vars.space.n80,
    backgroundColor: "#111", // Dark banner
    color: "#fff",
}));

// 2. Content (Centered 8 cols)
export const content = style(utils.createFlex({
    ...utils.grid12.center(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: vars.space.n24,

    "@container": {
        "viewport (max-width: 600px)": {
            ...utils.grid12.fullWidth,
            padding: `0 ${vars.space.n24}`,
        }
    }
}));

export const title = style({
    fontSize: "48px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    background: "linear-gradient(to right, #fff, #999)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
});

export const subtitle = style({
    fontSize: "20px",
    color: "#ccc",
    maxWidth: "600px",
    lineHeight: 1.6,
});

export const button = style(utils.createFlex({
    display: "flex",
    alignItems: "center",
    height: "56px",
    padding: "0 32px",
    borderRadius: vars.radius.full,
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: 700,
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    marginTop: vars.space.n16,
    transition: "transform 0.2s",

    selectors: {
        "&:hover": {
            transform: "scale(1.05)",
        }
    }
}));
