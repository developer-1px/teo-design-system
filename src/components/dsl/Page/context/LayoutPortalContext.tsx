import { createContext, type RefObject, useContext } from 'react';

export type LayoutSlot = 'top' | 'left' | 'center' | 'right' | 'bottom';

export interface LayoutPortalContextValue {
  slots: Record<LayoutSlot, RefObject<HTMLDivElement>>;
  register: (role: string) => LayoutSlot | null;
}

export const LayoutPortalContext = createContext<LayoutPortalContextValue | null>(null);

export const useLayoutPortal = () => useContext(LayoutPortalContext);
