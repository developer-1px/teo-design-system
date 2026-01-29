import React from 'react';
import * as styles from './PList.css';

interface PListProps {
    children: React.ReactNode;
    isRoot?: boolean;
}

export function PList({ children, isRoot = false }: PListProps) {
    return (
        <div className={isRoot ? styles.plistContainer : undefined}>
            {children}
        </div>
    );
}

interface PListRowProps {
    depth: number;
    label: React.ReactNode;
    value: React.ReactNode;
    typeSlot?: React.ReactNode;
    onClick?: () => void;
}

export function PListRow({ depth, label, value, typeSlot, onClick }: PListRowProps) {
    return (
        <div
            className={styles.plistRow}
            data-depth={depth}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div className={styles.plistKey} style={{ paddingLeft: 16 + (depth * 20) }}>
                {label}
            </div>
            {typeSlot && (
                <div className={styles.plistType}>
                    {typeSlot}
                </div>
            )}
            <div className={styles.plistValue}>
                {value}
            </div>
        </div>
    );
}

// Export styles for consumers who need semantic sub-styles (like JsonViewer)
export { styles as PListStyles };
