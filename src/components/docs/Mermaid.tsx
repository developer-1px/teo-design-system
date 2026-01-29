import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../../contexts/ThemeContext';

export function Mermaid({ chart }: { chart: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, sans-serif',
            themeVariables: {
                primaryColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
                lineColor: theme === 'dark' ? '#94a3b8' : '#64748b',
            }
        });

        const renderChart = async () => {
            if (containerRef.current) {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    // Render returns an object with svg string
                    const { svg } = await mermaid.render(id, chart);
                    if (containerRef.current) {
                        containerRef.current.innerHTML = svg;
                    }
                } catch (error) {
                    console.error('Mermaid render error:', error);
                    if (containerRef.current) {
                        containerRef.current.innerHTML = `<pre style="color: red; padding: 1rem; background: #fee2e2; border-radius: 4px;">Mermaid Error: ${(error as Error).message}</pre>`;
                    }
                }
            }
        };

        renderChart();
    }, [chart, theme]);

    return (
        <div
            ref={containerRef}
            className="mermaid-diagram"
            style={{
                margin: '2rem 0',
                display: 'flex',
                justifyContent: 'center',
                background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                padding: '2rem',
                borderRadius: '8px',
                overflowX: 'auto'
            }}
        />
    );
}
