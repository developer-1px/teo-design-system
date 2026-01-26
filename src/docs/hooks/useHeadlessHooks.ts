
import { useMemo, useState, useEffect } from 'react';
import { parseHookSource, type ParsedHook } from './parseHookSource';

export function useHeadlessHooks() {
    const [hooks, setHooks] = useState<ParsedHook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHooks() {
            // 1. Glob all hook files as raw strings
            const modules = import.meta.glob('/src/design-system/hooks/**/*.ts', {
                query: '?raw',
                eager: true,
                import: 'default'
            });

            const parsed: ParsedHook[] = [];

            for (const path in modules) {
                // Skip index.ts or library files
                if (path.endsWith('index.ts') || path.includes('/lib/')) continue;

                const rawSource = modules[path] as unknown as string;
                parsed.push(parseHookSource(rawSource, path));
            }

            setHooks(parsed.sort((a, b) => a.name.localeCompare(b.name)));
            setLoading(false);
        }

        loadHooks();
    }, []);

    const groupedHooks = useMemo(() => {
        const groups: Record<string, ParsedHook[]> = {};
        hooks.forEach(hook => {
            if (!groups[hook.category]) {
                groups[hook.category] = [];
            }
            groups[hook.category].push(hook);
        });
        return groups;
    }, [hooks]);

    return { hooks, groupedHooks, loading };
}
