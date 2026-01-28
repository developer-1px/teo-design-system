import { NavLink } from 'react-router-dom';
import { Mail, Code2, Book, Presentation, LayoutList, Blocks, Database, GitMerge, Layout } from 'lucide-react';
import * as styles from './GlobalNav.css';
import { ThemeToggle } from '../ThemeToggle';

export function GlobalNav() {
    return (
        <nav className={styles.navContainer}>
            <NavItem to="/docs" icon={Book} label="Docs" />
            <NavItem to="/components" icon={Blocks} label="Components" />
            <NavItem to="/mail" icon={Mail} label="Mail" />
            <NavItem to="/editor" icon={Code2} label="Editor" />
            <NavItem to="/slides" icon={Presentation} label="Slides" />

            <NavItem to="/admin" icon={LayoutList} label="Admin" />
            <NavItem to="/admin/studio" icon={Database} label="Studio" />
            <NavItem to="/admin/studio/designer" icon={Layout} label="Designer" />
            <NavItem to="/admin/studio/templates" icon={Blocks} label="Templates" />
            <NavItem to="/admin/flow" icon={GitMerge} label="Flow" />
            <NavItem to="/admin/flow2" icon={GitMerge} label="F2 (List)" />
            <NavItem to="/storyblok" icon={Code2} label="CMS" />

            <div className={styles.bottomSpacer}>
                <ThemeToggle />
            </div>
        </nav>
    );
}

function NavItem({ to, icon: Icon }: { to: string, icon: any, label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
            }
        >
            <Icon size={18} strokeWidth={2} />
        </NavLink>
    );
}
