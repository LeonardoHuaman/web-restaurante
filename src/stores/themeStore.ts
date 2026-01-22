// src/stores/themeStore.ts
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
    theme: Theme;
    fontScale: number;

    // 🎨 COLORES
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;

    // ⚙️ ACCIONES
    toggleTheme: () => void;
    setColors: (primary: string, secondary: string, accent?: string) => void;

    increaseFont: () => void;
    decreaseFont: () => void;

    // 🎯 HELPERS TAILWIND
    getTextColor: () => string;
    getNavBackgroundColor: () => string;
    getSecondaryBackgroundColor: () => string;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    theme: "light",
    fontScale: 1,

    // 🎨 DEFAULT: blanco / negro
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    accentColor: "#f97316",

    /* ===============================
       THEME LIGHT / DARK
    =============================== */
    toggleTheme: () =>
        set((state) => {
            const nextTheme = state.theme === "light" ? "dark" : "light";

            if (nextTheme === "dark") {
                document.documentElement.style.setProperty("--color-primary", "#000000");
                document.documentElement.style.setProperty("--color-secondary", "#ffffff");
            } else {
                document.documentElement.style.setProperty("--color-primary", "#ffffff");
                document.documentElement.style.setProperty("--color-secondary", "#000000");
            }

            return { theme: nextTheme };
        }),

    /* ===============================
       COLORES CONFIGURABLES
    =============================== */
    setColors: (primary, secondary, accent = "#f97316") => {
        document.documentElement.style.setProperty("--color-primary", primary);
        document.documentElement.style.setProperty("--color-secondary", secondary);
        document.documentElement.style.setProperty("--color-accent", accent);

        set({
            primaryColor: primary,
            secondaryColor: secondary,
            accentColor: accent,
        });
    },

    /* ===============================
       FUENTE
    =============================== */
    increaseFont: () =>
        set((state) => ({
            fontScale: Math.min(state.fontScale + 0.1, 1.4),
        })),

    decreaseFont: () =>
        set((state) => ({
            fontScale: Math.max(state.fontScale - 0.1, 0.9),
        })),

    /* ===============================
       HELPERS TAILWIND
    =============================== */
    getTextColor: () => "text-secondary",

    getNavBackgroundColor: () => "bg-primary",

    getSecondaryBackgroundColor: () => "bg-secondary/10",
}));
