import { BlockRendererProps } from '@/components/dsl/Block/Block.types';
import { Text } from '@/components/dsl/Element/Text/Text';
import { cn } from '@/shared/lib/utils';
import { Settings } from 'lucide-react';
import React from 'react';
import { Block } from '@/components/dsl/Block/Block';

/**
 * Block Renderer: FeatureGrid
 * Diplays an asymmetrical 2-column grid for featuring content.
 * Left: Visual/Icon placeholder
 * Right: Content (Heading, Body, Children)
 * 
 * Spec:
 * - icon: Lucide Icon component
 * - title: string
 * - description: string
 * - label: string (for the visual box)
 */
export function FeatureGrid({
    children,
    className,
    spec,
    tokens,
    ...rest
}: BlockRendererProps) {
    const Icon = spec?.icon || Settings;
    const label = spec?.label || 'Feature';

    return (
        <div
            className={cn(
                'grid grid-cols-1 md:grid-cols-5 gap-8 items-start my-12',
                className
            )}
            {...rest}
        >
            {/* Left Visual Column (2 cols) */}
            <div className="md:col-span-2 relative aspect-square rounded-2xl bg-surface-muted border border-border overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="text-center p-6 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-surface-base shadow-sm border border-border mx-auto mb-4 flex items-center justify-center">
                        <Icon className="text-primary" size={20} />
                    </div>
                    <Text role="Label" content={label} prominence="Strong" />
                </div>
            </div>

            {/* Right Content Column (3 cols) */}
            <div className="md:col-span-3 space-y-4">
                {children}
            </div>
        </div>
    );
}
