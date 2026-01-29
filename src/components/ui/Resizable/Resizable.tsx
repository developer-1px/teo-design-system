import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import * as styles from './Resizable.css';
import { clsx } from 'clsx';

// --- CONTEXT ---
interface ResizableContextValue {
    direction: 'horizontal' | 'vertical';
    registerPanel: (id: string, initialSize: number) => void;
    unregisterPanel: (id: string) => void;
    getPanelSize: (id: string) => number;
    startResizing: (handleId: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

// --- PANEL GROUP ---
interface PanelGroupProps {
    direction?: 'horizontal' | 'vertical';
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const PanelGroup = ({ direction = 'horizontal', children, className, style }: PanelGroupProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [panelSizes, setPanelSizes] = useState<{ [id: string]: number }>({});
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const panelOrderRef = useRef<string[]>([]);


    const registerPanel = useCallback((id: string, initialSize: number) => {
        setPanelSizes(prev => {
            if (prev[id] !== undefined) return prev;
            return { ...prev, [id]: initialSize };
        });
        // We ensure order by checking if it's already there, but order is 
        // determined by the order of registration (which matches render order)
        if (!panelOrderRef.current.includes(id)) {
            panelOrderRef.current.push(id);
        }
    }, []);

    const unregisterPanel = useCallback((id: string) => {
        setPanelSizes(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        panelOrderRef.current = panelOrderRef.current.filter(pid => pid !== id);
    }, []);

    const getPanelSize = useCallback((id: string) => panelSizes[id] || 0, [panelSizes]);

    const startResizing = useCallback((handleId: string) => {
        setIsResizing(handleId);
    }, []);

    // We'll use a ref for panelSizes to avoid closing over stale state in the mousemove listener
    // This is crucial for performance and preventing the 'jump' or 'stop' behavior
    const panelSizesRef = useRef(panelSizes);
    useEffect(() => {
        panelSizesRef.current = panelSizes;
    }, [panelSizes]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing || !containerRef.current) return;

        const handleIdx = parseInt(isResizing.split('-')[1]);
        const prevPanelId = panelOrderRef.current[handleIdx];
        const nextPanelId = panelOrderRef.current[handleIdx + 1];

        if (!prevPanelId || !nextPanelId) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;

        // Calculate the new split point as a percentage of the container
        const relativePos = direction === 'horizontal'
            ? (currentPos - containerRect.left) / containerRect.width
            : (currentPos - containerRect.top) / containerRect.height;

        const relativePercent = relativePos * 100;

        setPanelSizes(prev => {
            const prevPanelIdx = panelOrderRef.current.indexOf(prevPanelId);

            // Calculate current start position of the prev panel in %
            let prevStartPercent = 0;
            for (let i = 0; i < prevPanelIdx; i++) {
                prevStartPercent += prev[panelOrderRef.current[i]];
            }

            const totalPairSize = prev[prevPanelId] + prev[nextPanelId];
            const newPrevSize = relativePercent - prevStartPercent;
            const newNextSize = totalPairSize - newPrevSize;

            // Constraints
            if (newPrevSize < 5 || newNextSize < 5) return prev;

            return {
                ...prev,
                [prevPanelId]: newPrevSize,
                [nextPanelId]: newNextSize
            };
        });
    }, [isResizing, direction]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(null);
    }, []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, direction, handleMouseMove, handleMouseUp]);

    const contextValue = useMemo(() => ({
        direction,
        registerPanel,
        unregisterPanel,
        getPanelSize,
        startResizing,
        containerRef
    }), [direction, registerPanel, unregisterPanel, getPanelSize, startResizing]);

    return (
        <ResizableContext.Provider value={contextValue}>
            <div
                ref={containerRef}
                className={clsx(styles.groupContainer({ direction }), className)}
                style={style}
            >
                {children}
            </div>
        </ResizableContext.Provider>
    );
};

// --- PANEL ---
interface PanelProps {
    id: string;
    defaultSize?: number; // percentage
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Panel = ({ id, defaultSize = 25, children, className, style }: PanelProps) => {
    const context = useContext(ResizableContext);
    if (!context) throw new Error('Panel must be used within a PanelGroup');

    const { registerPanel, unregisterPanel, getPanelSize } = context;

    useEffect(() => {
        registerPanel(id, defaultSize);
        return () => unregisterPanel(id);
    }, [id, defaultSize, registerPanel, unregisterPanel]);

    const size = getPanelSize(id);

    return (
        <div
            className={clsx(styles.panel, className)}
            style={{
                ...style,
                flexBasis: `${size ?? defaultSize}%`,
                flexGrow: 0,
                flexShrink: 0,
            }}
        >
            {children}
        </div>
    );
};

// --- PANEL HANDLE ---
interface PanelHandleProps {
    id: string; // Should be in format "handle-X" where X is the index of the handle
    className?: string;
}

export const PanelHandle = ({ id, className }: PanelHandleProps) => {
    const context = useContext(ResizableContext);
    if (!context) throw new Error('PanelHandle must be used within a PanelGroup');

    const [isActive, setIsActive] = useState(false);

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsActive(true);
        context.startResizing(id);
    };

    // Global mouseup to reset local active state
    useEffect(() => {
        const up = () => setIsActive(false);
        window.addEventListener('mouseup', up);
        return () => window.removeEventListener('mouseup', up);
    }, []);

    return (
        <div
            className={clsx(styles.handle({ direction: context.direction, active: isActive }), className)}
            onMouseDown={onMouseDown}
        />
    );
};
