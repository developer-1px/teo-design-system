import { ChevronDown, ChevronRight, FileCode, Folder, FolderOpen } from 'lucide-react';
import * as styles from './EditorSidebar.css';
import { useState } from 'react';

export function EditorSidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>EXPLORER</div>

            {/* Project Root */}
            <FolderItem name="fusion-hypernova" defaultOpen>
                <FolderItem name="src" defaultOpen>
                    <FolderItem name="components">
                        <FileItem name="Header.tsx" />
                        <FileItem name="Sidebar.tsx" />
                    </FolderItem>
                    <FolderItem name="features" defaultOpen>
                        <FolderItem name="mail" defaultOpen>
                            <FileItem name="MailPage.tsx" />
                        </FolderItem>
                        <FolderItem name="editor" defaultOpen>
                            <FileItem name="EditorPage.tsx" active />
                            <FileItem name="ChatPanel.tsx" />
                        </FolderItem>
                    </FolderItem>
                    <FileItem name="App.tsx" />
                    <FileItem name="main.tsx" />
                </FolderItem>
                <FileItem name="package.json" />
                <FileItem name="tsconfig.json" />
            </FolderItem>
        </aside>
    );
}

function FolderItem({ name, children, defaultOpen = false }: { name: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{ marginLeft: '8px' }}>
            <div className={styles.fileItem} onClick={() => setIsOpen(!isOpen)} style={{ opacity: 0.8 }}>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {isOpen ? <FolderOpen size={14} fill="currentColor" fillOpacity={0.2} /> : <Folder size={14} fill="currentColor" fillOpacity={0.2} />}
                <span style={{ fontWeight: 600 }}>{name}</span>
            </div>
            {isOpen && <div style={{ borderLeft: '1px solid rgba(0,0,0,0.05)' }}>{children}</div>}
        </div>
    );
}

function FileItem({ name, active }: { name: string, active?: boolean }) {
    // Determine icon based on extension mock
    return (
        <div className={`${styles.fileItem} ${active ? styles.activeFile : ''}`} style={{ paddingLeft: '24px' }}>
            <FileCode size={14} color={active ? 'currentColor' : '#4285f4'} />
            <span>{name}</span>
        </div>
    );
}
