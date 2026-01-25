import { useMemo } from "react";
import { useCommandSystem, type CommandRegistry } from "./useCommandSystem";
import { OSCommand } from "./commands";
import type { KeyBinding } from "../lib/CommandManager";

/**
 * OS Shortcut handlers
 */
export interface OSShortcutHandlers {
    /** Copy (Cmd+C / Ctrl+C) */
    onCopy?: () => void;
    /** Paste (Cmd+V / Ctrl+V) */
    onPaste?: () => void;
    /** Cut (Cmd+X / Ctrl+X) */
    onCut?: () => void;
    /** Undo (Cmd+Z / Ctrl+Z) */
    onUndo?: () => void;
    /** Redo (Cmd+Shift+Z / Ctrl+Shift+Z) */
    onRedo?: () => void;
    /** Select All (Cmd+A / Ctrl+A) */
    onSelectAll?: () => void;
    /** Delete (Delete / Backspace) */
    onDelete?: () => void;
    /** Escape (Escape) */
    onEscape?: () => void;
    /** Move Up (Arrow Up) */
    onMoveUp?: () => void;
    /** Move Down (Arrow Down) */
    onMoveDown?: () => void;
    /** Move Left (Arrow Left) */
    onMoveLeft?: () => void;
    /** Move Right (Arrow Right) */
    onMoveRight?: () => void;
}

/**
 * Options for useOSShortcuts
 */
export interface UseOSShortcutsOptions extends OSShortcutHandlers {
    /** Enable/disable all shortcuts (default: true) */
    enabled?: boolean;
    /** Prevent default browser behavior (default: true) */
    preventDefault?: boolean;
    /** Context for conditional keybindings */
    context?: Record<string, any>;
}

/**
 * Return value from useOSShortcuts
 */
export interface UseOSShortcutsReturn {
    /** Keyboard event handler (attach to container) */
    onKeyDown: (e: React.KeyboardEvent | KeyboardEvent) => void;
}

/**
 * OS Shortcuts Hook
 *
 * Provides standard OS keyboard shortcuts (Copy/Paste/Undo/Redo/etc) in a cross-platform way.
 * Built on top of `useCommandSystem` for consistency with other keyboard commands.
 *
 * Features:
 * - **Cross-platform**: Automatically uses Cmd on Mac, Ctrl on Windows/Linux
 * - **Standard shortcuts**: Copy, Paste, Cut, Undo, Redo, Select All, Delete, Escape
 * - **Arrow keys**: Movement shortcuts (Up, Down, Left, Right)
 * - **Context-aware**: Can disable shortcuts in certain contexts (e.g., when editing text)
 *
 * Use Cases:
 * - Canvas editors (copy/paste shapes)
 * - List interfaces (keyboard navigation)
 * - Form builders (undo/redo changes)
 * - Any interface that needs OS-like keyboard behavior
 *
 * @example
 * ```tsx
 * const shortcuts = useOSShortcuts({
 *   onCopy: () => copySelection(),
 *   onPaste: () => pasteFromClipboard(),
 *   onUndo: () => history.undo(),
 *   onRedo: () => history.redo(),
 *   onDelete: () => deleteSelection(),
 * });
 *
 * return <div onKeyDown={shortcuts.onKeyDown}>...</div>;
 * ```
 */
export function useOSShortcuts({
    onCopy,
    onPaste,
    onCut,
    onUndo,
    onRedo,
    onSelectAll,
    onDelete,
    onEscape,
    onMoveUp,
    onMoveDown,
    onMoveLeft,
    onMoveRight,
    enabled = true,
    preventDefault = true,
    context = {},
}: UseOSShortcutsOptions = {}): UseOSShortcutsReturn {
    /**
     * Keybindings for OS shortcuts
     */
    const keybindings: KeyBinding<typeof OSCommand[keyof typeof OSCommand]>[] = useMemo(() => {
        const bindings: KeyBinding<typeof OSCommand[keyof typeof OSCommand]>[] = [];

        if (onCopy) {
            bindings.push({ key: "cmd+c", command: OSCommand.Copy });
            bindings.push({ key: "ctrl+c", command: OSCommand.Copy });
        }

        if (onPaste) {
            bindings.push({ key: "cmd+v", command: OSCommand.Paste });
            bindings.push({ key: "ctrl+v", command: OSCommand.Paste });
        }

        if (onCut) {
            bindings.push({ key: "cmd+x", command: OSCommand.Cut });
            bindings.push({ key: "ctrl+x", command: OSCommand.Cut });
        }

        if (onUndo) {
            bindings.push({ key: "cmd+z", command: OSCommand.Undo });
            bindings.push({ key: "ctrl+z", command: OSCommand.Undo });
        }

        if (onRedo) {
            bindings.push({ key: "cmd+shift+z", command: OSCommand.Redo });
            bindings.push({ key: "ctrl+shift+z", command: OSCommand.Redo });
            bindings.push({ key: "cmd+y", command: OSCommand.Redo });
            bindings.push({ key: "ctrl+y", command: OSCommand.Redo });
        }

        if (onSelectAll) {
            bindings.push({ key: "cmd+a", command: OSCommand.SelectAll });
            bindings.push({ key: "ctrl+a", command: OSCommand.SelectAll });
        }

        if (onDelete) {
            bindings.push({ key: "delete", command: OSCommand.Delete });
            bindings.push({ key: "backspace", command: OSCommand.Delete });
        }

        if (onEscape) {
            bindings.push({ key: "escape", command: OSCommand.Escape });
        }

        if (onMoveUp) {
            bindings.push({ key: "arrowup", command: OSCommand.MoveUp });
        }

        if (onMoveDown) {
            bindings.push({ key: "arrowdown", command: OSCommand.MoveDown });
        }

        if (onMoveLeft) {
            bindings.push({ key: "arrowleft", command: OSCommand.MoveLeft });
        }

        if (onMoveRight) {
            bindings.push({ key: "arrowright", command: OSCommand.MoveRight });
        }

        return bindings;
    }, [
        onCopy,
        onPaste,
        onCut,
        onUndo,
        onRedo,
        onSelectAll,
        onDelete,
        onEscape,
        onMoveUp,
        onMoveDown,
        onMoveLeft,
        onMoveRight,
    ]);

    /**
     * Command registry
     */
    const registry: CommandRegistry<typeof OSCommand[keyof typeof OSCommand]> = useMemo(
        () => ({
            [OSCommand.Copy]: () => onCopy?.(),
            [OSCommand.Paste]: () => onPaste?.(),
            [OSCommand.Cut]: () => onCut?.(),
            [OSCommand.Undo]: () => onUndo?.(),
            [OSCommand.Redo]: () => onRedo?.(),
            [OSCommand.SelectAll]: () => onSelectAll?.(),
            [OSCommand.Delete]: () => onDelete?.(),
            [OSCommand.Escape]: () => onEscape?.(),
            [OSCommand.MoveUp]: () => onMoveUp?.(),
            [OSCommand.MoveDown]: () => onMoveDown?.(),
            [OSCommand.MoveLeft]: () => onMoveLeft?.(),
            [OSCommand.MoveRight]: () => onMoveRight?.(),
        }),
        [
            onCopy,
            onPaste,
            onCut,
            onUndo,
            onRedo,
            onSelectAll,
            onDelete,
            onEscape,
            onMoveUp,
            onMoveDown,
            onMoveLeft,
            onMoveRight,
        ]
    );

    /**
     * Use command system
     */
    const { onKeyDown } = useCommandSystem(keybindings, registry, context, {
        enabled,
        preventDefault,
    });

    return {
        onKeyDown,
    };
}
