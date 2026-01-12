import { Frame } from '@/components/dsl/shared/Frame';
import {
    Menu,
    ChevronLeft,
    ChevronRight,
    PanelLeft,
    PanelBottom,
    PanelRight,
    Search,
    Monitor,
    Layout,
    LayoutTemplate
} from 'lucide-react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

interface StudioTitleBarProps {
    onToggleSidebar?: () => void;
    onTogglePanel?: () => void;
    onToggleRightBar?: () => void;
}

export const StudioTitleBar = ({
    onToggleSidebar,
    onTogglePanel,
    onToggleRightBar
}: StudioTitleBarProps) => {
    const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

    return (
        <Section role="Header" className="h-[35px] min-h-[35px] border-b border-border-muted flex items-center bg-surface-sunken text-muted select-none">
            <Frame.Row width="fill" height="fill" align="center" justify="between" className="px-3">
                {/* Left: App Icon & Menus */}
                <Frame.Row align="center" gap={0} className="flex-1">
                    <div className="mr-3 text-primary opacity-80">
                        <Layout size={16} strokeWidth={2.5} />
                    </div>
                    <Frame.Row gap={0}>
                        {menuItems.map(item => (
                            <Action
                                key={item}
                                role="Button"
                                label={item}
                                className="h-[35px] px-2.5 rounded-none hover:bg-hover transition-colors text-[13px] font-normal text-muted"
                            />
                        ))}
                    </Frame.Row>
                </Frame.Row>

                {/* Center: Search / Path */}
                <Frame.Row align="center" className="flex-[2] justify-center px-4">
                    <div className="w-full max-w-[600px] h-[24px] bg-surface-elevated/20 border border-border-muted rounded flex items-center px-3 gap-3 group hover:bg-surface-elevated/40 transition-all cursor-text">
                        <Frame.Row gap={3} align="center" className="opacity-40">
                            <ChevronLeft size={14} />
                            <ChevronRight size={14} />
                        </Frame.Row>
                        <Frame.Row gap={2} align="center" width="fill" justify="center">
                            <Search size={13} className="opacity-40" />
                            <span className="text-[12px] opacity-60">ide-ui-kit (Workspace)</span>
                        </Frame.Row>
                    </div>
                </Frame.Row>

                {/* Right: Layout Controls */}
                <Frame.Row align="center" gap={1} className="flex-1 justify-end">
                    <Action
                        role="IconButton"
                        icon={PanelLeft}
                        onClick={onToggleSidebar}
                        className="h-[28px] w-[28px] opacity-70 hover:opacity-100 hover:bg-hover"
                    />
                    <Action
                        role="IconButton"
                        icon={PanelBottom}
                        onClick={onTogglePanel}
                        className="h-[28px] w-[28px] opacity-70 hover:opacity-100 hover:bg-hover"
                    />
                    <Action
                        role="IconButton"
                        icon={PanelRight}
                        onClick={onToggleRightBar}
                        className="h-[28px] w-[28px] opacity-70 hover:opacity-100 hover:bg-hover"
                    />
                    <div className="w-[1px] h-4 bg-border-muted mx-1" />
                    <Action
                        role="IconButton"
                        icon={LayoutTemplate}
                        className="h-[28px] w-[28px] opacity-70 hover:opacity-100 hover:bg-hover"
                    />
                </Frame.Row>
            </Frame.Row>
        </Section>
    );
};
