import React from 'react';
import { PanelGroup, Panel, PanelHandle } from './Resizable';

export interface ResizablePanelProps {
    direction?: 'horizontal' | 'vertical';
    initialSplit?: number; // percentage 0-100
    minSplit?: number; // Not used in this basic wrapper but kept for API compatibility
    maxSplit?: number;
    className?: string;
    style?: React.CSSProperties;
    children: [React.ReactNode, React.ReactNode];
}

/**
 * @deprecated Use PanelGroup, Panel, and PanelHandle for new implementations.
 * This is a legacy wrapper following the new Resizable architecture.
 */
export const ResizablePanel = ({
    direction = 'horizontal',
    initialSplit = 50,
    className,
    style,
    children
}: ResizablePanelProps) => {
    const [pane1, pane2] = children;

    return (
        <PanelGroup direction={direction} className={className} style={style}>
            <Panel id="legacy-p1" defaultSize={initialSplit}>
                {pane1}
            </Panel>
            <PanelHandle id="handle-0" />
            <Panel id="legacy-p2" defaultSize={100 - initialSplit}>
                {pane2}
            </Panel>
        </PanelGroup>
    );
};
