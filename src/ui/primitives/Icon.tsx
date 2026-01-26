import type React from "react";

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
    src: React.ElementType;
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

export function Icon({
    src: IconComponent,
    size = 16,
    className,
    style,
    ...props
}: IconProps) {
    return (
        <IconComponent
            size={typeof size === "number" ? size : undefined}
            className={className}
            style={{
                ...style,
                width: size,
                height: size,
            }}
            {...props}
        />
    );
}
