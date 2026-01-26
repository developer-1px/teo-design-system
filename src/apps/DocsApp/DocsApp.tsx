import { Route, Routes, Navigate } from "react-router-dom";
import { DocsShell, type NavGroup } from "./shell/DocsShell";
import { MDXProviderWrapper } from "./MDXComponents";
import { HeadlessDocsPage } from "@/docs/HeadlessDocsPage";

// Markdown Imports
import Why from "../../../docs/core/why.md";
import Essence from "../../../docs/core/project-essence.prd.md";
import AiLayout from "../../../docs/core/ai_layout_methodology_proposal.md";
import BoxModel from "../../../docs/core/IDDL_Box_Prop_Refinement.md";
import Surface from "../../../docs/core/interactive_surface_pattern_ko.md";
import DesignRules from "../../../docs/core/design-rules.prd.md";
import Refactoring from "../../../docs/core/refactoring.PRD.md";

const NAV_CONFIG: NavGroup[] = [
    {
        title: "Manifesto",
        items: [
            { label: "Why Antigravity", path: "/docs/manifesto/why" },
            { label: "Project Essence", path: "/docs/manifesto/essence" },
        ]
    },
    {
        title: "Best Practices",
        items: [
            { label: "AI Layout Methodology", path: "/docs/best/ai-layout" },
            { label: "Box Model Refinement", path: "/docs/best/box-model" },
            { label: "Surface Strategy (Red/Blue)", path: "/docs/best/surface-strategy" },
        ]
    },
    {
        title: "Architecture",
        items: [
            { label: "Surface Intent System", path: "/docs/architecture/surface-intent" },
            { label: "Headless Hooks", path: "/docs/hooks" },
        ]
    },
    {
        title: "Specifications (PRD)",
        items: [
            { label: "Design Rules", path: "/docs/spec/design-rules" },
            { label: "CSS Pattern", path: "/docs/spec/css-pattern" },
            { label: "Refactoring Plan", path: "/docs/spec/refactoring" },
        ]
    }
];

// Layout Wrapper for Markdown Content
function MarkdownPage({ Component }: { Component: React.ComponentType }) {
    return (
        <DocsShell navItems={NAV_CONFIG}>
            <MDXProviderWrapper>
                <Component />
            </MDXProviderWrapper>
        </DocsShell>
    );
}

export function DocsApp() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="manifesto/why" replace />} />

            {/* Headless Hooks - Now wrapped by its own or shared shell logic. */}
            <Route path="hooks/*" element={<HeadlessDocsPage navItems={NAV_CONFIG} />} />

            {/* Markdown Routes */}
            <Route path="manifesto/why" element={<MarkdownPage Component={Why} />} />
            <Route path="manifesto/essence" element={<MarkdownPage Component={Essence} />} />

            <Route path="best/ai-layout" element={<MarkdownPage Component={AiLayout} />} />
            <Route path="best/box-model" element={<MarkdownPage Component={BoxModel} />} />
            <Route path="best/surface-strategy" element={<MarkdownPage Component={Surface} />} />

            {/* Placeholder for missing files */}
            <Route path="architecture/surface-intent" element={<MarkdownPage Component={() => <div>Unavailable</div>} />} />

            <Route path="spec/design-rules" element={<MarkdownPage Component={DesignRules} />} />
            <Route path="spec/refactoring" element={<MarkdownPage Component={Refactoring} />} />
            <Route path="spec/css-pattern" element={<MarkdownPage Component={() => <div>Unavailable</div>} />} />

            <Route path="*" element={<DocsShell navItems={NAV_CONFIG}><div>Document not found</div></DocsShell>} />
        </Routes>
    );
}
