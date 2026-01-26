import { ChevronDown, ChevronRight, FileCode, Folder, FolderOpen, FileJson, FileType } from 'lucide-react';
import * as styles from './EditorSidebar.css';
import { useMemo, useState } from 'react';

type FileNode = {
    name: string;
    path: string;
    type: 'file';
};

type FolderNode = {
    name: string;
    path: string;
    type: 'folder';
    children: Record<string, FileNode | FolderNode>;
};

export function EditorSidebar() {
    // Glob all files we want to show
    const files = import.meta.glob([
        '/src/**/*.{ts,tsx,css.ts,mdx,json}',
        '/vite-plugins/**/*.{ts,tsx}',
        '/*.{ts,json,js,html}'
    ]);

    const fileTree = useMemo(() => {
        const root: FolderNode = { name: 'root', path: '', type: 'folder', children: {} };

        Object.keys(files).forEach(filePath => {
            const parts = filePath.split('/').filter(Boolean);
            let current = root;

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;
                const path = '/' + parts.slice(0, index + 1).join('/');

                if (isFile) {
                    current.children[part] = { name: part, path, type: 'file' };
                } else {
                    if (!current.children[part]) {
                        current.children[part] = { name: part, path, type: 'folder', children: {} };
                    }
                    current = current.children[part] as FolderNode;
                }
            });
        });

        return root;
    }, []);

    const sortNodes = (nodes: Record<string, FileNode | FolderNode>) => {
        return Object.values(nodes).sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        });
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>EXPLORER</div>
            <div style={{ paddingBottom: '20px' }}>
                <FolderItem name="vanilla-extract-agent" defaultOpen>
                    {sortNodes(fileTree.children).map(node => (
                        <RecursiveNode key={node.path} node={node} />
                    ))}
                </FolderItem>
            </div>
        </aside>
    );
}

function RecursiveNode({ node }: { node: FileNode | FolderNode }) {
    if (node.type === 'file') {
        return <FileItem name={node.name} />;
    }

    const sortedChildren = Object.values((node as FolderNode).children).sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
    });

    return (
        <FolderItem name={node.name} defaultOpen={false}>
            {sortedChildren.map(child => (
                <RecursiveNode key={child.path} node={child} />
            ))}
        </FolderItem>
    );
}

function FolderItem({ name, children, defaultOpen = false }: { name: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{ marginLeft: '12px' }}>
            <div
                className={styles.fileItem}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                style={{ opacity: 0.9, gap: '6px' }}
            >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {isOpen ? <FolderOpen size={14} color="#FBBF24" fill="#FBBF24" fillOpacity={0.2} /> : <Folder size={14} color="#FBBF24" fill="#FBBF24" fillOpacity={0.2} />}
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{name}</span>
            </div>
            {isOpen && <div style={{ borderLeft: '1px solid rgba(0,0,0,0.06)', marginLeft: '6px' }}>{children}</div>}
        </div>
    );
}

function FileItem({ name, active }: { name: string, active?: boolean }) {
    const getIcon = (name: string) => {
        if (name.endsWith('.tsx') || name.endsWith('.ts')) return <FileCode size={14} color="#60A5FA" />;
        if (name.endsWith('.css.ts')) return <FileType size={14} color="#EC4899" />; // Vanilla
        if (name.endsWith('.json')) return <FileJson size={14} color="#FCD34D" />;
        return <FileCode size={14} color="#9CA3AF" />;
    };

    return (
        <div
            className={`${styles.fileItem} ${active ? styles.activeFile : ''}`}
            style={{ paddingLeft: '28px', gap: '8px' }}
        >
            {getIcon(name)}
            <span>{name}</span>
        </div>
    );
}
