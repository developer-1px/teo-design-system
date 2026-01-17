import { useEffect, useRef } from "react";

/**
 * Hot key handler function
 */
export type HotKeyHandler = (event: KeyboardEvent) => void;

/**
 * Hot key map: key combination → handler
 *
 * Key format examples:
 * - "cmd+k" → Command (macOS) / Ctrl (Windows/Linux) + K
 * - "cmd+shift+p" → Command/Ctrl + Shift + P
 * - "escape" → Escape key
 * - "/" → Slash key
 * - "alt+enter" → Alt + Enter
 */
export type HotKeyMap = Record<string, HotKeyHandler>;

/**
 * Hot keys options
 */
export interface UseHotKeysOptions {
  /** Enable/disable hot keys (default: true) */
  enabled?: boolean;
  /** Prevent default browser behavior (default: true) */
  preventDefault?: boolean;
  /** Enable hot keys on form elements (input/textarea) (default: false) */
  enableOnFormTags?: boolean;
  /** Scoped to component lifecycle (unmount = cleanup) (default: true) */
  scoped?: boolean;
}

/**
 * Parsed key combination
 */
interface ParsedKey {
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
 *
 * @example
 * ```tsx
 * parseKeyCombo("cmd+k")
 * // { key: "k", cmd: true, ctrl: false, shift: false, alt: false }
 *
 * parseKeyCombo("ctrl+shift+p")
 * // { key: "p", cmd: false, ctrl: true, shift: true, alt: false }
 * ```
 */
function parseKeyCombo(combo: string): ParsedKey {
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
 * @param event - Keyboard event
 * @param parsed - Parsed key combination
 * @returns Whether event matches the key combo
 */
function matchesKeyCombo(event: KeyboardEvent, parsed: ParsedKey): boolean {
  const eventKey = event.key.toLowerCase();

  // Handle special keys
  const normalizedEventKey =
    {
      escape: "escape",
      enter: "enter",
      " ": "space",
      arrowup: "up",
      arrowdown: "down",
      arrowleft: "left",
      arrowright: "right",
    }[eventKey] || eventKey;

  const normalizedParsedKey =
    {
      esc: "escape",
      return: "enter",
    }[parsed.key] || parsed.key;

  // Check if keys match
  if (normalizedEventKey !== normalizedParsedKey) {
    return false;
  }

  // Check modifiers
  const mac = isMac();

  // On Mac: cmd maps to metaKey, On Windows/Linux: cmd maps to ctrlKey
  const cmdPressed = mac ? event.metaKey : event.ctrlKey;
  const ctrlPressed = event.ctrlKey;
  const shiftPressed = event.shiftKey;
  const altPressed = event.altKey;

  // If "cmd" is specified, check platform-specific modifier
  if (parsed.cmd && !cmdPressed) return false;
  if (!parsed.cmd && parsed.ctrl && !ctrlPressed) return false;
  if (parsed.shift && !shiftPressed) return false;
  if (parsed.alt && !altPressed) return false;

  // Check for unwanted modifiers
  if (!parsed.cmd && !parsed.ctrl && (event.metaKey || (event.ctrlKey && !mac)))
    return false;
  if (!parsed.shift && shiftPressed) return false;
  if (!parsed.alt && altPressed) return false;

  return true;
}

/**
 * Global hot keys hook
 *
 * Registers global keyboard shortcuts with declarative API.
 * Supports key combinations, conditional activation, and platform-specific modifiers.
 *
 * Features:
 * - Declarative key map: `{ "cmd+k": handler }`
 * - Platform support: "cmd" → ⌘ on macOS, Ctrl on Windows/Linux
 * - Conditional activation via `enabled` option
 * - Form tag detection (skip input/textarea by default)
 * - Automatic cleanup on unmount
 *
 * @param keyMap - Key combination → handler map
 * @param options - Hot keys configuration
 *
 * @example
 * ```tsx
 * // Global shortcuts
 * useHotKeys({
 *   "cmd+k": () => openCommandPalette(),
 *   "cmd+/": () => toggleSidebar(),
 *   "escape": () => closeModal(),
 * });
 *
 * // Conditional shortcuts
 * useHotKeys({
 *   "cmd+enter": () => submit(),
 *   "cmd+s": () => save(),
 * }, {
 *   enabled: isModalOpen,
 *   preventDefault: true,
 * });
 *
 * // Allow on form inputs
 * useHotKeys({
 *   "cmd+enter": () => submitForm(),
 * }, {
 *   enableOnFormTags: true,
 * });
 * ```
 */
export function useHotKeys(
  keyMap: HotKeyMap,
  options: UseHotKeysOptions = {},
): void {
  const {
    enabled = true,
    preventDefault = true,
    enableOnFormTags = false,
    scoped = true,
  } = options;

  // Store parsed keys to avoid re-parsing on every render
  const parsedKeysRef = useRef<Map<string, ParsedKey>>(new Map());

  // Parse all key combinations once
  useEffect(() => {
    const parsed = new Map<string, ParsedKey>();
    for (const combo of Object.keys(keyMap)) {
      parsed.set(combo, parseKeyCombo(combo));
    }
    parsedKeysRef.current = parsed;
  }, [keyMap]);

  useEffect(() => {
    if (!enabled || !scoped) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if target is form element
      const target = event.target as HTMLElement;
      const isFormInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isFormInput && !enableOnFormTags) {
        return;
      }

      // Check all registered key combinations
      for (const [combo, handler] of Object.entries(keyMap)) {
        const parsed = parsedKeysRef.current.get(combo);
        if (!parsed) continue;

        if (matchesKeyCombo(event, parsed)) {
          if (preventDefault) {
            event.preventDefault();
          }
          handler(event);
          break; // Only trigger first match
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, scoped, keyMap, preventDefault, enableOnFormTags]);
}

/**
 * Get platform-specific modifier key label
 *
 * @returns "⌘" on macOS, "Ctrl" on Windows/Linux
 *
 * @example
 * ```tsx
 * const mod = getModifierLabel();
 * console.log(`${mod}+K`); // "⌘+K" on Mac, "Ctrl+K" on Windows
 * ```
 */
export function getModifierLabel(): string {
  return isMac() ? "⌘" : "Ctrl";
}

/**
 * Format key combination for display
 *
 * @param combo - Key combination string (e.g., "cmd+k")
 * @returns Formatted string (e.g., "⌘K" on macOS, "Ctrl+K" on Windows)
 *
 * @example
 * ```tsx
 * formatKeyCombo("cmd+k");         // "⌘K" (macOS) or "Ctrl+K" (Windows)
 * formatKeyCombo("cmd+shift+p");   // "⌘⇧P" (macOS) or "Ctrl+Shift+P" (Windows)
 * formatKeyCombo("escape");        // "Esc"
 * ```
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
