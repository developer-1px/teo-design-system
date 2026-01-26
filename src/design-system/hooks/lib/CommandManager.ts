import { type ParsedKey, parseKeyCombo, matchesKeyCombo } from "./keyUtils";

export interface KeyBinding<T extends string = string> {
    key: string;
    command: T;
    when?: string;
    args?: any;
}

export type CommandHandler = (args?: any) => void;

/**
 * Headless Command Manager
 * 
 * Manages commands, keybindings, and context evaluation in a framework-agnostic way.
 */
export class CommandManager<T extends string = string> {
    private registry: Record<string, CommandHandler> = {};
    private keybindings: KeyBinding<T>[] = [];
    private context: Record<string, any> = {};
    private parsedKeys: Map<string, ParsedKey> = new Map();

    constructor() {
        // Initialize if needed
    }

    /**
     * Register multiple commands
     */
    setRegistry(registry: Record<T, CommandHandler>) {
        this.registry = registry;
    }

    /**
     * Update keybindings and cache parsed keys
     */
    setKeybindings(bindings: KeyBinding<T>[]) {
        this.keybindings = bindings;
        this.parsedKeys.clear();

        // Cache parsed keys
        bindings.forEach(kb => {
            if (!this.parsedKeys.has(kb.key)) {
                this.parsedKeys.set(kb.key, parseKeyCombo(kb.key));
            }
        });
    }

    /**
     * Update context for 'when' clause evaluation
     */
    setContext(context: Record<string, any>) {
        this.context = context;
    }

    /**
     * Execute a command by ID
     */
    executeCommand(commandId: T | "type", args?: any) {
        const handler = this.registry[commandId];
        if (handler) {
            handler(args);
            return true;
        }
        return false;
    }

    /**
     * Handle a key event (keydown)
     * Returns true if a command was executed
     */
    handleKey(event: KeyboardEvent | React.KeyboardEvent): boolean {
        // 1. Find matching keybindings
        const matchingBindings = this.keybindings.filter(kb => {
            const parsed = this.parsedKeys.get(kb.key);
            if (!parsed) return false;
            return matchesKeyCombo(event, parsed);
        });

        if (matchingBindings.length === 0) {
            return this.handleTyping(event);
        }

        // 2. Evaluate 'when' clauses to find the active binding
        const activeBinding = matchingBindings.find(kb => this.evaluateWhen(kb.when));

        if (activeBinding) {
            // Found a valid command
            this.executeCommand(activeBinding.command, activeBinding.args);
            return true;
        }

        return this.handleTyping(event);
    }

    private handleTyping(event: KeyboardEvent | React.KeyboardEvent): boolean {
        // Fallback: Check for "type" command for simple character input
        // @ts-ignore
        const isModifier = event.ctrlKey || event.metaKey || event.altKey;
        if (!isModifier && event.key.length === 1) {
            return this.executeCommand("type", { key: event.key });
        }
        return false;
    }

    private evaluateWhen(when: string | undefined): boolean {
        if (!when) return true;
        if (when.startsWith("!")) return !this.context[when.slice(1)];

        if (when.includes("==")) {
            const [k, v] = when.split("==").map(s => s.trim());
            return String(this.context[k]) === v.replace(/['"]/g, "");
        }
        if (when.includes("!=")) {
            const [k, v] = when.split("!=").map(s => s.trim());
            return String(this.context[k]) !== v.replace(/['"]/g, "");
        }

        return !!this.context[when];
    }
}
