import { useRef, useEffect, useCallback } from "react";

export interface UseEditorInputOptions {
    value?: any;
    onCommit: (val: any) => void;
    onCancel: () => void;
    autoFocus?: boolean;
    selectAllOnFocus?: boolean; // Optional future-proofing
}

export function useEditorInput<T extends HTMLInputElement | HTMLTextAreaElement>({
    onCommit,
    onCancel,
    autoFocus = false,
    selectAllOnFocus = false
}: UseEditorInputOptions) {
    const ref = useRef<T>(null);
    const isCanceling = useRef(false);

    useEffect(() => {
        if (autoFocus && ref.current) {
            ref.current.focus();
            if (selectAllOnFocus) {
                ref.current.select();
            } else {
                // Default: Cursor at end
                const len = ref.current.value.length;
                ref.current.setSelectionRange(len, len);
            }
        }
    }, [autoFocus, selectAllOnFocus]);

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Stop propagation to prevent parent handlers (like Table navigation)
        // from interfering with Input editing.
        e.stopPropagation();

        if (e.key === "Enter") {
            e.preventDefault();
            onCommit(ref.current?.value);
        } else if ((e.metaKey || e.ctrlKey) && e.key === "a") {
            e.preventDefault();
            ref.current?.select();
        } else if (e.key === "Escape") {
            e.preventDefault();
            isCanceling.current = true;
            onCancel();
        }
    }, [onCommit, onCancel]);

    const onBlur = useCallback(() => {
        if (!isCanceling.current) {
            onCommit(ref.current?.value);
        }
    }, [onCommit]);

    return {
        ref,
        inputProps: {
            ref,
            onKeyDown,
            onBlur
        }
    };
}
