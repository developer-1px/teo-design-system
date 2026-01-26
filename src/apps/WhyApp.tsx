import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    ContainerSize,
    Radius,
    Size,
    Space,
} from "@/legacy-design-system/token/token.const.1tier";
import { Radius2 } from "@/legacy-design-system/token/radius2";

export function WhyApp() {
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch("/docs/why-vanilla-extract.md")
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                height: "100%",
                overflowY: "auto",
                backgroundColor: "var(--surface-base)",
                paddingBottom: Space.n96,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    maxWidth: ContainerSize.n800,
                    padding: Space.n40,
                    gap: Space.n24,
                }}
            >
                <div style={{ backgroundColor: "var(--surface-primary)", padding: Space.n8, borderRadius: Radius.n8 }}>
                    <span style={{ color: "white", fontFamily: "monospace", fontSize: "14px" }}>Why?</span>
                </div>

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1
                                style={{
                                    marginTop: "var(--space-n32)",
                                    marginBottom: "var(--space-n16)",
                                    fontSize: "32px",
                                    fontWeight: 700,
                                    color: "var(--text-primary)"
                                }}
                            >
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => (
                            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: Space.n16, marginTop: "var(--space-n32)", marginBottom: "var(--space-n16)" }}>
                                <div style={{ height: 1, width: "100%", backgroundColor: "var(--surface-overlay)" }} />
                                <h2 style={{ fontSize: "24px", fontWeight: 600, color: "var(--text-primary)" }}>{children}</h2>
                            </div>
                        ),
                        h3: ({ children }) => (
                            <h3 style={{ marginTop: "var(--space-n24)", marginBottom: "var(--space-n8)", fontSize: "20px", fontWeight: 600, color: "var(--text-primary)" }}>
                                {children}
                            </h3>
                        ),
                        p: ({ children }) => (
                            <p
                                style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "16px" }}
                            >
                                {children}
                            </p>
                        ),
                        ul: ({ children }) => (
                            <ul style={{ paddingLeft: "var(--space-n24)", margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-n8)" }}>
                                {children}
                            </ul>
                        ),
                        li: ({ children }) => (
                            <li style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                                {children}
                            </li>
                        ),
                        code: ({ children }) => (
                            <code
                                style={{
                                    backgroundColor: "var(--surface-sunken)",
                                    padding: "0.2em 0.4em",
                                    borderRadius: "var(--radius-n4)",
                                    fontFamily: "monospace",
                                    fontSize: "0.9em",
                                    color: "var(--text-primary)",
                                }}
                            >
                                {children}
                            </code>
                        ),
                        table: ({ children }) => (
                            <div
                                style={{
                                    width: "100%",
                                    marginTop: "var(--space-n24)",
                                    marginBottom: "var(--space-n24)",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "var(--radius-n8)",
                                    overflow: "hidden"
                                }}
                            >
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    {children}
                                </table>
                            </div>
                        ),
                        thead: ({ children }) => (
                            <thead style={{ backgroundColor: "var(--surface-sunken)" }}>
                                {children}
                            </thead>
                        ),
                        th: ({ children }) => (
                            <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontWeight: 600, color: "var(--text-primary)", fontSize: "14px", fontFamily: "monospace" }}>
                                {children}
                            </th>
                        ),
                        td: ({ children }) => (
                            <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                                <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>{children}</span>
                            </td>
                        ),
                        blockquote: ({ children }) => (
                            <div
                                style={{
                                    backgroundColor: "var(--surface-sunken)",
                                    borderRadius: Radius2.md,
                                    padding: Space.n16,
                                    width: "100%",
                                    borderLeft: "4px solid var(--surface-primary)",
                                    marginTop: "var(--space-n16)",
                                    marginBottom: "var(--space-n16)"
                                }}
                            >
                                {children}
                            </div>
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
