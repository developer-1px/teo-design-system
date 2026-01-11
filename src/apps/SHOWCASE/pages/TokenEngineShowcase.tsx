import React from 'react';
import { IDDLProvider } from '@/components/context/IDDLContext';
import { useIDDLToken } from '@/shared/iddl/token-engine';

// 1. A Component that uses the Engine
const TokenButton = ({ label, role = 'Button' }: { label: string; role?: string }) => {
    // Hook usage: Local props + Context override
    const tokens = useIDDLToken({ role, prominence: 'Standard' });
    const styles = tokens.spacing; // padding, gap
    const bg = tokens.surface.background;

    return (
        <div className="flex flex-col gap-2">
            <button
                style={{
                    padding: styles.padding,
                    gap: styles.gap
                }}
                className={`border rounded flex items-center justify-center transition-all ${bg}`}
            >
                {label}
            </button>
            <div className="text-[10px] text-gray-500 font-mono">
                p: {styles.padding}
            </div>
        </div>
    );
};

// 2. The Verification Page
export const TokenEngineShowcase = () => {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Token Engine Verification</h1>
            <p className="text-gray-600">
                Verifying "Adaptive Scale": The same &lt;Button&gt; renders differently based on SectionType context.
            </p>

            <div className="grid grid-cols-4 gap-4">
                {/* Scenario A: Stage (Comfortable, large) */}
                <IDDLProvider value={{ type: 'Stage', density: 'Standard', prominence: 'Standard', intent: 'Neutral', depth: 0 }}>
                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-bold mb-4">Stage (Scale: 1.0)</h3>
                        <TokenButton label="Stage Button" />
                    </div>
                </IDDLProvider>

                {/* Scenario B: Panel (Slightly smaller) */}
                <IDDLProvider value={{ type: 'Panel', density: 'Standard', prominence: 'Standard', intent: 'Neutral', depth: 0 }}>
                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-bold mb-4">Panel (Scale: 0.9)</h3>
                        <TokenButton label="Panel Button" />
                    </div>
                </IDDLProvider>

                {/* Scenario C: Bar (Tight vertical) */}
                <IDDLProvider value={{ type: 'Bar', density: 'Standard', prominence: 'Standard', intent: 'Neutral', depth: 0 }}>
                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-bold mb-4">Bar (Scale: 0.8)</h3>
                        <TokenButton label="Bar Button" />
                    </div>
                </IDDLProvider>

                {/* Scenario D: Rail (Very tight) */}
                <IDDLProvider value={{ type: 'Rail', density: 'Standard', prominence: 'Standard', intent: 'Neutral', depth: 0 }}>
                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-bold mb-4">Rail (Scale: 0.7)</h3>
                        <TokenButton label="Rail Button" />
                    </div>
                </IDDLProvider>
            </div>

            <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-bold mb-4">Role Base Defaults</h2>
                <div className="grid grid-cols-3 gap-4">
                    {/* Verify different roles */}
                    <IDDLProvider value={{ type: 'Stage', density: 'Standard', prominence: 'Standard', intent: 'Neutral', depth: 0 }}>
                        <TokenButton label="Button" role="Button" />
                        <TokenButton label="Icon Button" role="IconButton" />
                        <TokenButton label="Tag" role="Tag" />
                    </IDDLProvider>
                </div>
            </div>
        </div>
    );
};
