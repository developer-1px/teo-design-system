import { useHistory } from "../state/useHistory";
import type { CellPosition, SelectionRange } from "./useGridSelection";

export interface TableHistoryState<T> {
    data: T[];
    cursor: CellPosition;
    selection: SelectionRange | null;
}

export function useTableHistory<T>(initialData: T[]) {
    return useHistory<TableHistoryState<T>>({
        initialState: {
            data: initialData,
            cursor: { row: 0, col: 0 },
            selection: null
        }
    });
}
