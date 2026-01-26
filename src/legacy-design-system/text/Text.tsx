import React from "react";

const TextBase = React.forwardRef<HTMLSpanElement, any>(({ children, style, ...props }, ref) => (
    <span ref={ref} style={style} {...props}>{children}</span>
));

export const Text = Object.assign(TextBase, {
    Card: {
        Title: TextBase,
        Note: TextBase,
        Desc: TextBase,
    },
    Menu: {
        Item: TextBase,
        Group: TextBase,
    },
    Field: {
        Label: TextBase,
        Value: TextBase,
    },
    Prose: {
        Body: TextBase,
        Title: TextBase,
        Headline: TextBase, // just safely add more
    }
});
