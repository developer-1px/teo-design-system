
import { Frame } from '../design-system/Frame'
import { Section } from '../design-system/Section'
import { Text } from '../design-system/Text'
import { Action } from '../design-system/Action'
import { MoreHorizontal } from 'lucide-react'

export function SlidesPanel() {
    const slides = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Section title="Slides" style={{ width: 220, minWidth: 200 }} surface={1} radius="round" shadow="sm">
            <Frame padding={3} gap={3} overflow="auto" flex fill style={{ minHeight: 0 }}>
                {slides.map((num) => (
                      <Frame key={num} gap={1} style={{ flexShrink: 0 }} opacity={num === 1 ? 1 : 0.6}>
                        <Frame row justify="between" align="center">
                            <Text variant={4} size={11} style={{ color: num === 1 ? 'var(--text-primary)' : 'var(--text-subtle)' }}>{num}</Text>
                            <Action icon={MoreHorizontal} iconSize={12} size={20} opacity={num === 1 ? 0.6 : 0} />
                        </Frame>
                        <Frame width="100%" ratio="16/9" border borderColor={num === 1 ? 'default' : 'transparent'} surface={num === 1 ? 1 : 2} radius="round" flex align="center" justify="center" overflow="hidden" style={{ boxShadow: num === 1 ? '0 0 0 1.5px var(--text-primary)' : 'none', transition: 'all 0.2s ease' }}>
                            {num === 1 ? <Frame width="60%" height={2} surface={4} /> : <Text variant={4} size={10}>{num}</Text>}
                        </Frame>
                    </Frame>
                ))}
            </Frame>
        </Section>
    );
}
