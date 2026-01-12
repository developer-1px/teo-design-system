
import { Frame } from '../design-system/Frame'
import { Action } from '../design-system/Action'
import { Separator } from '../design-system/Separator'
import { useTheme } from '../design-system/theme'
import {
    Circle,
    Image as ImageIcon,
    LayoutTemplate,
    MessageSquare,
    Moon,
    MousePointer2,
    PenTool,
    Square,
    Sun,
    Type
} from 'lucide-react'

const BOTTOM_TOOLS = [
    { icon: MousePointer2, tooltip: 'Move', variant: 'surface' as const },
    { icon: LayoutTemplate, tooltip: 'Slides' },
    { separator: true },
    { icon: Square, tooltip: 'Frame' },
    { icon: Type, tooltip: 'Text' },
    { icon: Circle, tooltip: 'Shape' },
    { icon: PenTool, tooltip: 'Pen' },
    { icon: ImageIcon, tooltip: 'Resources' },
    { separator: true },
    { icon: MessageSquare, tooltip: 'Comment' },
    { separator: true },
];

export function FloatingToolbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Frame position="absolute" bottom={24} left="50%" zIndex={100} style={{ transform: 'translateX(-50%)' }} row gap={1} surface={1} padding={1} radius="pill" shadow="lg" align="center" border>
            {BOTTOM_TOOLS.map((tool, i) => (
                tool.separator ? <Separator key={i} orientation="vertical" length="16px" /> :
                    <Action key={i} icon={tool.icon} iconSize={18} variant={tool.variant} radius="pill" tooltip={tool.tooltip} size={32} />
            ))}
            <Action icon={theme === 'light' ? Moon : Sun} iconSize={18} radius="pill" onClick={toggleTheme} tooltip="Toggle Theme" size={32} />
        </Frame>
    );
}
