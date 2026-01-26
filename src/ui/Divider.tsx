import { vars } from "@/design-system/theme.css.ts";

export function Divider({ orientation = "horizontal", style }: { orientation?: "horizontal" | "vertical", style?: React.CSSProperties }) {
    return (
        <div
            style={{
                width: orientation === "horizontal" ? "100%" : "1px",
                height: orientation === "horizontal" ? "1px" : "100%",
                backgroundColor: vars.color.border.subtle,
                ...style
            }}
        />
    );
}
