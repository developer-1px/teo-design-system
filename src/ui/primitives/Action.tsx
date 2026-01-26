import React from "react";
import { Icon } from "./Icon";
import * as styles from "./Action.css";
// vars removed

// Define simpler props, mapping legacy props where possible
export interface ActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "ghost" | "surface" | "primary" | "outline";
    size?: "xs" | "sm" | "md" | "lg" | "icon";
    icon?: React.ElementType;
    label?: string; // If label is missing, it might act like icon-only if size set to icon
    tooltip?: string;
    active?: boolean;
    // Legacy compatibility
    w?: string | number;
    justify?: string;
    rounded?: string | number;
    border?: boolean;
    p?: string | number;
    iconSize?: number;
    iconRotation?: number;
    glow?: boolean;
    shadow?: string;
    surface?: string;
}

export function Action({
    variant = "ghost",
    size = "sm", // Legacy default
    icon,
    label,
    tooltip,
    active,
    className,
    children,
    w,
    justify,
    rounded,
    style,
    iconSize,
    iconRotation,
    glow,
    shadow,
    surface,
    border,
    p,
    ...props
}: ActionProps) {

    // If icon only (no label), maybe force size="icon" if not specified? 
    // Legacy logic: if no label, it defaulted to square. 
    // Here we let consumer decide, but we can default size="icon" if strict. 
    // But let's stick to explicit size.

    const legacyStyle: React.CSSProperties = {
        ...(w ? { width: w } : {}),
        ...(justify ? { justifyContent: justify === "start" ? "flex-start" : justify } : {}),
        ...(rounded ? { borderRadius: rounded } : {}),
        ...(iconRotation ? { transform: `rotate(${iconRotation}deg)` } : {}),
    }

    const finalIconSize = iconSize || (size === "xs" ? 12 : size === "lg" ? 20 : 16);

    return (
        <button
            className={`${styles.action({ variant, size, active })} ${className || ""}`}
            title={tooltip}
            style={{ ...legacyStyle, ...style }}
            {...props}
        >
            {icon && <Icon src={icon} size={finalIconSize} />}
            {/* Icon size hardcoded 16? Legacy derived from size token. 
          Use simpler approach: 16 is good for sm/md. xs->12? lg->20? 
          Let's keep 16 default for now. 
      */}
            {label && <span>{label}</span>}
            {children}
        </button>
    );
}
