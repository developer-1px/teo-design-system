import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as styles from "./DocsLayout.css";
// Use new Primitives instead of legacy Text
import { Icon } from "@/ui/primitives/Icon";
import { BookOpen } from "lucide-react";

interface DocsLayoutProps {
    children: React.ReactNode;
}

// Map logical paths to route paths
// We will implement the routes in DocsApp.tsx
// Map logical paths to route paths
// We will implement the routes in DocsApp.tsx
const NAV_ITEMS = [
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
            // Added Hooks link
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

export function DocsLayout({ children }: DocsLayoutProps) {
    const location = useLocation();

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Icon src={BookOpen} size={20} />
                    <span className={styles.sidebarTitle}>Documentation</span>
                </div>

                {NAV_ITEMS.map((section) => (
                    <div key={section.title} className={styles.navSection}>
                        <div className={styles.navSectionTitle}>{section.title}</div>
                        {section.items.map((item) => {
                            // Check if active (handle sub-routes for hooks)
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </aside>

            <main className={styles.main}>
                <div className={styles.contentContainer}>
                    {children}
                </div>
            </main>

            <aside className={styles.toc}>
                <div className={styles.tocTitle}>
                    On this page
                </div>
                {/* 
                   Ideally we parse headings from children or use a Context to report headings.
                   For now, this is a placeholder for the ToC feature.
                */}
            </aside>
        </div>
    );
}
