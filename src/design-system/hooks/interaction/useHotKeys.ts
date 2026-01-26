import { useEffect, useRef, useCallback } from "react";
import {
  parseKeyCombo,
  matchesKeyCombo,
  getModifierLabel as getModLabel,
  formatKeyCombo as fmtKeyCombo,
  type ParsedKey
} from "../lib/keyUtils";

/**
 * Hot key handler function
 */
export type HotKeyHandler = (event: KeyboardEvent) => void;

/**
 * Hot key map: key combination → handler
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

export interface UseHotKeysReturn {
  onKeyDown: (event: React.KeyboardEvent | KeyboardEvent) => void;
}

/**
 * Global hot keys hook
 *
 * Registers global keyboard shortcuts with declarative API.
 * 
 * Now uses shared `keyUtils` for parsing logic.
 */
export function useHotKeys(
  keyMap: HotKeyMap,
  options: UseHotKeysOptions = {},
): UseHotKeysReturn {
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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      if (!enabled) return;

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

        // @ts-ignore - Compatible interface between React/Native events for our usage
        if (matchesKeyCombo(event, parsed)) {
          if (preventDefault) {
            event.preventDefault();
          }
          // @ts-ignore
          handler(event);
          break; // Only trigger first match
        }
      }
    },
    [enabled, enableOnFormTags, keyMap, preventDefault]
  );

  useEffect(() => {
    if (!scoped) return;

    // Legacy behavior: attach to window if 'scoped' (now interpreted as "global listener active") is true
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scoped, handleKeyDown]);

  return { onKeyDown: handleKeyDown };
}

/**
 * Re-export utilities for backward compatibility
 */
export function getModifierLabel(): string {
  return getModLabel();
}

export function formatKeyCombo(combo: string): string {
  return fmtKeyCombo(combo);
}
