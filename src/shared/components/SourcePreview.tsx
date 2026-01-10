import { useState } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Section } from '@/components/types/Section/Section';
import { Text } from '@/components/types/Atom/Text/Text';
import { Action } from '@/components/types/Atom/Action/Action';

interface SourcePreviewProps {
    code: string;
    title?: string;
    children: React.ReactNode;
}

export function SourcePreview({ code, title, children }: SourcePreviewProps) {
    const [showCode, setShowCode] = useState(false);

    return (
        <Block role="Card" prominence="Standard" className="p-0 overflow-hidden border border-border-default">
            {/* Header / Tabs */}
            <Block role="Toolbar" className="bg-surface-subtle border-b border-border-default px-4 py-2 flex justify-between items-center">
                <Text role="Label" content={title || 'Component Preview'} prominence="Standard" />
                <Block role="Inline" gap="2">
                    <Action
                        role="Button"
                        prominence={!showCode ? 'Standard' : 'Subtle'}
                        density="Compact"
                        label="Preview"
                        icon="Eye"
                        onClick={() => setShowCode(false)}
                    />
                    <Action
                        role="Button"
                        prominence={showCode ? 'Standard' : 'Subtle'}
                        density="Compact"
                        label="Code"
                        icon="Code"
                        onClick={() => setShowCode(true)}
                    />
                </Block>
            </Block>

            {/* Content Area */}
            {showCode ? (
                <Block role="Container" className="bg-surface-sunken p-4 overflow-auto max-h-[400px]">
                    <pre className="font-mono text-xs leading-relaxed text-text-subtle whitespace-pre-wrap">
                        {code}
                    </pre>
                </Block>
            ) : (
                <Block role="Container" className="p-6 bg-surface">
                    {children}
                </Block>
            )}
        </Block>
    );
}
