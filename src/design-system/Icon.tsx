import type React from "react"
import {IconSize, type IconSizeToken} from "./token/token.const.1tier"

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
  // Tokens are already CSS variables (e.g., "var(--icon-size-n16)")
  // Numbers and explicit strings are passed through

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
