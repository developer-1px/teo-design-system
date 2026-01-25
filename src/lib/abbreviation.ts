export function camelToKebab(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function generateAbbreviationMap(properties: string[]) {
    const sorted = [...properties].sort();
    const map: Record<string, string> = {};
    const used = new Set<string>();

    for (const prop of sorted) {
        let abbr = "";

        // Priority 1: CamelCase initials (e.g., marginTop -> mt)
        const stems = prop.split(/(?=[A-Z])|[-_]/).filter(Boolean);
        if (stems.length > 1) {
            abbr = stems.map(s => s[0].toLowerCase()).join("");
            if (!used.has(abbr)) {
                map[prop] = abbr;
                used.add(abbr);
                continue;
            }
        }

        // Priority 2: Sequential expansion (p -> po -> pos ...)
        const full = prop.replace(/[A-Z]/g, l => l.toLowerCase()).replace(/[-_]/g, "");
        for (let i = 1; i <= full.length; i++) {
            abbr = full.slice(0, i);
            if (!used.has(abbr)) {
                map[prop] = abbr;
                used.add(abbr);
                break;
            }
        }

        // Fallback: If still collision (unlikely with sorting), add index
        if (!map[prop]) {
            let i = 1;
            while (used.has(abbr + i)) i++;
            map[prop] = abbr + i;
            used.add(abbr + i);
        }
    }

    return map;
}

// A representative list of common CSS properties to ensure stability
export const COMMON_PROPERTIES = [
    "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
    "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "display", "position", "top", "right", "bottom", "left",
    "width", "height", "backgroundColor", "color", "fontSize",
    "fontWeight", "lineHeight", "border", "borderRadius", "boxShadow",
    "opacity", "zIndex", "overflow", "flex", "flexDirection",
    "justifyContent", "alignItems", "gap", "transition", "transform"
];
