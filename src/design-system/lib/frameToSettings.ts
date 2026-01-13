import React from "react";
import type { FrameProps } from "./props.ts";
import { toToken } from "./utils.ts";

export function frameToSettings(props: FrameProps): { className: string; style: React.CSSProperties } {
    const classes: string[] = [];
    const vars: Record<string, any> = {};
    const standardStyles: React.CSSProperties = {
        padding: toToken(props.p, "space") as any,
        gap: toToken(props.gap, "space") as any,
    };

    // --- Base Layout ---
    if (props.grid) classes.push("grid");
    else if (props.flex !== undefined) classes.push("flex");

    if (props.fill) classes.push("fill");
    if (props.row) classes.push("hbox");
    else classes.push("vbox"); // Default

    if (props.pack) classes.push("pack");

    // Wrap
    if (props.wrap === "wrap") classes.push("wrap");
    else if (props.wrap === "nowrap") classes.push("nowrap");
    else if (props.wrap === "wrap-reverse") classes.push("wrap-reverse");

    // Align
    if (props.align) classes.push(`items-${props.align}`);

    // Justify
    if (props.justify) classes.push(`justify-${props.justify}`);

    // Flex
    if (props.flex === true) classes.push("flex-1");
    else if (props.flex === false) classes.push("flex-none");

    // --- Sizing Classes ---
    if (props.w === "full") classes.push("w-full");
    else if (props.w === "screen") classes.push("w-screen");

    if (props.h === "full") classes.push("h-full");
    else if (props.h === "screen") classes.push("h-screen");

    // --- Radius Classes ---
    if (props.rounded === true) {
        classes.push("r-md");
    } else if (props.rounded === false || props.rounded === "none") {
        classes.push("r-none");
    } else if (typeof props.rounded === "string") {
        classes.push(`r-${props.rounded}`);
    }

    // --- Surface Classes ---
    if (props.surface) {
        classes.push(`surface-${props.surface}`);
    }

    // --- Position Classes ---
    if (props.position) {
        classes.push(props.position);
    }

    // --- Overflow ---
    if (props.overflow) {
        classes.push(`overflow-${props.overflow}`);
    }

    // --- Cursor ---
    if (props.cursor) {
        classes.push(`cursor-${props.cursor}`);
    }

    // --- Shadow ---
    if (props.shadow) {
        classes.push(`shadow-${props.shadow}`);
    }

    // --- Scalar Variables (p, gap) ---
    // Note: We keep support for numeric --p/--gap variables for frame.css 
    // but standardStyles will override if toToken returns a var() or explicit value.
    if (typeof props.p === "number") {
        vars["--p"] = props.p;
    }

    if (typeof props.gap === "number") {
        vars["--gap"] = props.gap;
    }

    // --- Check for other numeric tokens if we want to support them via vars in future frame.css updates ---
    // For now, only p and gap are scalar-variable driving.

    return {
        className: classes.join(" "),
        style: { ...vars, ...standardStyles },
    };
}
