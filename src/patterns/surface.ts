import type { StyleRule } from '../lib/style';

export const surface = {
    base: {
        backgroundColor: 'var(--surface-page)',
        color: 'var(--text-primary)',
    } satisfies StyleRule,

    panel: {
        backgroundColor: 'var(--surface-panel)',
        color: 'var(--text-body)',
        borderRight: '1px solid var(--border-color)',
    } satisfies StyleRule,

    card: {
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--elevation-n1)',
        borderRadius: 'var(--radius-n4)', // Assuming radius token exists or use 8px
    } satisfies StyleRule,

    overlay: {
        backgroundColor: 'var(--surface-overlay)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--elevation-n3)',
    } satisfies StyleRule,

    ghost: {
        backgroundColor: 'transparent',
    } satisfies StyleRule,
};
