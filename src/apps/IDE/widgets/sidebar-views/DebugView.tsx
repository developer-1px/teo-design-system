import { Action } from '@/components/types/Element/Action/Action';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { SidebarHeader } from './SidebarHeader';
import { ChevronRight, ChevronDown, Play, Pause, StepForward, StepBack, RefreshCw, StopCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Input } from './components/ui/input';

export const DebugView = () => {
    return (
        <>
            <SidebarHeader
                title="RUN AND DEBUG"
                actions={
                    <div className="flex items-center gap-1">
                        <Action role="IconButton" icon="MoreHorizontal" label="More Actions" prominence="Subtle" density="Compact" />
                    </div>
                }
            />

            {/* Debug Actions Toolbar */}
            <Section role="Container" className="flex-shrink-0 p-2 bg-surface-raised border-b border-border-muted">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="default" size="sm" className="bg-semantic-success hover:bg-semantic-success/90 h-7 text-xs flex-1 justify-start px-2">
                        <Play size={12} className="mr-2 fill-current" />
                        Run: Development
                    </Button>
                    <Action role="IconButton" icon="Settings" label="Configure" prominence="Subtle" density="Compact" />
                </div>
            </Section>

            <Section role="Container" className="flex-1 overflow-y-auto flex flex-col">
                {/* Variables */}
                <Block role="Accordion" className="border-b border-border-muted pb-1">
                    <button className="w-full flex items-center gap-1 px-2 py-1 hover:bg-surface-hover text-xs font-bold text-text-secondary uppercase tracking-wider group">
                        <ChevronDown size={14} />
                        <span>Variables</span>
                    </button>

                    <div className="px-2 pb-2 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 group cursor-pointer hover:bg-surface-hover px-2 py-0.5 rounded-sm">
                            <span className="text-accent font-mono text-xs">local</span>
                            <span className="text-text-tertiary text-xs">:</span>
                            <span className="text-semantic-info font-mono text-xs truncate">Object</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:bg-surface-hover px-2 py-0.5 rounded-sm pl-6">
                            <span className="text-text-secondary font-mono text-xs">this</span>
                            <span className="text-text-tertiary text-xs">:</span>
                            <span className="text-semantic-info font-mono text-xs truncate">undefined</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:bg-surface-hover px-2 py-0.5 rounded-sm pl-6">
                            <span className="text-text-secondary font-mono text-xs">args</span>
                            <span className="text-text-tertiary text-xs">:</span>
                            <span className="text-text-tertiary font-mono text-xs truncate">[]</span>
                        </div>
                    </div>
                </Block>

                {/* Watch */}
                <Block role="Accordion" className="border-b border-border-muted pb-1">
                    <div className="flex items-center justify-between group/header pr-2">
                        <button className="flex-1 flex items-center gap-1 px-2 py-1 hover:bg-surface-hover text-xs font-bold text-text-secondary uppercase tracking-wider text-left">
                            <ChevronDown size={14} />
                            <span>Watch</span>
                        </button>
                        <div className="hidden group-hover/header:flex">
                            <Action role="IconButton" icon="Plus" label="Add Expression" prominence="Subtle" density="Compact" className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="px-4 py-2 text-xs text-text-tertiary italic">
                        No expressions to watch.
                    </div>
                </Block>

                {/* Call Stack */}
                <Block role="Accordion" className="border-b border-border-muted pb-1">
                    <button className="w-full flex items-center gap-1 px-2 py-1 hover:bg-surface-hover text-xs font-bold text-text-secondary uppercase tracking-wider">
                        <ChevronDown size={14} />
                        <span>Call Stack</span>
                    </button>
                    <div className="px-2 pb-2 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 group cursor-pointer bg-accent/10 hover:bg-accent/20 px-2 py-0.5 rounded-sm">
                            <Text role="Body" content="handleLogin" size="xs" className="font-mono text-text" />
                            <span className="text-text-tertiary text-xs ml-auto">login.ts:42</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:bg-surface-hover px-2 py-0.5 rounded-sm opacity-80">
                            <Text role="Body" content="onSubmit" size="xs" className="font-mono text-text-secondary" />
                            <span className="text-text-tertiary text-xs ml-auto">Form.tsx:128</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:bg-surface-hover px-2 py-0.5 rounded-sm opacity-60">
                            <Text role="Body" content="HTMLFormElement.callCallback" size="xs" className="font-mono text-text-tertiary" />
                            <span className="text-text-tertiary text-xs ml-auto">react-dom.js:123</span>
                        </div>
                    </div>
                </Block>

                {/* Breakpoints */}
                <Block role="Accordion" className="border-b border-border-muted pb-1">
                    <div className="flex items-center justify-between group/header pr-2">
                        <button className="flex-1 flex items-center gap-1 px-2 py-1 hover:bg-surface-hover text-xs font-bold text-text-secondary uppercase tracking-wider text-left">
                            <ChevronDown size={14} />
                            <span>Breakpoints</span>
                        </button>
                        <div className="hidden group-hover/header:flex">
                            <Action role="IconButton" icon="Plus" label="Add Function Breakpoint" prominence="Subtle" density="Compact" className="h-5 w-5" />
                            <Action role="IconButton" icon="RotateCcw" label="Remove All" prominence="Subtle" density="Compact" className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="px-2 pb-2 flex flex-col gap-1">
                        <div className="flex items-center gap-2 px-2 py-0.5 hover:bg-surface-hover rounded-sm group">
                            <input type="checkbox" checked className="rounded border-border-default text-accent focus:ring-accent h-3 w-3" />
                            <div className="flex items-baseline gap-1 min-w-0">
                                <span className="text-xs text-text truncate">Uncaught Exceptions</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-0.5 hover:bg-surface-hover rounded-sm group">
                            <input type="checkbox" className="rounded border-border-default text-accent focus:ring-accent h-3 w-3" />
                            <div className="flex items-baseline gap-1 min-w-0">
                                <span className="text-xs text-text truncate">Caught Exceptions</span>
                            </div>
                        </div>
                    </div>
                </Block>

            </Section>
        </>
    );
};
