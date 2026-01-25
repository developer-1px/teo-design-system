import React, { useRef } from "react";
import { useHeadlessGrid } from "../ui/hooks/use-headless-grid";
// import { vars } from "../ui/theme.css";

// Temporary Inline Styles to leverage the Theme Contract effectively later
// For now, we use standard CSS-in-JS style object for the playground

const CELL_WIDTH = 100;
const CELL_HEIGHT = 32;

export const GridPlayground = () => {
    const ROWS = 50;
    const COLS = 26; // A-Z

    const { cursor, selection, handleKeyDown } = useHeadlessGrid({
        rowCount: ROWS,
        colCount: COLS,
    });

    // Focusable container
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            role="grid"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                display: "grid",
                gridTemplateColumns: `50px repeat(${COLS}, ${CELL_WIDTH}px)`,
                gridAutoRows: `${CELL_HEIGHT}px`,
                width: "100%",
                height: "100vh",
                overflow: "auto",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
            }}
        >
            {/* Header Row */}
            <div style={{ background: "#f5f5f5", borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }} />
            {Array.from({ length: COLS }).map((_, c) => (
                <div
                    key={`header-${c}`}
                    style={{
                        background: "#f5f5f5",
                        borderBottom: "1px solid #ddd",
                        borderRight: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#666",
                    }}
                >
                    {String.fromCharCode(65 + c)}
                </div>
            ))}

            {/* Grid Body */}
            {Array.from({ length: ROWS }).map((_, r) => (
                <React.Fragment key={`row-${r}`}>
                    {/* Row Header */}
                    <div
                        style={{
                            background: "#f5f5f5",
                            borderBottom: "1px solid #ddd",
                            borderRight: "1px solid #ddd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#666",
                        }}
                    >
                        {r + 1}
                    </div>

                    {/* Cells */}
                    {Array.from({ length: COLS }).map((_, c) => {
                        const isFocused = cursor.row === r && cursor.col === c;
                        const isSelected =
                            selection &&
                            r >= selection.start.row &&
                            r <= selection.end.row &&
                            c >= selection.start.col &&
                            c <= selection.end.col;

                        return (
                            <div
                                key={`${r}-${c}`}
                                style={{
                                    borderBottom: "1px solid #eee",
                                    borderRight: "1px solid #eee",
                                    background: isFocused
                                        ? "rgba(0, 122, 255, 0.1)"
                                        : isSelected
                                            ? "rgba(0, 122, 255, 0.05)"
                                            : "white",
                                    border: isFocused ? "2px solid #007AFF" : undefined,
                                    zIndex: isFocused ? 10 : 1,
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 8px",
                                    cursor: "default",
                                }}
                            >
                                {/* Cell Content (Empty for now) */}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    );
};

export default GridPlayground;
