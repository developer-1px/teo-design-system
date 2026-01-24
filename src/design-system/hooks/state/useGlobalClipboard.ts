import { create } from 'zustand';
import type { SelectionRange } from '../data/useGridSelection';

interface ClipboardState {
    copiedRange: SelectionRange | null;
    sourceTableId: string | null;
    setCopiedRange: (range: SelectionRange | null, sourceTableId: string | null) => void;
}

export const useGlobalClipboard = create<ClipboardState>((set) => ({
    copiedRange: null,
    sourceTableId: null,
    setCopiedRange: (range, sourceTableId) => set({ copiedRange: range, sourceTableId }),
}));
