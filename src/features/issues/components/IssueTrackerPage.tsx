import React, { useState } from 'react';
import {
    Circle,
    CircleCheck,
    CircleDot,
    CircleDashed,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Inbox,
    User,
    AlertCircle,
    Clock,
    Layers,
    Star
} from 'lucide-react';
import * as styles from './IssueTrackerPage.css';
import { Button } from '../../../components/primitives/Button';
import { TextInput } from '../../../components/primitives/TextInput';

// ============================================
// TYPES
// ============================================

interface Issue {
    id: string;
    title: string;
    status: 'backlog' | 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_ISSUES: Issue[] = [
    { id: 'ISS-101', title: 'Update navigation icons for better accessibility', status: 'in-progress', priority: 'medium', createdAt: '2h ago' },
    { id: 'ISS-102', title: 'Fix layout bug in Safari when using flexbox', status: 'todo', priority: 'high', createdAt: '4h ago' },
    { id: 'ISS-103', title: 'Add dark mode support to charts and graphs', status: 'backlog', priority: 'low', createdAt: '1d ago' },
    { id: 'ISS-104', title: 'Release v2.0.0 with new component library', status: 'done', priority: 'urgent', createdAt: '2d ago' },
    { id: 'ISS-105', title: 'Refactor authentication provider hooks', status: 'todo', priority: 'medium', createdAt: '3d ago' },
    { id: 'ISS-106', title: 'Implement keyboard shortcuts for power users', status: 'in-progress', priority: 'high', createdAt: '3d ago' },
    { id: 'ISS-107', title: 'Create onboarding flow for new users', status: 'backlog', priority: 'medium', createdAt: '5d ago' },
    { id: 'ISS-108', title: 'Optimize bundle size by removing unused deps', status: 'done', priority: 'low', createdAt: '1w ago' },
];

// ============================================
// STATUS CONFIG
// ============================================

const STATUS_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
    'backlog': { icon: CircleDashed, color: '#a1a1aa', label: 'Backlog' },
    'todo': { icon: Circle, color: '#71717a', label: 'Todo' },
    'in-progress': { icon: CircleDot, color: '#eab308', label: 'In Progress' },
    'done': { icon: CircleCheck, color: '#22c55e', label: 'Done' },
};

const PRIORITY_COLORS: Record<string, string> = {
    'low': '#3b82f6',
    'medium': '#eab308',
    'high': '#f97316',
    'urgent': '#ef4444',
};

// ============================================
// MAIN COMPONENT
// ============================================

