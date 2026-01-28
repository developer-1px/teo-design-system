import React, { useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import * as styles from './Tree.css.ts';
import { clsx } from 'clsx';
import { vars } from '../../styles/vars.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

export interface TreeNode {
    id: string;
    label: string;
    icon?: React.ReactNode;
    children?: TreeNode[];
    isExpanded?: boolean;
    data?: any;
}

interface TreeProps {
    data: TreeNode[];
    onNodeClick?: (node: TreeNode) => void;
    className?: string;
}

export function Tree({ data, onNodeClick, className }: TreeProps) {
    return (
        <div className={clsx(styles.treeRoot, className)}>
            {data.map(node => (
                <TreeNodeItem
                    key={node.id}
                    node={node}
                    level={0}
                    onNodeClick={onNodeClick}
                />
            ))}
        </div>
    );
}

function TreeNodeItem({ node, level, onNodeClick }: { node: TreeNode, level: number, onNodeClick?: (node: TreeNode) => void }) {
    const [isExpanded, setIsExpanded] = useState(node.isExpanded ?? false);
    const hasChildren = node.children && node.children.length > 0;

    const handleToggle = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }
    };

    const handleClick = () => {
        if (onNodeClick) {
            onNodeClick(node);
        }
    };

    return (
        <div className={styles.nodeWrapper}>
            <div
                className={styles.nodeItem}
                style={assignInlineVars({ [styles.indent]: `${level * 12 + 8}px` })}
                onClick={handleClick}
            >
                <div className={styles.chevronWrapper} onClick={handleToggle}>
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : null}
                </div>
                <div className={styles.iconWrapper}>
                    {node.icon || (hasChildren ? (
                        isExpanded ? <FolderOpen size={14} color={vars.color.blue500} fill={vars.color.blue500} fillOpacity={0.1} /> : <Folder size={14} color={vars.color.blue500} fill={vars.color.blue500} fillOpacity={0.1} />
                    ) : (
                        <File size={14} color={vars.color.gray400} />
                    ))}
                </div>
                <span className={styles.label}>{node.label}</span>
            </div>
            {hasChildren && isExpanded && (
                <div className={styles.childrenWrapper}>
                    {node.children!.map(child => (
                        <TreeNodeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onNodeClick={onNodeClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
