import { Text } from "@/legacy-design-system/text/Text";
import type { Cell } from "../utils/notebookParser";
import { Radius2 } from "@/legacy-design-system/token/radius2";

interface NotebookCellProps {
    cell: Cell;
}

export function NotebookCell({ cell }: NotebookCellProps) {
    if (cell.type === "markdown") {
        return (
            <Frame override={{ p: Space.n16 }}>
                {/* Simple split by double newline for paragraphs */}
                {cell.content.split("\n\n").map((para, i) => {
                    const isHeader = para.startsWith("#");
                    if (isHeader) {
                        // Simple header parsing
                        const levelMatch = para.match(/^#+/);
                        const level = levelMatch ? levelMatch[0].length : 0;
                        const text = para.replace(/^#+\s*/, "");

                        // Map level roughly to variants - crude but effective for now
                        const variant = level === 1 ? "xl" : level === 2 ? "lg" : "md";

                        return (
                            <Text.Prose.Title key={i} variant={variant} style={{ color: "var(--text-primary)" }}>
                                {text}
                            </Text.Prose.Title>
                        );
                    }
                    return (
                        <Text.Prose.Body key={i} style={{ color: "var(--text-secondary)" }}>
                            {para}
                        </Text.Prose.Body>
                    );
                })}
            </Frame>
        );
    }

    // Code Cell
    return (
        <Frame
            override={{
                p: Space.n16,
            }}
            style={{
                border: "1px solid var(--surface-border)",
                backgroundColor: "var(--surface-canvas)"
            }}
            rounded={Radius2.md}
        >
            <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 13, overflowX: "auto" }}>
                <code dangerouslySetInnerHTML={{ __html: highlightSyntax(cell.content) }} />
            </pre>
        </Frame>
    );
}

// Very basic highlighter for visual flair
function highlightSyntax(code: string): string {
    const keywords = ["import", "from", "export", "class", "interface", "type", "function", "const", "let", "var", "return", "if", "else", "for", "while"];

    // Escape HTML first
    let escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Wrap keywords
    // Note: This is fragile but sufficient for "looking like code"
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b(${kw})\\b`, "g");
        escaped = escaped.replace(regex, `<span style="color: #c678dd; font-weight: bold;">$1</span>`);
    });

    // Comments (if any left inside code block, e.g. inline) are not handled well by simple regex here without breaking tags
    // Skipping complex highlighting for safety.

    return escaped;
}
