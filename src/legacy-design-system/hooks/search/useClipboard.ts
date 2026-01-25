import { useCallback, useEffect, useState } from "react";

/**
 * Clipboard hook options
 */
export interface UseClipboardOptions {
    /** Reset copied state after timeout (ms) */
    timeout?: number;
}

/**
 * Clipboard hook return value
 */
export interface UseClipboardReturn {
    /** Copy text to clipboard */
    copy: (text: string) => Promise<boolean>;
    /** Read text from clipboard */
    read: () => Promise<string | null>;
    /** Last copied/read text */
    text: string | null;
    /** Whether text was recently copied */
    hasCopied: boolean;
    /** Whether clipboard API is supported */
    isSupported: boolean;
}

/**
 * Clipboard management hook
 *
 * Provides headless clipboard interactions with fallback support.
 *
 * Features:
 * - Copy text to clipboard
 * - Read text from clipboard
 * - "Copied" state with timeout
 * - Browser support detection
 *
 * @param options - Configuration options
 * @returns Clipboard utilities
 */
export function useClipboard({
    timeout = 2000,
}: UseClipboardOptions = {}): UseClipboardReturn {
    const [text, setText] = useState<string | null>(null);
    const [hasCopied, setHasCopied] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported(
            typeof navigator !== "undefined" && "clipboard" in navigator
        );
    }, []);

    /**
     * Reset processed state after timeout
     */
    useEffect(() => {
        let timer: number;
        if (hasCopied && timeout) {
            timer = window.setTimeout(() => {
                setHasCopied(false);
            }, timeout);
        }
        return () => {
            if (timer) window.clearTimeout(timer);
        };
    }, [hasCopied, timeout]);

    /**
     * Copy text to clipboard
     */
    const copy = useCallback(
        async (value: string): Promise<boolean> => {
            if (!isSupported) {
                // Fallback for older browsers
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = value;

                    // Ensure it's not visible but part of DOM
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    textArea.style.top = "0";

                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();

                    const success = document.execCommand("copy");
                    document.body.removeChild(textArea);

                    if (success) {
                        setText(value);
                        setHasCopied(true);
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.warn("Copy failed", error);
                    return false;
                }
            }

            try {
                await navigator.clipboard.writeText(value);
                setText(value);
                setHasCopied(true);
                return true;
            } catch (error) {
                console.warn("Copy failed", error);
                setText(null);
                setHasCopied(false);
                return false;
            }
        },
        [isSupported]
    );

    /**
     * Read text from clipboard
     */
    const read = useCallback(async (): Promise<string | null> => {
        if (!isSupported) return null;

        try {
            const value = await navigator.clipboard.readText();
            setText(value);
            return value;
        } catch (error) {
            console.warn("Read failed", error);
            return null;
        }
    }, [isSupported]);

    return {
        copy,
        read,
        text,
        hasCopied,
        isSupported,
    };
}
