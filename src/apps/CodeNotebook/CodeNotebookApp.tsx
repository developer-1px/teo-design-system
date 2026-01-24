// ... imports same
import { useState, useEffect } from "react";
import { parseSourceToCells, type Cell } from "./utils/notebookParser";
import { NotebookCell } from "./components/NotebookCell";
import { CodeNotebookHeader } from "./components/CodeNotebookHeader";

// ... SAMPLE_SOURCE same ...
const SAMPLE_SOURCE = `
/**
 * # Headless Table Hook
 * 
 * This hook provides the core logic for a spreadsheet-like table component.
 * It strictly separates logic from UI, following the "Headless" architecture.
 */
import { useState, useCallback } from "react";

/**
 * ## Core Types
 * 
 * We define the essential data structures for the table state.
 */
export interface CellPosition {
    row: number;
    col: number;
}

export interface SelectionRange {
    start: CellPosition;
    end: CellPosition;
}

/**
 * ## The Hook Implementation
 * 
 * The hook accepts data and columns, and returns a set of actions and state.
 * Note how we use 'prop getters' to easily integrate with any UI.
 */
export function useHeadlessTable<T>(data: T[], columns: string[]) {
    // State initialization
    const [cursor, setCursor] = useState<CellPosition>({ row: 0, col: 0 });
    
    // ... implementation details ...
    
    return {
       cursor,
       // ...
    };
}
`;

export function CodeNotebookApp() {
    const [cells, setCells] = useState<Cell[]>([]);

    useEffect(() => {
        // In a real app, this might load a file from disk or network
        const parsed = parseSourceToCells(SAMPLE_SOURCE);
        setCells(parsed);
    }, []);

    return (
        <Frame layout={Layout.Col.Stretch.Start} style={{ backgroundColor: "var(--surface-base)", height: "100vh", width: "100vw" }}>
            <CodeNotebookHeader />

            {/* Notebook Content */}
            <Frame
                layout={Layout.Col.Stretch.Start}
                override={{ p: Space.n32, gap: Space.n24 }}
                style={{ overflowY: "auto", alignItems: "center", width: "100%" }}
            >
                <Frame override={{ gap: Space.n24 }} style={{ margin: "0 auto", width: "680px", maxWidth: "100%" }}>
                    {cells.map(cell => (
                        <NotebookCell key={cell.id} cell={cell} />
                    ))}
                </Frame>
            </Frame>
        </Frame>
    );
}
