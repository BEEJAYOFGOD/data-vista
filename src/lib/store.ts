import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Dataset {
    id: string;
    name: string;
    data: Record<string, unknown>[];
    columns: string[];
    rowCount: number;
    fileSize: number;
    createdAt: Date;
    updatedAt: Date;
}

interface AppState {
    datasets: Dataset[];
    currentDatasetId: string | null;
    isOnline: boolean;
    sidebarCollapsed: boolean;

    // Actions
    addDataset: (dataset: Dataset) => void;
    removeDataset: (id: string) => void;
    setCurrentDataset: (id: string | null) => void;
    setOnlineStatus: (status: boolean) => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            datasets: [],
            currentDatasetId: null,
            isOnline: true,
            sidebarCollapsed: false,

            addDataset: (dataset) =>
                set((state) => ({ datasets: [...state.datasets, dataset] })),

            removeDataset: (id) =>
                set((state) => ({
                    datasets: state.datasets.filter((d) => d.id !== id),

                    currentDatasetId:
                        state.currentDatasetId === id
                            ? null
                            : state.currentDatasetId,
                })),

            setCurrentDataset: (id) => set({ currentDatasetId: id }),

            setOnlineStatus: (status) => set({ isOnline: status }),

            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            setSidebarCollapsed: (collapsed) =>
                set({ sidebarCollapsed: collapsed }),
        }),

        {
            name: "datavista-storage",
            partialize: (state) => ({
                datasets: state.datasets,
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);
