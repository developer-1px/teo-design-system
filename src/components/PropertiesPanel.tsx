
import React, { useState } from 'react'
import { Frame } from '../design-system/Frame'
import { Section } from '../design-system/Section'
import { Text } from '../design-system/Text'
import { Action } from '../design-system/Action'
import { Field } from '../design-system/Field'
import { Separator } from '../design-system/Separator'
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    ChevronDown,
    CornerUpRight,
    Eye,
    Lock,
    Minus,
    MoreHorizontal,
    Plus,
    Settings,
    Sun
} from 'lucide-react'

// --- Data ---

const ALIGNMENT_TOOLS = [
    { icon: AlignLeft, label: 'Left' },
    { icon: AlignCenter, label: 'Center', variant: 'surface' as const },
    { icon: AlignRight, label: 'Right' },
    { separator: true },
    { icon: AlignJustify, label: 'Justify' },
    { icon: AlignCenter, label: 'Middle', rotation: 90 },
    { icon: CornerUpRight, label: 'Distribute' },
];

// --- Helpers ---

const PropertySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Frame gap={2}>
        <Frame row justify="between" align="center">
            <Text variant={3} weight="bold" size={10}>{title}</Text>
            <Action icon={Plus} iconSize={12} size={20} opacity={0.4} />
        </Frame>
        <Frame gap={1}>
            {children}
        </Frame>
        <Separator />
    </Frame>
);

const TransformField = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <Frame flex>
        <Field label={label} value={value} onChange={(e) => onChange(e.target.value)} />
    </Frame>
);

export function PropertiesPanel() {
    const [activeTab, setActiveTab] = useState<'DESIGN' | 'ANIMATE'>('DESIGN');
    const [transform, setTransform] = useState({ x: '400', y: '225', w: '800', h: '450', r: '0', corner: '0' });

    const updateTransform = (key: string, value: string) => setTransform(prev => ({ ...prev, [key]: value }));

    return (
        <Section style={{ width: 260 }} surface={1} radius="round" shadow="sm">
            {/* Tabs */}
            <Frame row padding={1} gap={1} height={40} border="bottom" borderColor="default" style={{ flexShrink: 0 }}>
                {['DESIGN', 'ANIMATE'].map((tab) => (
                    <Frame
                        key={tab}
                        flex
                        justify="center"
                        align="center"
                        radius="round"
                        onClick={() => setActiveTab(tab as any)}
                        style={{
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            backgroundColor: activeTab === tab ? 'var(--tab-bg-active)' : 'transparent'
                        }}
                    >
                        <Text variant={4} weight={activeTab === tab ? 'bold' : 'medium'} size={10} style={{ color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)' }}>{tab}</Text>
                    </Frame>
                ))}
            </Frame>

            <Frame padding={3} gap={2} overflow="auto" flex fill style={{ minHeight: 0 }}>
                {/* Alignment */}
                <Frame row justify="between" surface={2}>
                    {ALIGNMENT_TOOLS.map((tool, i) => (
                        tool.separator ? <Separator key={i} orientation="vertical" length="12px" /> :
                            <Action key={i} icon={tool.icon} iconSize={12} variant={tool.variant} flex justify="center" radius="round" size={24} iconRotation={tool.rotation} />
                    ))}
                </Frame>
                <Separator />

                {/* Transform */}
                <Frame gap={2}>
                    <Frame row gap={2} align="center">
                        <TransformField label="X" value={transform.x} onChange={(v) => updateTransform('x', v)} />
                        <TransformField label="Y" value={transform.y} onChange={(v) => updateTransform('y', v)} />
                        <Frame width={24} />
                    </Frame>
                    <Frame row gap={2} align="center">
                        <TransformField label="W" value={transform.w} onChange={(v) => updateTransform('w', v)} />
                        <TransformField label="H" value={transform.h} onChange={(v) => updateTransform('h', v)} />
                        <Frame width={24} align="center" justify="center"><Action icon={Lock} iconSize={10} size={20} opacity={0.3} /></Frame>
                    </Frame>
                    <Frame row gap={2} align="center">
                        <TransformField label="°" value={transform.r} onChange={(v) => updateTransform('r', v)} />
                        <TransformField label="R" value={transform.corner} onChange={(v) => updateTransform('corner', v)} />
                        <Frame width={24} />
                    </Frame>
                    <Separator />
                </Frame>

                {/* Properties */}
                <PropertySection title="LAYER">
                    <Frame row justify="between" gap={3}>
                        <Field value="Normal" rightIcon={<ChevronDown size={10} />} flex />
                        <Field value="100%" icon={<Eye size={10} />} width={70} />
                    </Frame>
                </PropertySection>

                <PropertySection title="TEXT">
                    <Frame gap="6px">
                        <Field value="Inter" rightIcon={<ChevronDown size={10} />} />
                        <Frame row gap={2}>
                            <Field value="Regular" rightIcon={<ChevronDown size={10} />} flex />
                            <Field value="42" width={50} />
                        </Frame>
                        <Frame row gap={2}>
                            <Field label="LH" value="Auto" flex />
                            <Field label="LS" value="0%" flex />
                        </Frame>
                        <Frame row align="center" surface={2} radius="round">
                            {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon, i) => (
                                <Action key={i} icon={Icon} iconSize={12} variant={i === 0 ? 'surface' : undefined} radius="round" size={24} flex />
                            ))}
                            <Action icon={MoreHorizontal} iconSize={12} radius="round" size={24} />
                        </Frame>
                    </Frame>
                </PropertySection>

                <PropertySection title="FILL">
                    <Field value="F4F4F5" icon={<Frame width={10} height={10} surface={1} radius="round" border />} rightIcon={<Text variant={4} size={10}>100%</Text>} />
                </PropertySection>

                <PropertySection title="STROKE">
                    <Frame gap="6px">
                        <Field value="000000" icon={<Frame width={10} height={10} border borderColor="text-primary" radius="round" />} rightIcon={
                            <Frame row gap={2}>
                                <Text variant={4} size={10}>100%</Text>
                                <Action icon={Eye} iconSize={10} size={16} />
                                <Action icon={Minus} iconSize={10} size={16} />
                            </Frame>
                        } style={{ flexShrink: 0 }} />
                        <Frame row gap={2} align="center">
                            <Field value="1.5" width={50} />
                            <Field value="Inside" rightIcon={<ChevronDown size={10} />} flex />
                            <Action icon={Settings} iconSize={10} radius="round" size={24} />
                        </Frame>
                    </Frame>
                </PropertySection>

                <PropertySection title="EFFECTS">
                    <Field value="Drop Shadow" icon={<Sun size={10} />} rightIcon={<Action icon={Settings} iconSize={10} size={16} />} />
                </PropertySection>

                <PropertySection title="EXPORT">
                    <Field value="PNG" rightIcon={<Action icon={Plus} iconSize={10} size={16} />} />
                </PropertySection>

                <Frame height={100} />
            </Frame>
        </Section>
    );
}
