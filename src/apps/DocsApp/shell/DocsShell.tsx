import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as styles from "./DocsShell.css";
import { Icon } from "@/ui/primitives/Icon";
import { BookOpen } from "lucide-react";

export interface NavItem {
    label: string;
    path: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

interface DocsShellProps {
    children: React.ReactNode;
    navItems: NavGroup[];
}

export function DocsShell({ children, navItems }: DocsShellProps) {
    const location = useLocation();

    return (
        <div className={styles.shell}>
            {/* Header */}
            <header className={styles.header}>
                <Link to="/" className={styles.logo}>
                    <Icon src={BookOpen} size={20} />
                    <span>Antigravity Design</span>
                </Link>
            </header>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
                {navItems.map((group) => (
                    <div key={group.title} className={styles.navGroup}>
                        <div className={styles.navGroupTitle}>{group.title}</div>
                        {group.items.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.contentContainer}>
                    {children}
                </div>
            </main>

            {/* TOC (Placeholder/Future) */}
            <aside className={styles.toc}>
                <div className={styles.tocTitle}>On this page</div>
                {/* To be implemented: Dynamic TOC */}
                <span className={styles.tocLink}>Overview</span>
            </aside>
        </div>
    );
}
