import { create } from "zustand";

interface TableStore {
    tableId: string | null;
    tableNumber: number | null;
    isReady: boolean;
    isLoading: boolean;

    setTable: (id: string, number: number) => void;
    setInvalid: () => void;
}

export const useTableStore = create<TableStore>((set) => ({
    tableId: null,
    tableNumber: null,
    isReady: false,
    isLoading: true,
    setTable: (id, number) => set({ tableId: id, tableNumber: number, isReady: true, isLoading: false }),
    setInvalid: () => set({ tableId: null, tableNumber: null, isReady: false, isLoading: false }),
}));