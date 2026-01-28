import { NavLink, useLocation } from 'react-router-dom';
import {
    Mail,
    Book,
    Presentation,
    LayoutList,
    Component as ComponentIcon,
    AppWindow,
    CircuitBoard,
    Palette,
    SquarePen,
    Code
} from 'lucide-react';
import * as styles from './GlobalNav.css';
import { ThemeToggle } from '../ThemeToggle';

export function GlobalNav() {
    return (
        <nav className={styles.navContainer}>
            {/* GROUP 1: SYSTEM & DOCS (Priority #1) */}
            <div className={styles.navGroup}>
                <NavItem to="/docs" icon={Book} label="Documentation" />
                <NavItem to="/components" icon={ComponentIcon} label="Showcase" />
            </div>

            <div className={styles.divider} />

            {/* GROUP 2: FEATURE APPLICATIONS */}
            <div className={styles.navGroup}>
                <NavItem to="/mail" icon={Mail} label="Mail" />
                <NavItem to="/slides" icon={Presentation} label="Slides" />
                <NavItem to="/editor" icon={Code} label="Editor" />
                <NavItem to="/storyblok" icon={AppWindow} label="CMS" />
            </div>

            <div className={styles.divider} />

            {/* GROUP 3: ADMIN & STUDIO (Expert Tools) */}
            <div className={styles.navGroup}>
                <NavItem to="/admin" icon={LayoutList} label="Admin List" activeMatch="/admin" end />
                <NavItem to="/admin/form-builder" icon={SquarePen} label="Form Builder" activeMatch="/admin/form-builder" />
                <NavItem to="/admin/studio/designer" icon={Palette} label="Table Designer" activeMatch="/admin/studio" />
                <NavItem to="/admin/flow2" icon={CircuitBoard} label="Flow Editor" activeMatch="/admin/flow" />
            </div>

            <div className={styles.bottomSpacer}>
                <ThemeToggle />
            </div>
        </nav>
    );
}

interface NavItemProps {
    to: string;
    icon: any;
    label: string;
    activeMatch?: string;
    end?: boolean;
}

function NavItem({ to, icon: Icon, label, activeMatch, end }: NavItemProps) {
    const location = useLocation();

    // Custom active logic for nested tools
    const isActiveLink = activeMatch ? location.pathname.startsWith(activeMatch) : false;

    return (
        <NavLink
            to={to}
            end={end}
            title={label}
            className={({ isActive }) => {
                const active = isActive || isActiveLink;
                return [styles.navItem, active ? styles.activeNavItem : ''].join(' ');
            }}
        >
            <Icon size={18} strokeWidth={2} />
        </NavLink>
    );
}
