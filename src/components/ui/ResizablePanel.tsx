import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as styles from './ResizablePanel.css';
import { clsx } from 'clsx';

export interface ResizablePanelProps {
    direction?: 'horizontal' | 'vertical';
    initialSplit?: number; // percentage 0-100
    minSplit?: number; // min percentage
    maxSplit?: number; // max percentage
    className?: string;
    style?: React.CSSProperties;
    children: [React.ReactNode, React.ReactNode]; // Exactly 2 children
}

export const ResizablePanel = ({
    direction = 'horizontal',
    initialSplit = 50,
    minSplit = 10,
    maxSplit = 90,
    className,
    style,
    children
}: ResizablePanelProps) => {
    const [split, setSplit] = useState(initialSplit);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        let newSplit = 0;

        if (direction === 'horizontal') {
            const relativeX = e.clientX - containerRect.left;
            newSplit = (relativeX / containerRect.width) * 100;
        } else {
            const relativeY = e.clientY - containerRect.top;
            newSplit = (relativeY / containerRect.height) * 100;
        }

        // Clamp
        if (newSplit < minSplit) newSplit = minSplit;
        if (newSplit > maxSplit) newSplit = maxSplit;

        setSplit(newSplit);
    }, [isDragging, direction, minSplit, maxSplit]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const [pane1, pane2] = children;

    return (
        <div
            ref={containerRef}
            className={clsx(styles.container({ direction }), className)}
            style={style}
        >
            <div
                className={styles.pane}
                style={direction === 'horizontal' ? { width: `${split}%` } : { height: `${split}%` }}
            >
                {pane1}
            </div>

            <div
                className={styles.handle({ direction, active: isDragging })}
                onMouseDown={handleMouseDown}
            />

            <div
                className={styles.pane}
                style={direction === 'horizontal' ? { width: `${100 - split}%` } : { height: `${100 - split}%` }}
            >
                {pane2}
            </div>
        </div>
    );
};
