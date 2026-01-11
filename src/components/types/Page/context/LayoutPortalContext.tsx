import { createContext, useContext, RefObject } from 'react';

/**
 * Layout Slots available in the Page Skeleton
 */
export type LayoutSlot = 'top' | 'left' | 'center' | 'right' | 'bottom';

export interface LayoutPortalContextType {
    slots: {
        top: RefObject<HTMLElement>;
        left: RefObject<HTMLElement>;
        center: RefObject<HTMLElement>;
        right: RefObject<HTMLElement>;
        bottom: RefObject<HTMLElement>;
    };
    register: (role: string) => LayoutSlot | null;
}

export const LayoutPortalContext = createContext<LayoutPortalContextType | null>(null);

export const useLayoutPortal = () => {
    const context = useContext(LayoutPortalContext);
    /* 
     * It's okay if context is null (e.g. Page role="Document" or standard flow).
     * Consumers should check if context exists before portaling.
     */
    return context;
};
