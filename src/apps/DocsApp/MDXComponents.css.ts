import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/design-system/theme.css";

// H1: High impact, page title
export const h1Wrapper = style({
    marginBottom: vars.space.n32,
    marginTop: vars.space.n16,
    paddingBottom: vars.space.n16,
    borderBottom: `1px solid ${vars.color.border.subtle}`,
});

export const h1Separator = style({
    display: "none", // Replaced by borderBottom on wrapper
});

globalStyle(`${h1Wrapper} h1`, {
    fontSize: vars.font.size.n32, // Large title
    fontWeight: 700,
    letterSpacing: '-0.02em', // Tight tracking
    color: vars.color.text.primary,
    lineHeight: 1.2,
});

// H2: Section headers
export const h2Wrapper = style({
    marginBottom: vars.space.n16,
    marginTop: vars.space.n48, // Breathing room
});

globalStyle(`${h2Wrapper} h2`, {
    fontSize: vars.font.size.n24,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: vars.color.text.primary,
});

// H3: Subsection headers
export const h3Wrapper = style({
    marginBottom: vars.space.n12,
    marginTop: vars.space.n32,
});

globalStyle(`${h3Wrapper} h3`, {
    fontSize: vars.font.size.n18, // Was n20
    fontWeight: 600,
    color: vars.color.text.primary,
});

// Paragraphs
export const paragraph = style({
    fontSize: vars.font.size.n16,
    lineHeight: "1.7", // Relaxed reading
    marginBottom: vars.space.n24,
    color: vars.color.text.secondary, // Softer than black
    maxWidth: '65ch', // Optimal reading width
});

// Lists
export const list = style({
    marginLeft: vars.space.n24,
    marginBottom: vars.space.n24,
    listStyleType: "disc",
    color: vars.color.text.secondary,
});

export const listItem = style({
    marginBottom: vars.space.n8,
    lineHeight: "1.6",
    paddingLeft: vars.space.n4,
});

// Blockquote
export const blockquote = style({
    borderLeft: `3px solid ${vars.color.text.primary}`, // Thinner accent
    padding: `${vars.space.n12} ${vars.space.n20}`,
    margin: `${vars.space.n24} 0`,
    fontStyle: "italic",
    color: vars.color.text.secondary,
    backgroundColor: vars.color.surface.sunken,
    borderRadius: "0 8px 8px 0",
});

// Code
export const inlineCode = style({
    fontFamily: "var(--font-mono, monospace)", // Use variable if available
    backgroundColor: vars.color.surface.sunken,
    padding: "0.2em 0.4em",
    borderRadius: vars.radius.n4,
    fontSize: "0.85em",
    color: vars.color.text.primary,
    border: `1px solid ${vars.color.border.subtle}`,
});

export const preBlock = style({
    backgroundColor: vars.color.surface.primary, // Dark mode aesthetic for code usually
    color: vars.color.text.inverse, // Light text for dark bg? Or use syntax highlighter styles
    padding: vars.space.n20,
    borderRadius: vars.radius.n8,
    overflowX: "auto",
    marginBottom: vars.space.n32,
    fontSize: "0.9em",
    lineHeight: 1.5,
    fontFamily: "var(--font-mono, monospace)",
});

// Bold text emphasis
export const strong = style({
    fontWeight: 600,
    color: vars.color.text.primary,
});
