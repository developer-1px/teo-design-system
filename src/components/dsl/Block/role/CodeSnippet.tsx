import { BlockRendererProps } from '@/components/dsl/Block/Block.types';
import { Text } from '@/components/dsl/Element/Text/Text';
import { cn } from '@/shared/lib/utils';
import { Settings } from 'lucide-react';
import React from 'react';

/**
 * Block Renderer: CodeSnippet
 * Displays a code snippet in a styled card-like container.
 * Typically used for documentation or technical examples.
 */
export function CodeSnippet({
    children,
    className,
    spec,
    tokens,
    ...rest
}: BlockRendererProps) {
    // Extract content from spec or use defaults
    const codeLines = spec?.lines || [
        { text: '// Example Code', className: 'text-text-subtle' }
    ];

    return (
        <div
            className={cn(
                'font-mono text-xs p-4 bg-surface-base border border-border rounded-lg',
                'overflow-x-auto', // Ensure it handles long lines gracefully
                tokens.shadow.boxShadow,
                className
            )}
            {...rest}
        >
            <div className="flex flex-col gap-1 text-text-muted">
                {codeLines.map((line: any, index: number) => (
                    <div key={index} className={line.className || ''}>
                        {line.text}
                    </div>
                ))}
            </div>
            {children}
        </div>
    );
}
