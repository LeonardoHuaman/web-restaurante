import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type FontSize = "sm" | "md" | "lg";

interface UIContextType {
    language: string;
    setLanguage: (lang: string) => void;
    fontSize: FontSize;
    toggleFontSize: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const deviceLang = navigator.language.startsWith("es") ? "es" : "en";

    const [language, setLanguage] = useState(deviceLang);
    const [fontSize, setFontSize] = useState<FontSize>("md");

    useEffect(() => {
        document.documentElement.classList.remove("text-sm", "text-md", "text-lg");
        document.documentElement.classList.add(`text-${fontSize}`);
    }, [fontSize]);

    const toggleFontSize = () => {
        setFontSize((prev) =>
            prev === "sm" ? "md" : prev === "md" ? "lg" : "sm"
        );
    };

    return (
        <UIContext.Provider
            value={{ language, setLanguage, fontSize, toggleFontSize }}
        >
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error("useUI must be used inside UIProvider");
    return context;
};
