import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import * as styles from './Shell.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { clsx } from 'clsx';

// --- Sub-components for Slots ---

export interface ShellSlotProps extends ComponentPropsWithoutRef<'div'> {
    children: ReactNode;
}

export function ShellNavbar({ children, className, ...props }: ShellSlotProps) {
    return <div className={clsx(styles.areaNavbar, className)} {...props}>{children}</div>;
}

export function ShellActivityBar({ children, className, ...props }: ShellSlotProps) {
    return <div className={clsx(styles.areaActivity, className)} {...props}>{children}</div>;
}

export function ShellSidebar({ children, className, ...props }: ShellSlotProps) {
    return <div className={clsx(styles.areaSidebar, className)} {...props}>{children}</div>;
}

export function ShellMain({ children, className, ...props }: ShellSlotProps) {
    // Note: areaMain expects a <main> tag or we can just use div. 
    // Usually main content should be semantic <main>. 
    // styles.areaMain includes 'flex' and 'overflow: hidden'.
    return (
        <main className={clsx(styles.areaMain, className)} {...props}>
            <div className={styles.mainContentScroll}>
                {children}
            </div>
        </main>
    );
}

export function ShellAuxPanel({ children, className, ...props }: ShellSlotProps) {
    return <div className={clsx(styles.areaAux, className)} {...props}>{children}</div>;
}

export function ShellBottomPanel({ children, className, ...props }: ShellSlotProps) {
    return <div className={clsx(styles.areaBottom, className)} {...props}>{children}</div>;
}

export function ShellStatusBar({ children, className, ...props }: ShellSlotProps) {
    return <div className={clsx(styles.areaStatus, className)} {...props}>{children}</div>;
}

// --- Main Shell Component ---

export interface ShellProps extends ComponentPropsWithoutRef<'div'> {
    children: ReactNode;

    // Dimensions Config
    sidebarWidth?: string;
    auxPanelWidth?: string;
    activityBarWidth?: string;
    bottomPanelHeight?: string;
    headerHeight?: string;
}

export function Shell({
    children,
    sidebarWidth,
    auxPanelWidth,
    activityBarWidth,
    bottomPanelHeight,
    headerHeight,
    className,
    style,
    ...props
}: ShellProps) {
    // Dynamic sizing variables
    const dynamicVars = assignInlineVars({
        [styles.sidebarWidthVar]: sidebarWidth || '240px',
        [styles.auxPanelWidthVar]: auxPanelWidth || '280px',
        [styles.activityBarWidthVar]: activityBarWidth || '48px',
        [styles.bottomPanelHeightVar]: bottomPanelHeight || '200px',
        [styles.headerHeightVar]: headerHeight || '48px',
    });

    return (
        <div
            className={clsx(styles.shellContainer, className)}
            style={{ ...dynamicVars, ...style } as CSSProperties}
            {...props}
        >
            {children}
        </div>
    );
}

// Attach subcomponents
Shell.Navbar = ShellNavbar;
Shell.ActivityBar = ShellActivityBar;
Shell.Sidebar = ShellSidebar;
Shell.Main = ShellMain;
Shell.AuxPanel = ShellAuxPanel;
Shell.BottomPanel = ShellBottomPanel;
Shell.StatusBar = ShellStatusBar;
