

import { useHotKeys, type HotKeyMap } from "./useHotKeys";

export type CommandId = string;

export interface Command {
    id: CommandId;
    label?: string; // For UI/Palette
    shortcut?: string; // Default shortcut
    action: (args?: any) => void;
    enabled?: boolean;
}

export interface UseKeyboardCommandOptions {
    enabled?: boolean;
    scope?: string;
    preventDefault?: boolean;
}

/**
 * A hook to register commands that can be triggered by keyboard shortcuts.
 * This abstracts "keys" into "commands" for better separation of concerns.
 */
export function useKeyboardCommand(
    commands: Command[],
    options: UseKeyboardCommandOptions = {}
) {
    const { enabled = true, preventDefault = true } = options;

    const keyMap: HotKeyMap = {};

    commands.forEach(cmd => {
        if (cmd.shortcut && (cmd.enabled !== false)) {
            keyMap[cmd.shortcut] = (e) => {
                if (preventDefault) e.preventDefault();
                cmd.action();
            };
        }
    });

    useHotKeys(keyMap, {
        enabled,
        preventDefault // already handled in wrapper but good fallback
    });

    // We can return a map of commands to be used in a Command Palette UI
    return {
        commands
    };
}
