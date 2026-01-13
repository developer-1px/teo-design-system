export function toToken(
    value: string | number | boolean | undefined,
    prefix: string,
): string | number | undefined {
    if (value === undefined || value === null || value === false) return undefined;

    // Default boolean mapping: true -> md
    if (value === true) {
        return `var(--${prefix}-md)`;
    }

    if (typeof value === "number") {
        return `var(--${prefix}-${String(value).replace(".", "-")})`;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();

        // Special semantic mappings
        if (prefix === "radius" && trimmed === "round") {
            return `var(--radius-round-md)`;
        }

        // If it has CSS units or is a relative value, return as is
        if (trimmed.endsWith("px") || trimmed.endsWith("%") || trimmed.endsWith("em") || trimmed.endsWith("rem") || trimmed.endsWith("vh") || trimmed.endsWith("vw")) {
            return trimmed;
        }

        // CSS keywords
        if (["auto", "inherit", "initial", "unset", "none", "flex", "transparent", "currentColor"].includes(trimmed)) {
            return trimmed;
        }

        // Handle multiple values (e.g. padding "10 20")
        if (trimmed.includes(" ")) {
            return trimmed
                .split(/\s+/)
                .map((v) => {
                    const cleanV = v.replace(".", "-");
                    if (!isNaN(parseFloat(v)) && !v.includes("px") && !v.includes("%")) {
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
