import React, { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { useSelection } from '@/shared/lib/selection/useSelection';
import { cn } from '@/shared/lib/utils';

/**
 * TokenEngineShowcase 
 * 
 * v7.0 Ready: Verification of Token Engine, Selection System, and Role Registry.
 */
export const TokenEngineShowcase = () => {
    const [selectedId, setSelectedId] = useState<string | number>('1');

    // Sample data for selection test
    const items = [
        { id: '1', title: 'Concept Architecture' },
        { id: '2', title: 'Token Engine v6.0' },
        { id: '3', title: 'Selection System' },
        { id: '4', title: 'Adaptive Layout' },
    ];

    const selection = useSelection({
        items,
        getId: (item) => item.id,
        initialSelectedIds: [selectedId as string],
        onSelectionChange: (selected) => {
            if (selected.length > 0) setSelectedId(selected[0].id);
        }
    });

    const selectionModel = {
        selectedValues: selection.selectedIds,
        isSelected: selection.isSelected,
        handleItemClick: selection.handleItemClick,
        registerItemRef: selection.registerItemRef,
    };

    return (
        <Page role="Document">
            {/* 1. Sidebar for Navigation & Info */}
            <Section role="Sidebar" prominence="Subtle">
                <Block role="Stack">
                    <Block role="Stack">
                        <Text role="Heading" prominence="Strong" content="IDDL Surface" />
                        <Text role="Caption" prominence="Subtle" content="Minimal & Airy (v6.2)" />
                    </Block>

                    <Block role="Stack">
                        <Text role="Label" content="Status" />
                        <Block role="List">
                            {items.map((item) => (
                                <Block
                                    key={item.id}
                                    role="ListItem"
                                    value={item.id}
                                    selectionModel={selectionModel}
                                >
                                    <Block role="Stack">
                                        <div className={`w-1 h-1 rounded-full transition-all ${selection.isSelected(item.id) ? 'bg-primary scale-150' : 'bg-transparent'}`} />
                                        <Text role="Label" content={item.title} prominence={selection.isSelected(item.id) ? 'Strong' : 'Standard'} />
                                    </Block>
                                </Block>
                            ))}
                        </Block>
                    </Block>
                </Block>
            </Section>

            {/* 2. Main Content */}
            <Section role="Main" prominence="Standard">
                <Block role="Stack">

                    {/* Header */}
                    <Block role="Stack">
                        <Text role="Title" prominence="Strong" content="Surface Over Boundaries" />
                        <Text role="Body" prominence="Standard" content="Borders are minimized. Boundaries are defined by subtle background shifts and soft, airy shadows that spread naturally across the canvas." />
                    </Block>

                    {/* Matrix Section */}
                    <Block role="Stack">
                        <Text role="Heading" prominence="Strong" content="1. Refined Intent Matrix" />
                        <Block role="Grid" spec={{ columns: 6 }}>
                            {['Neutral', 'Brand', 'Positive', 'Caution', 'Critical', 'Info'].map(intent => (
                                <Block key={intent} role="Stack">
                                    <Text role="Caption" prominence="Subtle" content={intent} />
                                    <Action role="Button" prominence="Hero" intent={intent as any} label="Hero" />
                                    <Action role="Button" prominence="Strong" intent={intent as any} label="Strong" />
                                    <Action role="Button" prominence="Standard" intent={intent as any} label="Std" />
                                    <Action role="Button" prominence="Subtle" intent={intent as any} label="Subtle" />
                                </Block>
                            ))}
                        </Block>
                    </Block>

                    {/* Interactive Selection Section */}
                    <Block role="Stack">
                        <Block role="Stack">
                            <Text role="Heading" prominence="Strong" content="2. Surface & Outline Selection" />
                            <Text role="Caption" prominence="Subtle" content="Selection uses 'outline' (CSS) to preserve layout geometry. Inner blocks remain transparent to emphasize the parent surface." />
                        </Block>
                        <Block role="Grid" spec={{ columns: 2 }}>
                            {items.map(item => (
                                <Block
                                    key={item.id}
                                    role="Card"
                                    prominence={selection.isSelected(item.id) ? 'Strong' : 'Standard'}
                                    intent="Neutral"
                                    value={item.id}
                                    selectionModel={selectionModel}
                                    className="cursor-pointer group transition-all"
                                    style={{ padding: '4rem' }}
                                >
                                    <Block role="Stack">
                                        <div className="flex items-center justify-between h-8">
                                            <Text role="Heading" content={item.title} prominence="Strong" />
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300",
                                                selection.isSelected(item.id) ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                            )} />
                                        </div>
                                        <Text role="Body" content="This component uses depth and outlines for state. Notice how nested stacks stay transparent during selection." />
                                    </Block>
                                </Block>
                            ))}
                        </Block>
                    </Block>
                </Block>
            </Section>
        </Page>
    );
};