export function IssueTrackerPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredIssues = MOCK_ISSUES.filter(issue => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return issue.status !== 'done';
        return issue.status === activeFilter;
    });

    return (
        <>
            <div className={styles.container}>
                <div className={styles.layout}>
                    {/* SIDEBAR */}
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarSection}>
                            <NavItem
                                icon={Inbox}
                                label="All Issues"
                                active={activeFilter === 'all'}
                                onClick={() => setActiveFilter('all')}
                                count={MOCK_ISSUES.length}
                            />
                            <NavItem
                                icon={User}
                                label="My Issues"
                                active={activeFilter === 'my'}
                                onClick={() => setActiveFilter('my')}
                                count={3}
                            />
                            <NavItem
                                icon={Star}
                                label="Starred"
                                active={activeFilter === 'starred'}
                                onClick={() => setActiveFilter('starred')}
                            />
                        </div>

                        <div className={styles.sidebarLabel}>Status</div>
                        <div className={styles.sidebarSection}>
                            <NavItem
                                icon={CircleDashed}
                                label="Backlog"
                                active={activeFilter === 'backlog'}
                                onClick={() => setActiveFilter('backlog')}
                                count={MOCK_ISSUES.filter(i => i.status === 'backlog').length}
                            />
                            <NavItem
                                icon={Circle}
                                label="Todo"
                                active={activeFilter === 'todo'}
                                onClick={() => setActiveFilter('todo')}
                                count={MOCK_ISSUES.filter(i => i.status === 'todo').length}
                            />
                            <NavItem
                                icon={CircleDot}
                                label="In Progress"
                                active={activeFilter === 'in-progress'}
                                onClick={() => setActiveFilter('in-progress')}
                                count={MOCK_ISSUES.filter(i => i.status === 'in-progress').length}
                            />
                            <NavItem
                                icon={CircleCheck}
                                label="Done"
                                active={activeFilter === 'done'}
                                onClick={() => setActiveFilter('done')}
                                count={MOCK_ISSUES.filter(i => i.status === 'done').length}
                            />
                        </div>

                        <div className={styles.sidebarLabel}>Priority</div>
                        <div className={styles.sidebarSection}>
                            <NavItem icon={AlertCircle} label="Urgent" active={false} count={1} />
                            <NavItem icon={Layers} label="High" active={false} count={2} />
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className={styles.main}>
                        {/* HEADER */}
                        <header className={styles.header}>
                            <div className={styles.headerLeft}>
                                <h1 className={styles.title}>Issues</h1>
                                <span className={styles.issueCount}>{filteredIssues.length} issues</span>
                            </div>
                            <div className={styles.headerActions}>
                                <Button variant="primary" size="sm" startIcon={<Plus size={14} />}>
                                    New Issue
                                </Button>
                            </div>
                        </header>

                        {/* TOOLBAR */}
                        <div className={styles.toolbar}>
                            <div className={styles.searchContainer}>
                                <TextInput
                                    placeholder="Search issues..."
                                    startIcon={<Search size={14} />}
                                />
                            </div>
                            <div className={styles.filterGroup}>
                                <Button variant="ghost" size="sm" startIcon={<Filter size={14} />}>
                                    Filter
                                </Button>
                            </div>
                        </div>

                        {/* LIST HEADER */}
                        <div className={styles.listHeader}>
                            <span>ID</span>
                            <span>Title</span>
                            <span>Status</span>
                            <span>Priority</span>
                            <span>Created</span>
                            <span></span>
                        </div>

                        {/* ISSUE LIST */}
                        <div className={styles.listContainer}>
                            {filteredIssues.map(issue => (
                                <IssueRow key={issue.id} issue={issue} />
                            ))}
                        </div>

                        {/* KEYBOARD HINTS FOOTER */}
                        <footer className={styles.footer}>
                            <div className={styles.keyboardHint}>
                                <span className={styles.kbd}>C</span>
                                <span>New Issue</span>
                            </div>
                            <div className={styles.keyboardHint}>
                                <span className={styles.kbd}>K</span>
                                <span>Command Palette</span>
                            </div>
                            <div className={styles.keyboardHint}>
                                <span className={styles.kbd}>?</span>
                                <span>Help</span>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </>
    );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function NavItem({ icon: Icon, label, active, count, onClick }: any) {
    return (
        <div
            className={`${styles.navItem} ${active ? styles.activeNavItem : ''}`}
            onClick={onClick}
        >
            <Icon size={14} strokeWidth={active ? 2.5 : 2} />
            <span style={{ flex: 1 }}>{label}</span>
            {count !== undefined && (
                <span className={styles.navItemCount}>{count}</span>
            )}
        </div>
    );
}

function IssueRow({ issue }: { issue: Issue }) {
    const statusConfig = STATUS_CONFIG[issue.status];
    const StatusIcon = statusConfig.icon;
    const priorityColor = PRIORITY_COLORS[issue.priority];

    return (
        <div className={styles.issueRow}>
            <span className={styles.issueId}>{issue.id}</span>
            <span className={styles.issueTitle}>{issue.title}</span>
            <div className={styles.statusCell}>
                <StatusIcon size={14} style={{ color: statusConfig.color }} strokeWidth={2} />
                <span className={styles.statusLabel}>{statusConfig.label}</span>
            </div>
            <div className={styles.priorityCell}>
                <div className={styles.priorityBar} style={{ background: priorityColor }} />
                <span className={styles.statusLabel}>{issue.priority}</span>
            </div>
            <span className={styles.dateCell}>{issue.createdAt}</span>
            <div className={styles.actionsCell}>
                <Button variant="ghost" size="icon_sm">
                    <MoreHorizontal size={14} />
                </Button>
            </div>
        </div>
    );
}
