import * as styles from '../StoryblokLayout.css';
import { type StoryblokComponent, COMPONENT_TYPES } from '../types';
import { Box, Layers, Layout, Type, Plus } from 'lucide-react';

interface SidebarProps {
    blocks: StoryblokComponent[];
    selectedId: string | null;
    hoveredId: string | null;
    onSelect: (id: string) => void;
    onHover: (id: string | null) => void;
    onAdd: (type: string) => void;
}

const ICONS: Record<string, any> = {
    [COMPONENT_TYPES.HERO]: Box,
    [COMPONENT_TYPES.GRID]: Layout,
    [COMPONENT_TYPES.FEATURE]: Layers,
    [COMPONENT_TYPES.TEASER]: Type,
    [COMPONENT_TYPES.TEXT]: Type,
};

export function Sidebar({ blocks, selectedId, hoveredId, onSelect, onHover, onAdd }: SidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <span>Content Tree</span>
                <Layers size={14} />
            </div>

            <div className={styles.blockTree}>
                <div className={styles.sectionTitle}>
                    Body
                </div>
                {blocks.map((block) => {
                    const Icon = ICONS[block.component] || Box;
                    return (
                        <div
                            key={block._uid}
                            className={styles.blockTreeItem}
                            data-active={block._uid === selectedId}
                            data-hovered={block._uid === hoveredId}
                            onClick={() => onSelect(block._uid)}
                            onMouseEnter={() => onHover(block._uid)}
                            onMouseLeave={() => onHover(null)}
                        >
                            <Icon size={14} style={{ opacity: 0.7 }} />
                            <span>{block.component}</span>
                            <span className={styles.helperText}>
                                {block._uid.slice(0, 4)}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className={styles.sidebarHeader} style={{ marginTop: 'auto', borderTop: 'none' }}>
                <span>Add Component</span>
            </div>
            <div className={styles.blockTree} style={{ flex: 'none', paddingBottom: '20px' }}>
                {Object.values(COMPONENT_TYPES).map(type => (
                    <div
                        key={type}
                        className={styles.blockTreeItem}
                        onClick={() => onAdd(type)}
                    >
                        <Plus size={14} />
                        <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
