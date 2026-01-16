import type React from "react";

export function TeoLogo({
  height = 24,
  className,
  style,
}: {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      height={height}
      viewBox="0 0 200 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", width: "auto", ...style }}
      aria-label="teo.v logo"
    >
      <g
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="square"
        fill="none"
      >
        {/* t */}
        <path d="M24 12V52M12 24H36" />
        {/* e */}
        <path d="M76 38H56V24H76M56 38V52H76" />
        {/* o */}
        <rect x="96" y="24" width="28" height="28" rx="8" />
        {/* . */}
        <rect
          x="136"
          y="44"
          width="8"
          height="8"
          fill="currentColor"
          stroke="none"
        />
        {/* v */}
        <path d="M156 24L170 52L184 24" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
