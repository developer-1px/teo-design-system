import { useState } from 'react';
import { Group } from '@/components/types/Group/Group';
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
        <Group role="Card" prominence="Standard" className="p-0 overflow-hidden border border-border-default">
            {/* Header / Tabs */}
            <Group role="Toolbar" className="bg-surface-subtle border-b border-border-default px-4 py-2 flex justify-between items-center">
                <Text role="Label" content={title || 'Component Preview'} prominence="Standard" />
                <Group role="Inline" gap="2">
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
                </Group>
            </Group>

            {/* Content Area */}
            {showCode ? (
                <Group role="Container" className="bg-surface-sunken p-4 overflow-auto max-h-[400px]">
                    <pre className="font-mono text-xs leading-relaxed text-text-subtle whitespace-pre-wrap">
                        {code}
                    </pre>
                </Group>
            ) : (
                <Group role="Container" className="p-6 bg-surface">
                    {children}
                </Group>
            )}
        </Group>
    );
}
