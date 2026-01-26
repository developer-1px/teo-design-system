import React from "react";

export const Frame = React.forwardRef<HTMLDivElement, any>(({
    children, style, override, rounded, surface, layout, spacing,
    border, interactive, w, h, p, gap,
    ...props
}, ref) => {
    // basic shim - consume all legacy props to avoid react warnings
    return (
        <div ref={ref} style={{ ...style, ...override }} {...props}>
            {children}
        </div>
    );
});
