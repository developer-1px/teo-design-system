import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css";

const fadeIn = keyframes({
    "0%": { opacity: 0, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
    minHeight: "100vh",
    backgroundColor: vars.color.surface.base,
    color: vars.color.text.primary,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: vars.space.n32,
    gap: vars.space.n40,
});

export const header = style({
    textAlign: "center",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n12,
    animation: `${fadeIn} 0.5s ease-out`,
});

export const title = style({
    fontSize: "3rem",
    fontWeight: "800",
    letterSpacing: "-0.02em",
    background: `linear-gradient(135deg, ${vars.color.text.primary} 0%, ${vars.color.text.tertiary} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
});

export const subtitle = style({
    fontSize: vars.font.size.n16,
    color: vars.color.text.secondary,
    lineHeight: "1.6",
});

export const grid = style({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: vars.space.n24,
    width: "100%",
    maxWidth: "960px",
    animation: `${fadeIn} 0.6s ease-out 0.1s backwards`,
});

export const card = style({
    backgroundColor: vars.color.surface.raised,
    border: `1px solid ${vars.color.border.subtle}`,
    borderRadius: vars.radius.n16,
    padding: vars.space.n24,
    display: "flex",
    flexDirection: "column",
    gap: vars.space.n16,
    transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    cursor: "pointer",
    position: 'relative',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    ":hover": {
        transform: "translateY(-4px)",
        boxShadow: vars.elevation.n3,
        borderColor: vars.color.border.default,
    }
});

export const cardIcon = style({
    width: vars.space.n40,
    height: vars.space.n40,
    borderRadius: vars.radius.n12,
    backgroundColor: vars.color.surface.sunken,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: vars.color.text.primary,
});

export const cardTitle = style({
    fontSize: vars.font.size.n18,
    fontWeight: "600",
    color: vars.color.text.primary,
});

export const cardDesc = style({
    fontSize: vars.font.size.n14,
    color: vars.color.text.secondary,
    lineHeight: "1.5",
});

export const statusDot = style({
    width: vars.space.n8,
    height: vars.space.n8,
    borderRadius: vars.radius.full,
    backgroundColor: "#10b981", // Success green
    boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)",
});

export const footer = style({
    marginTop: "auto",
    paddingTop: vars.space.n40,
    display: "flex",
    alignItems: "center",
    gap: vars.space.n8,
    color: vars.color.text.tertiary,
    fontSize: vars.font.size.n12,
    opacity: 0.6,
});
