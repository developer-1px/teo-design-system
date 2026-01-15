export function toToken(
  value: string | number | boolean | undefined,
  prefix: string,
): string | number | undefined {
  if (value === undefined || value === null || value === false)
    return undefined;

  // Default boolean mapping: true -> md
  if (value === true) {
    return `var(--${prefix}-md)`;
  }

  if (typeof value === "number") {
    // If it's a negative number, it's likely a manual offset (e.g. -25 for positioning),
    // so we treat it as pixels instead of a token.
    if (value < 0) return `${value}px`;
    // Branded Type numeric tokens need "n" prefix to match CSS variables
    // e.g., FontSize.n12 (runtime: 12) → var(--font-size-n12)
    return `var(--${prefix}-n${String(value).replace(".", "-")})`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    // If it is already a token reference (e.g. "size.n24", "container.n1024")
    // Resolve it directly to a variable: var(--size-n24), var(--container-n1024)
    if (trimmed.includes(".")) {
      const parts = trimmed.split(".");
      // Basic validation: if 2 parts, treat as [scale, key]
      if (parts.length === 2) {
        return `var(--${parts[0]}-${parts[1]})`;
      }
    }

    // Special semantic mappings
    if (prefix === "radius" && trimmed === "round") {
      return `var(--radius-round-md)`;
    }

    // If it has CSS units, calc, or is a relative value, return as is
    if (
      /^-?\d*\.?\d+(px|%|em|rem|vh|vw|pt|cm|mm|in|pc|ch|ex|vmin|vmax)$/.test(
        trimmed,
      ) ||
      trimmed.includes("calc(") ||
      trimmed.includes("var(")
    ) {
      return trimmed;
    }

    // CSS keywords
    if (
      [
        "auto",
        "inherit",
        "initial",
        "unset",
        "none",
        "flex",
        "transparent",
        "currentColor",
      ].includes(trimmed)
    ) {
      return trimmed;
    }

    // Handle multiple values (e.g. padding "10 20")
    if (trimmed.includes(" ")) {
      return trimmed
        .split(/\s+/)
        .map((v) => {
          const cleanV = v.replace(".", "-");
          if (
            !Number.isNaN(parseFloat(v)) &&
            !v.includes("px") &&
            !v.includes("%")
          ) {
            return `var(--${prefix}-${cleanV})`;
          }
          return v;
        })
        .join(" ");
    }

    // Default: assumes it's a token name (e.g. "sm", "lg", "full")
    return `var(--${prefix}-${trimmed.replace(".", "-")})`;
  }

  return value as any;
}
