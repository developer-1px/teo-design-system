import { useHeadlessHooks } from "./hooks/useHeadlessHooks";
import * as classes from "./HeadlessDocsPage.css";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Route, Routes, useParams } from "react-router-dom";
import { DocsShell, type NavGroup } from "@/apps/DocsApp/shell/DocsShell";

function HookDetail() {
    const { hookName } = useParams();
    const { hooks, loading } = useHeadlessHooks();
    const hook = hooks.find(h => h.name === hookName);

    if (loading) return <div>Loading...</div>;
    if (!hook) return <div>Select a hook to view documentation</div>;

    return (
        <div className={classes.detailContainer}>
            <header className={classes.header}>
                <h1 className={classes.title}>
                    {hook.name}
                </h1>
                <div className={classes.subtitle}>
                    {hook.path.replace('/src/design-system/hooks/', '')}
                </div>
            </header>

            {/* Description */}
            <section className={classes.section}>
                <div className={classes.description}>
                    <ReactMarkdown>{hook.description || '*No description provided via JSDoc.*'}</ReactMarkdown>
                </div>
            </section>

            {/* Parameters */}
            {Object.keys(hook.docParams).length > 0 && (
                <section className={classes.section}>
                    <h2 className={classes.sectionTitle}>Parameters</h2>
                    <div className={classes.paramGrid}>
                        {Object.entries(hook.docParams).map(([param, desc]) => (
                            <div key={param} className={classes.paramCard}>
                                <code className={classes.codeLabel}>{param}</code>
                                <span className={classes.codeSeparator}>-</span>
                                <span className={classes.paramDesc}>{desc}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Example */}
            {hook.example && (
                <section className={classes.section}>
                    <h2 className={classes.sectionTitle}>Example</h2>
                    <div className={classes.codeBlockContainer}>
                        <SyntaxHighlighter language="typescript" style={materialDark} customStyle={{ margin: 0, padding: 24 }}>
                            {hook.example}
                        </SyntaxHighlighter>
                    </div>
                </section>
            )}

            {/* Source Code */}
            <section>
                <h2 className={classes.sectionTitle}>Source Code</h2>
                <div className={classes.codeBlockContainer}>
                    <details>
                        <summary className={classes.viewSourceSummary}>View Source</summary>
                        <SyntaxHighlighter language="typescript" style={materialDark} customStyle={{ margin: 0, padding: 24 }}>
                            {hook.source}
                        </SyntaxHighlighter>
                    </details>
                </div>
            </section>
        </div>
    );
}

export function HeadlessDocsPage({ navItems }: { navItems: NavGroup[] }) {
    return (
        <DocsShell navItems={navItems}>
            <Routes>
                <Route path="/" element={
                    <div className={classes.centerMessage}>
                        Select a hook to view documentation
                    </div>
                } />
                <Route path="/:hookName" element={<HookDetail />} />
            </Routes>
        </DocsShell>
    );
}
