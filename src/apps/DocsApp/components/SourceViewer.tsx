import { useState, useEffect } from "react";
import { Frame } from "@/legacy-design-system/Frame/Frame";
import { Layout } from "@/legacy-design-system/Frame/Layout/Layout";
import { Space } from "@/legacy-design-system/token/token.const.1tier";
import { Radius2 } from "@/legacy-design-system/token/radius2";
import { Text } from "@/legacy-design-system/text/Text";

interface SourceViewerProps {
    raw: string;
    title?: string;
}

export function SourceViewer({ raw, title }: SourceViewerProps) {
    const [highlighted, setHighlighted] = useState<string>("");

    useEffect(() => {
        // Simple client-side highlighting simulation
        setHighlighted(highlightSyntax(raw));
    }, [raw]);

    return (
        <Frame
            layout={Layout.Col.Stretch.Start}
            rounded={Radius2.lg}
            override={{
                mt: Space.n24,
                mb: Space.n40,
                // Using valid Frame props for borders if defined, or style fallback
            }}
            style={{
                border: "1px solid var(--border-subtle)",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
            }}
        >
            {title && (
                <Frame
                    surface="sunken"
                    override={{
                        px: Space.n20,
                        py: Space.n12,
                        // borderBottom: true (checking if supported, mostly style fallback)
                    }}
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                    <Text.Context.Label>{title}</Text.Context.Label>
                </Frame>
            )}

            <Frame
                surface="base"
                override={{ p: Space.n20 }}
                style={{ overflowX: "auto" }}
            >
                <div style={{ counterReset: "line" }}>
                    <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.6 }}>
                        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                    </pre>
                </div>
            </Frame>
        </Frame>
    );
}

// Reusing the simple highlighter from CodeNotebook for consistency
function highlightSyntax(code: string): string {
    if (!code) return "";

    // Safety check for raw string
    const safeCode = typeof code === 'string' ? code : String(code);

    const keywords = ["import", "from", "export", "class", "interface", "type", "function", "const", "let", "var", "return", "if", "else", "for", "while", "as"];

    let escaped = safeCode
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    keywords.forEach(kw => {
        const regex = new RegExp(`\\b(${kw})\\b`, "g");
        escaped = escaped.replace(regex, `<span style="color: #c678dd; font-weight: bold;">$1</span>`);
    });

    // Simple string highlighting
    escaped = escaped.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, match => `<span style="color: #98c379">${match}</span>`);

    // Simple comment highlighting
    escaped = escaped.replace(/\/\/.*/g, match => `<span style="color: #7f848e; font-style: italic;">${match}</span>`);

    return escaped;
}
