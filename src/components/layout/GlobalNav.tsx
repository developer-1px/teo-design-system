import { NavLink } from 'react-router-dom';
import { Mail, Code2, Book, Presentation, LayoutList, LayoutDashboard } from 'lucide-react';
import * as styles from './GlobalNav.css';
import { ThemeToggle } from '../ThemeToggle';

export function GlobalNav() {
    return (
        <nav className={styles.navContainer}>
            <NavItem to="/docs" icon={Book} label="Docs" />
            <NavItem to="/mail" icon={Mail} label="Mail" />
            <NavItem to="/editor" icon={Code2} label="Editor" />
            <NavItem to="/slides" icon={Presentation} label="Slides" />
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dash" />
            <NavItem to="/admin" icon={LayoutList} label="Admin" />

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
