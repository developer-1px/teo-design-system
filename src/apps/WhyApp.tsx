import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Frame } from "@/design-system/Frame/Frame";
import { Layout } from "@/design-system/Frame/Layout/Layout";
import { Text } from "@/design-system/text/Text";
import {
    ContainerSize,
    Radius,
    Size,
    Space,
} from "@/design-system/token/token.const.1tier";
import { Radius2 } from "@/design-system/token/radius2";

export function WhyApp() {
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch("/docs/why-vanilla-extract.md")
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);

    return (
        <Frame
            surface="base"
            layout={Layout.Col.Center.Start}
            w={Size.fill}
            h={Size.fill}
            scroll="y"
            override={{ pb: Space.n96 }}
        >
            <Frame
                layout={Layout.Col.Left.Start}
                override={{
                    w: Size.fill,
                    maxWidth: ContainerSize.n800,
                    p: Space.n40,
                    gap: Space.n24,
                }}
            >
                <Frame surface="primary" override={{ p: Space.n8, r: Radius.n8 }}>
                    <Text.Card.Code style={{ color: "white" }}>Why?</Text.Card.Code>
                </Frame>

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <Text.Prose.Title
                                variant="xl"
                                style={{ marginTop: "var(--space-n32)", marginBottom: "var(--space-n16)" }}
                            >
                                {children}
                            </Text.Prose.Title>
                        ),
                        h2: ({ children }) => (
                            <Frame override={{ w: Size.fill, gap: Space.n16 }} style={{ marginTop: "var(--space-n32)", marginBottom: "var(--space-n16)" }}>
                                <Frame surface="overlay" style={{ height: 1, width: "100%" }} />
                                <Text.Prose.Title variant="lg">{children}</Text.Prose.Title>
                            </Frame>
                        ),
                        h3: ({ children }) => (
                            <Text.Prose.Title variant="md" style={{ marginTop: "var(--space-n24)", marginBottom: "var(--space-n8)" }}>
                                {children}
                            </Text.Prose.Title>
                        ),
                        p: ({ children }) => (
                            <Text.Prose.Body
                                variant="lg"
                                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                            >
                                {children}
                            </Text.Prose.Body>
                        ),
                        ul: ({ children }) => (
                            <ul style={{ paddingLeft: "var(--space-n24)", margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-n8)" }}>
                                {children}
                            </ul>
                        ),
                        li: ({ children }) => (
                            <li style={{ color: "var(--text-secondary)" }}>
                                <Text.Prose.Body variant="lg">{children}</Text.Prose.Body>
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
                            <Frame
                                override={{ w: Size.fill }}
                                style={{ marginTop: "var(--space-n24)", marginBottom: "var(--space-n24)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-n8)", overflow: "hidden" }}
                                rounded={Radius2.lg}
                            >
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    {children}
                                </table>
                            </Frame>
                        ),
                        thead: ({ children }) => (
                            <thead style={{ backgroundColor: "var(--surface-sunken)" }}>
                                {children}
                            </thead>
                        ),
                        th: ({ children }) => (
                            <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontWeight: 600 }}>
                                <Text.Card.Code>{children}</Text.Card.Code>
                            </th>
                        ),
                        td: ({ children }) => (
                            <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                                <Text.Prose.Body variant="md">{children}</Text.Prose.Body>
                            </td>
                        ),
                        blockquote: ({ children }) => (
                            <Frame
                                surface="sunken"
                                rounded={Radius2.md}
                                override={{ p: Space.n16, w: Size.fill }}
                                style={{ borderLeft: "4px solid var(--surface-primary)", marginTop: "var(--space-n16)", marginBottom: "var(--space-n16)" }}
                            >
                                {children}
                            </Frame>
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
            </Frame>
        </Frame>
    );
}
