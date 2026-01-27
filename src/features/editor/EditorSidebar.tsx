import { ChevronDown, ChevronRight, FileCode, Folder, FolderOpen, FileJson, FileType } from 'lucide-react';
import * as styles from './EditorSidebar.css';
import { useMemo, useState } from 'react';
import { vars } from '../../styles/vars.css';

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
    ], { query: '?raw', import: 'default' });

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
            <div style={{ paddingBottom: vars.spacing[20] }}>
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
        <div>
            <div
                className={styles.folderHeader}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            >
                {isOpen ? <ChevronDown size={14} color={vars.color.gray600} /> : <ChevronRight size={14} color={vars.color.gray600} />}
                <div style={{ width: 4 }} />
                {isOpen ?
                    <FolderOpen size={14} color={vars.color.gray800} fill={vars.color.gray800} fillOpacity={0.2} /> :
                    <Folder size={14} color={vars.color.gray800} fill={vars.color.gray800} fillOpacity={0.2} />
                }
                <div style={{ width: 6 }} />
                <span>{name}</span>
            </div>
            {isOpen && <div className={styles.folderContent}>{children}</div>}
        </div>
    );
}

function FileItem({ name, active }: { name: string, active?: boolean }) {
    const getIcon = (name: string) => {
        if (name.endsWith('.tsx') || name.endsWith('.ts')) return <FileCode size={14} color={vars.color.gray600} />;
        if (name.endsWith('.css.ts')) return <FileType size={14} color={vars.color.gray600} />;
        if (name.endsWith('.json')) return <FileJson size={14} color={vars.color.gray600} />;
        return <FileCode size={14} color={vars.color.gray300} />;
    };

    return (
        <div
            className={`${styles.fileItem} ${active ? styles.activeFile : ''}`}
        >
            <div style={{ width: 14 }} />
            {/* Indent to match chevron */}
            <div style={{ width: 4 }} />
            {getIcon(name)}
            <div style={{ width: 8 }} />
            <span>{name}</span>
        </div>
    );
}
