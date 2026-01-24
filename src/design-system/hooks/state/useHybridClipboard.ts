import { useCallback, useState, useRef } from "react";

/**
 * Clipboard item with rich data
 */
export interface ClipboardItem<T = any> {
    /** Type identifier (e.g., 'text', 'object', 'list-item') */
    type: string;
    /** Rich data (can be any object) */
    data: T;
    /** Plain text representation (for system clipboard) */
    text: string;
    /** Optional metadata */
    metadata?: Record<string, any>;
    /** Timestamp */
    timestamp: number;
}

/**
 * Serializer for converting data to/from text
 */
export interface ClipboardSerializer<T = any> {
    /** Convert data to text */
    serialize: (data: T) => string;
    /** Convert text to data */
    deserialize: (text: string) => T | null;
}

/**
 * Options for useHybridClipboard
 */
export interface UseHybridClipboardOptions {
    /** Custom serializers for specific types */
    serializers?: Record<string, ClipboardSerializer>;
    /** Whether to sync with system clipboard (default: true) */
    useSystemClipboard?: boolean;
}

/**
 * Return value from useHybridClipboard
 */
export interface UseHybridClipboardReturn {
    /** Current clipboard content (internal rich data) */
    content: ClipboardItem | null;
    /** Copy data to clipboard */
    copy: <T = any>(type: string, data: T, text?: string, metadata?: Record<string, any>) => Promise<boolean>;
    /** Paste data from clipboard */
    paste: () => Promise<ClipboardItem | null>;
    /** Read system clipboard text */
    readSystemClipboard: () => Promise<string | null>;
    /** Clear clipboard */
    clear: () => void;
    /** Whether clipboard has content */
    hasContent: boolean;
    /** Whether system clipboard is supported */
    isSupported: boolean;
}

/**
 * Default JSON serializer
 */
const jsonSerializer: ClipboardSerializer = {
    serialize: (data) => {
        try {
            return JSON.stringify(data);
        } catch {
            return String(data);
        }
    },
    deserialize: (text) => {
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    },
};

/**
 * Hybrid Clipboard Hook
 *
 * Provides a clipboard that works with both system clipboard (text/html) and
 * internal rich data (objects, metadata, formatting).
 *
 * Features:
 * - **System Clipboard**: Syncs with OS clipboard via navigator.clipboard API
 * - **Internal Rich Data**: Stores complex objects with metadata
 * - **Type Safety**: Each clipboard item has a type identifier
 * - **Serialization**: Automatic conversion between rich data and text
 * - **Fallback**: If rich data paste fails, falls back to system clipboard text
 *
 * Use Cases:
 * - Copy/paste complex objects (canvas shapes, table cells, etc.)
 * - Maintain formatting and metadata during copy/paste
 * - Support external app compatibility via text serialization
 *
 * @example
 * ```tsx
 * const clipboard = useHybridClipboard();
 *
 * // Copy rich data
 * await clipboard.copy('shape', { type: 'rect', x: 10, y: 20, w: 100, h: 50 });
 *
 * // Paste (gets rich data if available, otherwise system clipboard)
 * const item = await clipboard.paste();
 * if (item && item.type === 'shape') {
 *   console.log('Pasted shape:', item.data);
 * }
 * ```
 */
export function useHybridClipboard({
    serializers = {},
    useSystemClipboard = true,
}: UseHybridClipboardOptions = {}): UseHybridClipboardReturn {
    const [content, setContent] = useState<ClipboardItem | null>(null);
    const [isSupported, setIsSupported] = useState(false);
    const serializersRef = useRef({ ...serializers });

    // Check clipboard API support
    useState(() => {
        const supported = typeof navigator !== "undefined" && "clipboard" in navigator;
        setIsSupported(supported);
    });

    /**
     * Get serializer for a type
     */
    const getSerializer = useCallback((type: string): ClipboardSerializer => {
        return serializersRef.current[type] || jsonSerializer;
    }, []);

    /**
     * Write to system clipboard
     */
    const writeSystemClipboard = useCallback(
        async (text: string): Promise<boolean> => {
            if (!useSystemClipboard || !isSupported) return false;

            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                console.warn("Failed to write to system clipboard", error);
                return false;
            }
        },
        [useSystemClipboard, isSupported]
    );

    /**
     * Read from system clipboard
     */
    const readSystemClipboard = useCallback(async (): Promise<string | null> => {
        if (!isSupported) return null;

        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (error) {
            console.warn("Failed to read from system clipboard", error);
            return null;
        }
    }, [isSupported]);

    /**
     * Copy data to clipboard (both internal and system)
     */
    const copy = useCallback(
        async <T = any>(
            type: string,
            data: T,
            text?: string,
            metadata?: Record<string, any>
        ): Promise<boolean> => {
            // Generate text representation if not provided
            let textRepresentation = text;
            if (!textRepresentation) {
                const serializer = getSerializer(type);
                textRepresentation = serializer.serialize(data);
            }

            // Create clipboard item
            const item: ClipboardItem = {
                type,
                data,
                text: textRepresentation,
                metadata,
                timestamp: Date.now(),
            };

            // Store internally
            setContent(item);

            // Write to system clipboard
            if (useSystemClipboard) {
                await writeSystemClipboard(textRepresentation);
            }

            return true;
        },
        [getSerializer, writeSystemClipboard, useSystemClipboard]
    );

    /**
     * Paste data from clipboard
     * Returns internal rich data if available, otherwise attempts to deserialize system clipboard
     */
    const paste = useCallback(async (): Promise<ClipboardItem | null> => {
        // First, try to use internal clipboard (has rich data)
        if (content) {
            return content;
        }

        // Fallback: read from system clipboard and attempt to deserialize
        if (useSystemClipboard) {
            const text = await readSystemClipboard();
            if (text) {
                // Try to deserialize as JSON first
                const deserialized = jsonSerializer.deserialize(text);
                if (deserialized && typeof deserialized === "object" && deserialized.type) {
                    // It's a clipboard item
                    return deserialized as ClipboardItem;
                }

                // Otherwise, treat as plain text
                return {
                    type: "text",
                    data: text,
                    text,
                    timestamp: Date.now(),
                };
            }
        }

        return null;
    }, [content, useSystemClipboard, readSystemClipboard]);

    /**
     * Clear clipboard
     */
    const clear = useCallback(() => {
        setContent(null);
    }, []);

    return {
        content,
        copy,
        paste,
        readSystemClipboard,
        clear,
        hasContent: content !== null,
        isSupported,
    };
}
