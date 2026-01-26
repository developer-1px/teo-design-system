import { NavLink } from 'react-router-dom';
import { Mail, Code2, Book } from 'lucide-react';
import * as styles from './GlobalNav.css';

export function GlobalNav() {
    return (
        <nav className={styles.navContainer}>
            <NavItem to="/mail" icon={Mail} label="Mail" />
            <NavItem to="/editor" icon={Code2} label="Editor" />
            <NavItem to="/docs/prd" icon={Book} label="Docs" />
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
            <Icon size={24} />
            {/* Optional label if we want, but usually icon only for thin rail */}
        </NavLink>
    );
}
