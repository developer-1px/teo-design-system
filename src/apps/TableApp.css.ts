import { style } from "@vanilla-extract/css";
import { vars } from "../ui/theme.css";
import { styled } from "../ui/utils.css";

export const container = style(styled.flex({
    parent: {
        width: "100%",
        height: "100%",
    },
    layout: {
        overflow: "hidden",
        flexDirection: "column",
        backgroundColor: vars.color.background,
    }
}));

export const toolbar = style(styled.flex({
    layout: {
        height: vars.space.n48,
        padding: `0 ${vars.space.n16}`,
        borderBottom: `1px solid ${vars.color.border}`,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: vars.color.surface,
    }
}));

export const titleGroup = style(styled.flex({
    layout: {
        alignItems: "center",
        gap: vars.space.n8,
    }
}));

export const divider = style(styled.box({
    layout: {
        width: "1px",
        height: "16px",
        backgroundColor: vars.color.border,
    }
}));

export const actionButton = style(styled.flex({
    layout: {
        padding: vars.space.n8,
        borderRadius: vars.radius.n12, // Updated to n12
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: vars.color.text,
        alignItems: "center",
        justifyContent: "center",
    }
}));
// Split hover into a separate style rule or keep it simple if possible, 
// strictly utils.styled doesn't support selectors easily in one go unless extended.
// But we can use globalStyle or just keep it simple. 
// For now, I'll use the vanilla style for the interactive part or mix it.
// Actually, `styled.box` returns a StyleRule, so we can't easily chain selectors unless we wrap it or use it as base.
// But `style` accepts an array.

import { globalStyle } from "@vanilla-extract/css";

globalStyle(`${actionButton}:hover`, {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
});

export const searchContainer = style(styled.flex({
    layout: {
        alignItems: "center",
        gap: vars.space.n4,
        padding: `0 ${vars.space.n8}`,
        height: vars.space.n32,
        border: `1px solid ${vars.color.border}`,
        borderRadius: vars.radius.n12, // Updated to n12
        backgroundColor: vars.color.background,
    }
}));

export const searchInput = style(styled.box({
    layout: {
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "13px",
        width: "150px",
        color: vars.color.text,
    }
}));

export const searchCounter = style(styled.box({
    layout: {
        fontSize: "12px",
        color: vars.color.text, // Use token
        opacity: 0.8,
    }
}));
