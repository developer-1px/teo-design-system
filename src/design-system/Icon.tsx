import React from "react";
import "./lib/tokens.css";
import { IconSize, type IconSizeToken } from "./token/token.const.1tier";
import { toToken } from "./lib/utils";

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
    src: React.ElementType;
    size?: IconSizeToken | number | string;
    className?: string;
    style?: React.CSSProperties;
}

export function Icon({
    src: IconComponent,
    size = IconSize.n16,
    className,
    style,
    ...props
}: IconProps) {
    let sizeValue = size;
    // If the user passes a token object value (e.g. IconSize.n32 which is "icon-size.n32"),
    // we need to strip the prefix because toToken adds it again.
    if (typeof size === "string" && size.startsWith("icon-size.")) {
        sizeValue = size.split(".")[1];
    }

    const resolvedSize = toToken(sizeValue, "icon-size");

    // If resolvedSize is a variable (string), we pass it as width/height style or prop?
    // lucide-react 'size' prop expects number or string.
    // toToken returns `var(--icon-size-n16)` string.
    // Lucide accepts string for size.

    return (
        <IconComponent
            size={typeof size === "number" ? size : undefined}
            className={className}
            style={{
                ...style,
                width: resolvedSize,
                height: resolvedSize,
            }}
            {...props}
        />
    );
}
