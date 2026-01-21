import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
    theme: Theme;
    fontScale: number;

    toggleTheme: () => void;
    increaseFont: () => void;
    decreaseFont: () => void;

    getTextColor: () => string;
    getNavBackgroundColor: () => string;
    getSecondaryBackgroundColor: () => string;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    theme: "light",
    fontScale: 1,

    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === "light" ? "dark" : "light"
        })),

    increaseFont: () =>
        set((state) => ({
            fontScale: Math.min(state.fontScale + 0.1, 1.4)
        })),

    decreaseFont: () =>
        set((state) => ({
            fontScale: Math.max(state.fontScale - 0.1, 0.9)
        })),

    getTextColor: () =>
        get().theme === "dark" ? "text-gray-100" : "text-gray-900",

    getNavBackgroundColor: () =>
        get().theme === "dark" ? "bg-gray-900" : "bg-white",

    getSecondaryBackgroundColor: () =>
        get().theme === "dark" ? "bg-gray-800" : "bg-gray-100"
}));
