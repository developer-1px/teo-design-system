import { useEffect, useState, useCallback } from 'react';
import { runDesignLint } from './core';
import type { Violation } from './core';

import * as styles from './DesignLinterOverlay.styles';

export function DesignLinterOverlay({ isEnabled = true }: { isEnabled?: boolean }) {
    const [violations, setViolations] = useState<Violation[]>([]);

    const checkDocs = useCallback(() => {
        if (!isEnabled) return;

        // We scan the entire body for now, but in a real app might scope to the #root
        const root = document.getElementById('root') || document.body;
        const results = runDesignLint({ root });

        // Log to console for debugging
        if (results.length > 0) {
            // Deduplicate log? Or just log "Design Lint violations detected"
            console.groupCollapsed(`🎨 Design Lint: ${results.length} Detection(s)`);
            results.forEach(v => {
                const label = v.type === 'INLINE_STYLE' ? '[Inline Style]' : '[No Spacing]';
                // Format: [Type] Message (File:Line)
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

        // Initial check
        let timeoutId: any = null;

        const runCheck = () => {
            // Basic debounce
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                checkDocs();
            }, 500); // 500ms debounce
        };

        runCheck();

        // Check on resize and scroll
        window.addEventListener('resize', runCheck);
        window.addEventListener('scroll', runCheck, { capture: true, passive: true });

        // Use MutationObserver instead of polling
        const observer = new MutationObserver(() => {
            // Ignore mutations to the overlay itself if possible (already ignored by data-attr in scan, but avoids trigger loop?)
            // We just debounce heavily.
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

    if (!isEnabled || violations.length === 0) return null;

    return (
        <div style={styles.overlayContainer} data-design-lint-ignore="true">
            {violations.map((v, i) => (
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

            {/* Status Indicator */}
            <div style={{
                position: 'fixed',
                bottom: 12,
                right: 12,
                background: '#ff0000',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                pointerEvents: 'auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
                Design Lint: {violations.length} Violations
            </div>
        </div>
    );
}
