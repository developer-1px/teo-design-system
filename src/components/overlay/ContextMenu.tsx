
import { useEffect, useState, useRef, type ReactNode, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import * as styles from './ContextMenu.css';

interface ContextMenuProps {
    trigger: ReactNode;
    items: ReactNode; // MenuItems
}

interface Position {
    x: number;
    y: number;
}

export function ContextMenu({ trigger, items }: ContextMenuProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setVisible(true);
        // Basic screen edge detection could be added here
        setPosition({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (visible && menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setVisible(false);
            }
        };

        const handleScroll = () => {
            if (visible) setVisible(false);
        };

        if (visible) {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('contextmenu', handleClickOutside); // Close on right click elsewhere
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('contextmenu', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [visible]);

    return (
        <>
            <div onContextMenu={handleContextMenu} style={{ display: 'inline-block' }}>
                {trigger}
            </div>
            {visible && createPortal(
                <div
                    ref={menuRef}
                    className={styles.contextMenu}
                    style={{ top: position.y, left: position.x }}
                    role="menu"
                >
                    {items}
                </div>,
                document.body
            )}
        </>
    );
}

// Sub-components for structure
export const ContextMenuItem = ({ children, onClick, ...props }: HTMLAttributes<HTMLButtonElement>) => (
    <button className={styles.menuItem} role="menuitem" onClick={onClick} {...props}>
        {children}
    </button>
);

export const ContextMenuSeparator = () => (
    <div className={styles.separator} role="separator" />
);
