import React from 'react';
import { PanelGroup, Panel, PanelHandle } from '../../../components/ui/Resizable';
import { InteractionConsole } from './InteractionConsole';
import { ContextPanel } from './ContextPanel';
import { ApiNavigation } from './ApiNavigation';
import * as styles from './ApiDocsLayout.css.ts';

export const ApiDocsLayout = () => {
    return (
        <div className={styles.container}>
            <PanelGroup direction="horizontal">
                {/* Navigation Panel */}
                <Panel id="navigation" defaultSize={20} minSize={15} maxSize={30}>
                    <ApiNavigation />
                </Panel>

                <PanelHandle />

                {/* Left Panel: Request Console */}
                <Panel id="interaction-console" defaultSize={40} minSize={30}>
                    <InteractionConsole />
                </Panel>

                <PanelHandle />

                {/* Right Panel: Documentation Context */}
                <Panel id="context-panel" defaultSize={40} minSize={30}>
                    <ContextPanel />
                </Panel>
            </PanelGroup>
        </div>
    );
};
