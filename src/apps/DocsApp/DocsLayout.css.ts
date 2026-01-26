import { style } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css";

export const layout = style({
    display: "flex",
    flexDirection: "row",
    height: "calc(100vh - 80px)", // Minus nav height
    backgroundColor: vars.color.surface.base,
    marginTop: vars.space.n20, // Space from potential banner or just breathing room
    borderTop: `1px solid ${vars.color.border.subtle}`,
});

export const sidebar = style({
    width: "280px",
    flexShrink: 0,
    borderRight: `1px solid ${vars.color.border.subtle}`,
    padding: vars.space.n24,
    overflowY: "auto",
    backgroundColor: vars.color.surface.sunken, // Slightly darker
});

export const navSection = style({
    marginBottom: vars.space.n24,
});

export const navSectionTitle = style({
    fontSize: vars.font.size.n11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: vars.color.text.tertiary,
    marginBottom: vars.space.n8,
    paddingLeft: vars.space.n12, // Align with item padding
});

export const navItem = style({
    display: "block",
    padding: `${vars.space.n6} ${vars.space.n12}`,
    fontSize: vars.font.size.n14,
    color: vars.color.text.secondary,
    textDecoration: "none",
    borderRadius: vars.radius.n6,
    transition: "all 0.15s ease",
    marginBottom: "2px",
    ":hover": {
        color: vars.color.text.primary,
        backgroundColor: vars.color.surface.base, // Highlight on hover
    }
});

export const navItemActive = style({
    color: vars.color.text.primary,
    backgroundColor: vars.color.surface.raised,
    fontWeight: "500",
    boxShadow: vars.elevation.n1,
});

export const main = style({
    flex: 1,
    overflowY: "auto",
    padding: `${vars.space.n40} ${vars.space.n64}`,
    maxWidth: "100%",
});

export const contentContainer = style({
    maxWidth: "800px",
    margin: "0 auto",
});

export const toc = style({
    width: "240px",
    flexShrink: 0,
    padding: vars.space.n32,
    borderLeft: `1px solid ${vars.color.border.subtle}`,
    fontSize: vars.font.size.n12,
    display: "none", // Hide for smaller screens
    "@media": {
        "screen and (min-width: 1200px)": {
            display: "block"
        }
    }
});

export const sidebarHeader = style({
    marginBottom: vars.space.n32,
    paddingLeft: vars.space.n12,
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.n8,
});

export const sidebarTitle = style({
    fontWeight: vars.font.weight.bold,
    fontSize: vars.font.size.n16,
    color: vars.color.text.primary,
});

export const tocTitle = style({
    fontWeight: vars.font.weight.bold,
    marginBottom: vars.space.n12,
    borderBottom: `1px solid ${vars.color.border.subtle}`,
    paddingBottom: vars.space.n8,
    color: vars.color.text.primary,
});
