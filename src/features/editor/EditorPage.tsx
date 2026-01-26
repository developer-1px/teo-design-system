import * as styles from './EditorLayout.css';
import { EditorSidebar } from './EditorSidebar';
import { ChatPanel } from './ChatPanel';
import { EditorSurface } from './EditorSurface';
import { useResizable } from './useResizable';

export function EditorPage() {
    const { width, startResizing, isResizing } = useResizable({ initialWidth: 250, minWidth: 200, maxWidth: 600 });

    return (
        <div
            className={styles.editorLayout}
            style={{
                gridTemplateColumns: `${width}px 1fr 400px`,
                cursor: isResizing ? 'col-resize' : undefined
            }}
        >
            {/* 1. File Tree */}
            <EditorSidebar />

            {/* Resizer Handle (Overlay on grid column 1 right edge) */}
            <div
                className={styles.resizer}
                onMouseDown={startResizing}
                role="separator"
                aria-orientation="vertical"
            />

            {/* 2. Main Area (Code + Terminal) */}
            <EditorSurface />

            {/* 3. Chat Panel */}
            <ChatPanel />
        </div>
    );
}
