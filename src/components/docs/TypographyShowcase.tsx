import { useState } from 'react';
import * as styles from './TypographyShowcase.css';
import { vars } from '../../styles/vars.css';

// TODO: Fix live import. using static string for now to unblock build.
// There is a conflict between vanilla-extract plugin and vite raw loader for .css.ts files.
const varsSource = `import { createThemeContract, createTheme } from '@vanilla-extract/css';

// 1. Define the shape of our theme (Contract)
export const vars = createThemeContract({
    font: {
        body: null,
        code: null,
    },
    fontSize: {
        xs: null,
        sm: null,
        md: null,
        lg: null,
        xl: null,
        xxl: null,
    },
    weight: {
        regular: null,
        medium: null,
        bold: null,
    },
    lineHeight: {
        tight: null,
        standard: null,
    },
    // ... (rest of the file content omitted for brevity in variables, but effectively represented)
    // Actually pasting the typography section which is what matters for this showcase
});

const typography = {
    fontSize: {
        xs: '11px',
        sm: '12px',
        md: '13px',
        lg: '14px',
        xl: '16px',
        xxl: '22px',
    },
    weight: {
        regular: '400',
        medium: '500',
        bold: '700',
    },
    lineHeight: {
        tight: '1.25',
        standard: '1.5',
    }
};`;

export function TypographyShowcase() {
    const [showCode, setShowCode] = useState(false);

    // Extract typography section from source for cleaner display
    const extractTypoCode = (source: string) => {
        if (!source) return '// Source not found';
        const start = source.indexOf('const typography = {');
        const end = source.indexOf('};', start) + 2;
        if (start === -1) return source; // Return full source if regex fails, or just the part we pasted
        return source.substring(start, end);
    };

    const typoCode = extractTypoCode(varsSource);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Typography System</h2>
                <button
                    className={styles.toggleButton}
                    onClick={() => setShowCode(!showCode)}
                >
                    {showCode ? 'Hide Code' : 'Show Source Code'}
                </button>
            </div>

            {showCode && (
                <div className={styles.codeBlock}>
                    <pre><code>{typoCode}</code></pre>
                </div>
            )}

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Font Size</h3>
                <div className={styles.grid}>
                    {Object.entries(vars.fontSize).map(([key, value]) => (
                        <div key={key} className={styles.row}>
                            <div className={styles.meta}>
                                <span className={styles.tokenName}>fontSize.{key}</span>
                                <span className={styles.tokenValue}>{value}</span>
                            </div>
                            <div
                                className={styles.preview}
                                style={{ fontSize: value }}
                            >
                                The quick brown fox jumps over the lazy dog.
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Font Weight</h3>
                <div className={styles.grid}>
                    {Object.entries(vars.weight).map(([key, value]) => (
                        <div key={key} className={styles.row}>
                            <div className={styles.meta}>
                                <span className={styles.tokenName}>weight.{key}</span>
                                <span className={styles.tokenValue}>{value}</span>
                            </div>
                            <div
                                className={styles.preview}
                                style={{ fontWeight: value }}
                            >
                                The quick brown fox jumps over the lazy dog.
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Line Height</h3>
                <div className={styles.grid}>
                    {Object.entries(vars.lineHeight).map(([key, value]) => (
                        <div key={key} className={styles.row}>
                            <div className={styles.meta}>
                                <span className={styles.tokenName}>lineHeight.{key}</span>
                                <span className={styles.tokenValue}>{value}</span>
                            </div>
                            <div className={styles.lhWrapper}>
                                <div
                                    className={styles.preview}
                                    style={{ lineHeight: value, border: '1px solid #eee' }}
                                >
                                    Multi-line text to demonstrate line height. The quick brown fox jumps over the lazy dog.
                                    The quick brown fox jumps over the lazy dog.
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
