import * as styles from './EditorLayout.css';
import { EditorSidebar } from './EditorSidebar';
import { ChatPanel } from './ChatPanel';
import { EditorSurface } from './EditorSurface';

export function EditorPage() {
    return (
        <div className={styles.editorLayout}>
            {/* 1. File Tree */}
            <EditorSidebar />

            {/* 2. Main Area (Code + Terminal) */}
            <EditorSurface />

            {/* 3. Chat Panel */}
            <ChatPanel />
        </div>
    );
}
