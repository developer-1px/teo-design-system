import { useEffect, useState, useCallback } from 'react';
import { runDesignLint } from '../core';
import type { Violation } from '../core';

import * as styles from './DesignLinterOverlay.styles';

export function DesignLinterOverlay({ isEnabled = true }: { isEnabled?: boolean }) {
    const [violations, setViolations] = useState<Violation[]>([]);
    const [showOverlay, setShowOverlay] = useState(true);

    const checkDocs = useCallback(() => {
        if (!isEnabled) return;

        const root = document.getElementById('root') || document.body;
        const results = runDesignLint({ root });

        // Expose to window for AI Agent Verification
        // @ts-ignore
        window.__DESIGN_LINT_VIOLATIONS__ = results;

        // Log to console for debugging
        if (results.length > 0) {
            console.groupCollapsed(`🎨 Design Lint: ${results.length} Detection(s)`);
            results.forEach(v => {
                const label = v.type === 'INLINE_STYLE' ? '[Inline Style]' : '[No Spacing]';
                console.info(`${label} ${v.message}`, v.source ? `\n📍 ${v.source}` : '', v.element);
            });
            console.groupEnd();
        }

        setViolations(results);
    }, [isEnabled]);


    useEffect(() => {
        if (!isEnabled) {
            setViolations([]);
            return;
        }

        let timeoutId: any = null;

        const runCheck = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                checkDocs();
            }, 500);
        };

        runCheck();

        window.addEventListener('resize', runCheck);
        window.addEventListener('scroll', runCheck, { capture: true, passive: true });

        const observer = new MutationObserver(() => {
            runCheck();
        });

        const root = document.getElementById('root') || document.body;
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

        return () => {
            window.removeEventListener('resize', runCheck);
            window.removeEventListener('scroll', runCheck, true);
            observer.disconnect();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isEnabled, checkDocs]);

    if (!isEnabled) return null;

    return (
        <div style={styles.overlayContainer} data-design-lint-ignore="true">
            {showOverlay && violations.map((v, i) => (
                <div
                    key={i}
                    style={{
                        ...styles.violationBox,
                        left: v.rect.left + window.scrollX,
                        top: v.rect.top + window.scrollY,
                        width: v.rect.width,
                        height: v.rect.height,
                    }}
                >
                    <div style={styles.violationLabel}>
                        {v.type === 'INLINE_STYLE' ? 'Inline Style' : 'No Spacing / Margin'}
                    </div>
                </div>
            ))}

            {/* Status Panel / Debug Controls */}
            <div style={styles.statusPanel}>
                <div style={{ fontWeight: 'bold', color: violations.length > 0 ? '#ef4444' : '#22c55e' }}>
                    {violations.length} Violations
                </div>
                <div style={{ width: '1px', height: '16px', background: '#3f3f46' }} />
                <label style={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={showOverlay}
                        onChange={(e) => setShowOverlay(e.target.checked)}
                        style={styles.checkboxInput}
                    />
                    Lint Overlay
                </label>
            </div>
        </div>
    );
}
