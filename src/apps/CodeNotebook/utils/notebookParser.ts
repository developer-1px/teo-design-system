export type CellType = "markdown" | "code";

export interface Cell {
    id: string;
    type: CellType;
    content: string;
}

/**
 * Parses TypeScript source code into notebook cells
 */
export function parseSourceToCells(source: string): Cell[] {
    const lines = source.split("\n");
    const cells: Cell[] = [];

    let currentBuffer: string[] = [];
    let currentType: CellType | null = null;

    const flush = () => {
        if (currentBuffer.length > 0 && currentType) {
            cells.push({
                id: Math.random().toString(36).substr(2, 9),
                type: currentType,
                content: currentBuffer.join("\n")
            });
        }
        currentBuffer = [];
        currentType = null;
    };

    let inBlockComment = false;

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // 1. Handle Block Comments Start
        if (!inBlockComment && trimmed.startsWith("/**")) {
            // If we were processing code, flush it
            if (currentType === "code") flush();

            // Start markdown cell
            currentType = "markdown";
            inBlockComment = true;

            // If it's a single line block comment /** ... */
            if (trimmed.endsWith("*/") && trimmed.length > 3) {
                const content = trimmed.substring(3, trimmed.length - 2).trim();
                currentBuffer.push(content);
                inBlockComment = false;
                // Don't flush yet, next line might be prose too (e.g. detached comment?) 
                // Actually, usually code follows. Let's keep buffering.
                return;
            }
            return;
        }

        // 2. Handle Block Comment End
        if (inBlockComment) {
            if (trimmed.endsWith("*/")) {
                const content = trimmed.substring(0, trimmed.length - 2).replace(/^\s*\*\s?/, "").trim();
                if (content) currentBuffer.push(content);
                inBlockComment = false;
                // End of block comment usually implies end of prose block for now
                flush();
            } else {
                // Inside block comment: strip leading *
                const content = trimmed.replace(/^\s*\*\s?/, "");
                currentBuffer.push(content);
            }
            return;
        }

        // 3. Handle Line Comments
        if (trimmed.startsWith("//")) {
            // If we were in code, flush it. 
            // NOTE: This treats EVERY comment as a new cell or part of prose. 
            // May be aggressive for inline comments, but requested behavior is "comments as prose".
            if (currentType === "code") flush();

            currentType = "markdown";
            const content = trimmed.substring(2).trim();
            currentBuffer.push(content);
            return;
        }

        // 4. Code Line
        if (currentType === "markdown") flush();

        currentType = "code";
        currentBuffer.push(line); // Keep original indentation for code
    });

    flush();
    return cells;
}
