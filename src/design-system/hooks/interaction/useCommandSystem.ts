import { useMemo, useEffect } from "react";
import { CommandManager, type KeyBinding, type CommandHandler } from "../lib/CommandManager";

// Type re-exports for consumer convenience
export type { KeyBinding, CommandHandler };
export type CommandRegistry = Record<string, CommandHandler>;
export type Context = Record<string, any>;

export interface UseCommandSystemOptions {
    enabled?: boolean;
    preventDefault?: boolean;
}

/**
 * Enhanced Command System Hook (VS Code Style) - React Adapter
 * 
 * Adapts the headless `CommandManager` for React components.
 * 
 * Separates:
 * 1. Keybindings (JSON Serializable)
 * 2. Logic (Command Registry)
 * 3. State (Context)
 */
export function useCommandSystem(
    keybindings: KeyBinding[],
    registry: CommandRegistry,
    context: Context = {},
    options: UseCommandSystemOptions = {}
) {
    const { enabled = true, preventDefault = true } = options;

    // 1. Stable Manager Instance
    const manager = useMemo(() => new CommandManager(), []);

    // 2. Sync Logic (Registry & Keybindings)
    // We assume these change infrequently, but we sync them if they do.
    useEffect(() => {
        manager.setRegistry(registry);
    }, [registry, manager]);

    useEffect(() => {
        manager.setKeybindings(keybindings);
    }, [keybindings, manager]);

    // 3. Sync State (Context)
    // Use a ref to prevent effect-loop if context object identity changes often
    // But we actually need to update manager immediately for render phase or next event?
    // Events usually happen after render, so useEffect sync is fine.
    useEffect(() => {
        manager.setContext(context);
    }, [context, manager]);

    // 4. Event Adapter
    const onKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
        if (!enabled) return;

        // Pass to manager
        const handled = manager.handleKey(e);

        if (handled && preventDefault) {
            e.preventDefault();
        }
    };

    return {
        onKeyDown,
        commandManager: manager
    };
}
