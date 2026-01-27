import React, { type ReactNode } from 'react';
import * as styles from './VisualFrame.css';

interface VisualFrameProps {
    children: ReactNode;
    label?: string;
    isSelected?: boolean;
    isHovered?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    className?: string; // Allow extending
}

/**
 * VisualFrame (Editor Primitive)
 * 
 * Wraps content with a standard "Visual Editor" interaction layer.
 * Provides:
 * - Dashed outline on hover
 * - Solid outline on selection
 * - "Inspector Chip" label
 */
export function VisualFrame({
    children,
    label,
    isSelected = false,
    isHovered = false,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className
}: VisualFrameProps) {
    let variant: 'hover' | 'selected' | undefined;
    if (isSelected) variant = 'selected';
    else if (isHovered) variant = 'hover';

    return (
        <div
            className={`${styles.frame} ${className || ''}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="button"
            tabIndex={0}
        >
            {/* Overlay Layer */}
            <div className={styles.outline} data-variant={variant} />

            {/* Inspector Label */}
            {label && (
                <div className={styles.label}>{label}</div>
            )}

            {/* Content */}
            {children}
        </div>
    );
}
