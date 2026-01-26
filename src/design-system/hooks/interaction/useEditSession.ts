import { useState, useCallback } from "react";

export interface EditSessionOptions {
    onCommit?: (value: any, meta?: any) => void;
    onCancel?: () => void;
}

export function useEditSession<T = any, M = any>(options: EditSessionOptions = {}) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState<T | undefined>(undefined);
    const [meta, setMeta] = useState<M | undefined>(undefined);

    const start = useCallback((initialValue: T, metadata?: M) => {
        setIsEditing(true);
        setValue(initialValue);
        setMeta(metadata);
    }, []);

    const change = useCallback((newValue: T) => {
        setValue(newValue);
    }, []);

    const commit = useCallback(() => {
        if (!isEditing) return;
        setIsEditing(false);
        options.onCommit?.(value, meta);
        return value;
    }, [isEditing, value, meta, options.onCommit]);

    const cancel = useCallback(() => {
        if (!isEditing) return;
        setIsEditing(false);
        options.onCancel?.();
        // Reset?
    }, [isEditing, options.onCancel]);

    return {
        isEditing,
        value,
        meta,
        start,
        change,
        commit,
        cancel
    };
}
