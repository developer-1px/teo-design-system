import { Action } from '@/components/types/Element/Action/Action';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { SidebarHeader } from './SidebarHeader';
import { Play, ClipboardList, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/button';

export const RunView = () => {
    return (
        <>
            <SidebarHeader
                title="RUN AND DEPLOY"
                actions={
                    <div className="flex items-center gap-1">
                        <Action role="IconButton" icon="MoreHorizontal" label="More Actions" prominence="Subtle" density="Compact" />
                    </div>
                }
            />

            <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                {/* Run Target */}
                <Block role="Container" className="flex flex-col gap-2">
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Run Target</div>
                    <div className="flex items-center gap-2 p-2 rounded border border-border-default bg-surface-raised">
                        <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-accent">
                            <Play size={16} className="fill-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-text">Development</div>
                            <div className="text-xs text-text-tertiary">Localhost:5173</div>
                        </div>
                        <Action role="IconButton" icon="Settings" label="Configure" prominence="Subtle" density="Compact" />
                    </div>
                    <Button variant="default" size="sm" className="w-full h-8 mt-1">Start Debugging</Button>
                </Block>

                {/* Deployments */}
                <Block role="Container" className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Active Deployments</div>
                        <Action role="IconButton" icon="RefreshCw" label="Refresh" prominence="Subtle" density="Compact" className="h-4 w-4" />
                    </div>

                    <div className="border border-border-default rounded flex flex-col divide-y divide-border-muted">
                        <div className="p-2 flex items-center gap-3 bg-surface-raised">
                            <div className="w-2 h-2 rounded-full bg-semantic-success animate-pulse"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-text">Production</div>
                                <div className="text-[10px] text-text-tertiary">Last deploy: 2m ago</div>
                            </div>
                            <Action role="IconButton" icon="ExternalLink" label="Open" prominence="Subtle" density="Compact" />
                        </div>
                        <div className="p-2 flex items-center gap-3 hover:bg-surface-hover">
                            <div className="w-2 h-2 rounded-full bg-semantic-warning"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-text">Staging</div>
                                <div className="text-[10px] text-text-tertiary">Building...</div>
                            </div>
                            <Action role="IconButton" icon="ExternalLink" label="Open" prominence="Subtle" density="Compact" />
                        </div>
                    </div>
                </Block>

                {/* Logs */}
                <Block role="Container" className="flex flex-col gap-2 flex-1 min-h-0">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Recent Logs</div>
                        <Action role="IconButton" icon="Trash" label="Clear" prominence="Subtle" density="Compact" className="h-4 w-4" />
                    </div>

                    <div className="flex-1 bg-surface-sunken border border-border-default rounded p-2 overflow-y-auto font-mono text-[10px] text-text-secondary leading-relaxed">
                        <div className="text-semantic-info">[INFO] Build started...</div>
                        <div className="text-text-tertiary">[DEBUG] Analyzing dependency graph</div>
                        <div className="text-text-tertiary">[DEBUG] Transpiling modules...</div>
                        <div className="text-semantic-warning">[WARN] Unused variable 'foo' in App.tsx:45</div>
                        <div className="text-semantic-info">[INFO] Build completed in 2.4s</div>
                        <div>Server ready at http://localhost:3000</div>
                    </div>
                </Block>

            </Section>
        </>
    );
};
