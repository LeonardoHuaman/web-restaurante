// src/stores/themeStore.ts
import { create } from "zustand";

interface ThemeStore {
    fontScale: number;

    primaryColor: string;
    secondaryColor: string;
    accentColor: string;

    setColors: (primary: string, secondary: string, accent: string) => void;
    increaseFont: () => void;
    decreaseFont: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    fontScale: 1,

    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#e74e39",

    setColors: (primary, secondary, accent) => {
        document.documentElement.style.setProperty("--color-primary", primary);
        document.documentElement.style.setProperty("--color-secondary", secondary);
        document.documentElement.style.setProperty("--color-accent", accent);

        set({
            primaryColor: primary,
            secondaryColor: secondary,
            accentColor: accent,
        });
    },

    increaseFont: () =>
        set((state) => ({
            fontScale: Math.min(state.fontScale + 0.1, 1.4),
        })),

    decreaseFont: () =>
        set((state) => ({
            fontScale: Math.max(state.fontScale - 0.1, 0.9),
        })),
}));
