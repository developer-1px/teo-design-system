import { useState } from 'react';

// --- Types ---
type IntegratedHook<O, F, A, B> = (options: O) => { field: F; action: A; bind: B };

// --- 1. useAccordion (Simulated) ---
export const useAccordion: IntegratedHook<
    { items: string[]; allowMultiple?: boolean },
    { expanded: string[]; isExpanded: (id: string) => boolean; items: string[] },
    { toggle: (id: string) => void },
    { root: any; trigger: (id: string) => any; panel: (id: string) => any }
> = ({ items, allowMultiple }) => {
    const [expanded, setExpanded] = useState<string[]>([]);

    const isExpanded = (id: string) => expanded.includes(id);

    const toggle = (id: string) => {
        setExpanded(prev => {
            if (prev.includes(id)) return prev.filter(i => i !== id);
            return allowMultiple ? [...prev, id] : [id];
        });
    };

    return {
        field: { expanded, isExpanded, items },
        action: { toggle },
        bind: {
            root: { role: 'presentation' },
            trigger: (id) => ({
                onClick: () => toggle(id),
                'aria-expanded': isExpanded(id),
                type: 'button'
            }),
            panel: (id) => ({
                hidden: !isExpanded(id),
                role: 'region'
            })
        }
    };
};

// --- 2. useDropdown (Simulated) ---
export const useDropdown: IntegratedHook<
    { items: string[] },
    { isOpen: boolean; selectedItem: string | null; items: string[] },
    { toggle: () => void; select: (item: string) => void },
    { container: any; trigger: any; menu: any; item: (item: string) => any }
> = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    return {
        field: { isOpen, selectedItem, items },
        action: {
            toggle: () => setIsOpen(!isOpen),
            select: (item) => { setSelectedItem(item); setIsOpen(false); }
        },
        bind: {
            container: { style: { position: 'relative' as const } },
            trigger: {
                onClick: () => setIsOpen(!isOpen),
                'aria-haspopup': true,
                'aria-expanded': isOpen
            },
            menu: { role: 'menu', hidden: !isOpen },
            item: (item) => ({
                role: 'menuitem',
                onClick: () => { setSelectedItem(item); setIsOpen(false); }
            })
        }
    };
};

// --- 3. useTabs (Simulated) ---
export const useTabs: IntegratedHook<
    { tabs: string[]; defaultTab: string },
    { activeTab: string; tabs: string[] },
    { select: (tab: string) => void },
    { list: any; tab: (tab: string) => any; panel: (tab: string) => any }
> = ({ tabs, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return {
        field: { activeTab, tabs },
        action: { select: setActiveTab },
        bind: {
            list: { role: 'tablist' },
            tab: (tab) => ({
                role: 'tab',
                'aria-selected': activeTab === tab,
                onClick: () => setActiveTab(tab)
            }),
            panel: (tab) => ({
                role: 'tabpanel',
                hidden: activeTab !== tab
            })
        }
    };
};

// --- 4. useModal (Simulated) ---
export const useModal: IntegratedHook<
    { onClose: () => void, defaultOpen?: boolean },
    { isOpen: boolean },
    { open: () => void; close: () => void },
    { dialog: any; overlay: any; title: any }
> = ({ onClose, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const close = () => {
        setIsOpen(false);
        onClose();
    };

    return {
        field: { isOpen },
        action: { open: () => setIsOpen(true), close },
        bind: {
            overlay: {
                onClick: close,
                style: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }
            },
            dialog: {
                role: 'dialog',
                'aria-modal': true,
                onClick: (e: any) => e.stopPropagation()
            },
            title: { id: 'modal-title' }
        }
    };
};
