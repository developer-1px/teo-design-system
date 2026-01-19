/**
 * Parsed key combination
 */
export interface ParsedKey {
    key: string;
    cmd: boolean;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
}

/**
 * Check if running on macOS
 */
const isMac = (): boolean => {
    return (
        typeof window !== "undefined" &&
        /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    );
};

/**
 * Parse key combination string
 *
 * @param combo - Key combination string (e.g., "cmd+k", "ctrl+shift+p")
 * @returns Parsed key object
 */
export function parseKeyCombo(combo: string): ParsedKey {
    const parts = combo.toLowerCase().split("+");
    const key = parts[parts.length - 1];

    return {
        key,
        cmd: parts.includes("cmd") || parts.includes("command"),
        ctrl: parts.includes("ctrl") || parts.includes("control"),
        shift: parts.includes("shift"),
        alt: parts.includes("alt") || parts.includes("option"),
    };
}

/**
 * Check if keyboard event matches key combination
 *
 * @param event - Keyboard event (native or React)
 * @param parsed - Parsed key combination
 * @returns Whether event matches the key combo
 */
export function matchesKeyCombo(event: KeyboardEvent | React.KeyboardEvent, parsed: ParsedKey): boolean {
    const eventKey = event.key.toLowerCase();
    const eventCode = event.code.toLowerCase();

    // Handle special keys
    const normalize = (k: string) => ({
        escape: "escape",
        enter: "enter",
        " ": "space",
        arrowup: "up",
        arrowdown: "down",
        arrowleft: "left",
        arrowright: "right",
    }[k] || k);

    const normalizedEventKey = normalize(eventKey);
    const normalizedEventCode = normalize(eventCode);

    const normalizedParsedKey =
        {
            esc: "escape",
            return: "enter",
            arrowup: "up",
            arrowdown: "down",
            arrowleft: "left",
            arrowright: "right",
        }[parsed.key] || parsed.key;

    // Check if keys match
    if (normalizedEventKey !== normalizedParsedKey && normalizedEventCode !== normalizedParsedKey) {
        return false;
    }

    // Check modifiers
    const mac = isMac();

    // @ts-ignore
    const metaKey = event.metaKey;
    // @ts-ignore
    const ctrlKey = event.ctrlKey;
    // @ts-ignore
    const shiftKey = event.shiftKey;
    // @ts-ignore
    const altKey = event.altKey;

    // On Mac: cmd maps to metaKey, On Windows/Linux: cmd maps to ctrlKey
    const cmdPressed = mac ? metaKey : ctrlKey;

    // If "cmd" is specified, check platform-specific modifier
    if (parsed.cmd && !cmdPressed) return false;
    if (!parsed.cmd && parsed.ctrl && !ctrlKey) return false;
    if (parsed.shift && !shiftKey) return false;
    if (parsed.alt && !altKey) return false;

    // Check for unwanted modifiers
    if (!parsed.cmd && !parsed.ctrl && (metaKey || (ctrlKey && !mac)))
        return false;
    if (!parsed.shift && shiftKey) return false;
    if (!parsed.alt && altKey) return false;

    return true;
}

/**
 * Get platform-specific modifier key label
 */
export function getModifierLabel(): string {
    return isMac() ? "⌘" : "Ctrl";
}

/**
 * Format key combination for display
 */
export function formatKeyCombo(combo: string): string {
    const parsed = parseKeyCombo(combo);
    const parts: string[] = [];

    if (parsed.cmd) {
        parts.push(isMac() ? "⌘" : "Ctrl");
    }
    if (parsed.ctrl && !parsed.cmd) {
        parts.push("Ctrl");
    }
    if (parsed.alt) {
        parts.push(isMac() ? "⌥" : "Alt");
    }
    if (parsed.shift) {
        parts.push(isMac() ? "⇧" : "Shift");
    }

    // Format key name
    const keyMap: Record<string, string> = {
        escape: "Esc",
        enter: "↵",
        space: "Space",
        up: "↑",
        down: "↓",
        left: "←",
        right: "→",
    };

    const keyLabel = keyMap[parsed.key] || parsed.key.toUpperCase();
    parts.push(keyLabel);

    return parts.join(isMac() ? "" : "+");
}
