import React, { ReactNode } from 'react';
import { SectionRole } from '@/components/types/Section/Section.types';

export interface ApplicationLayoutStructure {
    top: ReactNode[];
    bottom: ReactNode[];
    left: ReactNode[];
    right: ReactNode[];
    center: ReactNode[];
}

/**
 * useApplicationLayout
 * Groups children into Flexbox regions for an IDE/Application layout.
 * 
 * Logic:
 * - Top: Header, Toolbar
 * - Bottom: Footer, Statusbar, Dock
 * - Middle Left: ActivityBar, PrimarySidebar, Sidebar, Nav
 * - Middle Right: SecondarySidebar, Aside
 * - Middle Center: Main, Editor, Canvas, Panel
 */
export function useApplicationLayout(children: ReactNode): ApplicationLayoutStructure {
    const structure: ApplicationLayoutStructure = {
        top: [],
        bottom: [],
        left: [],
        right: [],
        center: [],
    };

    React.Children.forEach(children, (child: any) => {
        if (!child || !React.isValidElement(child)) return;

        // Attempt to get role from props
        const role = (child.props as any)?.role as SectionRole;

        if (!role) {
            // Default to center if no role
            structure.center.push(child);
            return;
        }

        switch (role) {
            // --- TOP ---
            case 'Header':
            case 'Toolbar':
            case 'UtilityBar': // Sometimes top, sometimes right? Let's assume Top for classic header apps
                structure.top.push(child);
                break;

            // --- BOTTOM ---
            case 'Footer':
            case 'Statusbar':
            case 'Status':
            case 'Dock':
                structure.bottom.push(child);
                break;

            // --- LEFT ---
            case 'ActivityBar':
            case 'PrimarySidebar':
            case 'Sidebar':
            case 'Nav':
                structure.left.push(child);
                break;

            // --- RIGHT ---
            case 'SecondarySidebar':
            case 'Aside':
                structure.right.push(child);
                break;

            // --- CENTER ---
            case 'Main':
            case 'Editor':
            case 'Canvas':
            case 'Content':
            case 'Panel': // Often Panel is bottom of center, but for flex row it's part of center col
                structure.center.push(child);
                break;

            default:
                // Fallback for unknown roles (e.g. Overlay-ish things or new roles)
                // If it's a fixed position overlay, it doesn't matter where it is in flex flow usually,
                // but let's put it in center to be safe.
                structure.center.push(child);
                break;
        }
    });

    return structure;
}
