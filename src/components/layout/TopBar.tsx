// src/components/layout/TopBar.tsx
import { useEffect, useState } from "react";
import {
    Menu,
    Glasses,
    Users,
    ChevronDown,
    Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { usePartyStore } from "../../stores/partyStore";
import { usePartyMembers } from "../../hooks/usePartyMembers";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";

i18n.use(initReactI18next).init({
    resources: { es: { translation: {} }, en: { translation: {} } },
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
});

interface Props {
    onToggleSidebar: () => void;
}

const LANGS = ["es", "en", "pt-BR", "fr", "de", "ja"];

const TopBar = ({ onToggleSidebar }: Props) => {
    const [fontScale, setFontScale] = useState(1);
    const [langOpen, setLangOpen] = useState(false);

    const { partyId } = usePartyStore();
    const members = usePartyMembers(partyId);
    const settings = useRestaurantSettings();

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontScale * 100}%`;
    }, [fontScale]);

    return (
        <motion.header
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="
                sticky top-0 z-30
                w-full h-14 sm:h-16
                px-3 sm:px-4
                flex items-center
                bg-primary text-secondary
                border-b border-secondary/10
            "
        >
            {/* IZQUIERDA */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-xl hover:bg-secondary/10"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* LOGO — MOBILE */}
                <div className="sm:hidden">
                    {settings?.logo_url ? (
                        <img
                            src={settings.logo_url}
                            alt="Logo"
                            className="h-7 w-7 object-contain"
                        />
                    ) : (
                        <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
                            🍽️
                        </div>
                    )}
                </div>

                {/* NOMBRE — SOLO DESKTOP */}
                <span className="hidden sm:block font-extrabold tracking-wide text-lg truncate">
                    {settings?.name ?? "Restaurante"}
                </span>
            </div>

            {/* CENTRO — LOGO DESKTOP */}
            <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2">
                {settings?.logo_url ? (
                    <img
                        src={settings.logo_url}
                        alt="Logo"
                        className="h-9 max-w-[120px] object-contain"
                    />
                ) : (
                    <span className="font-black tracking-widest text-lg">
                        LOGO
                    </span>
                )}
            </div>

            {/* DERECHA */}
            <div className="flex items-center gap-2 sm:gap-3 justify-end">
                {/* MIEMBROS — SIEMPRE */}
                {members > 0 && (
                    <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-secondary/10 text-xs sm:text-sm font-semibold">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{members}</span>
                    </div>
                )}

                {/* IDIOMAS */}
                <div className="relative">
                    <button
                        onClick={() => setLangOpen((v) => !v)}
                        className="
                            flex items-center gap-1
                            p-2 sm:px-3 sm:py-1.5
                            rounded-full
                            border border-secondary/20
                            hover:bg-secondary/10
                            transition
                        "
                    >
                        <Globe className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm font-medium">
                            {i18n.language.toUpperCase()}
                        </span>
                        <ChevronDown className="hidden sm:inline w-4 h-4" />
                    </button>

                    {langOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="
                                absolute right-0 top-full mt-2
                                w-28
                                rounded-xl
                                shadow-lg
                                bg-primary
                                border border-secondary/10
                                overflow-hidden
                                z-50
                            "
                        >
                            {LANGS.map((lng) => (
                                <button
                                    key={lng}
                                    onClick={() => {
                                        i18n.changeLanguage(lng);
                                        setLangOpen(false);
                                    }}
                                    className="
                                        w-full text-left px-4 py-2
                                        text-sm
                                        hover:bg-secondary/10
                                        transition
                                    "
                                >
                                    {lng.toUpperCase()}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* ZOOM — SIEMPRE */}
                <button
                    onClick={() =>
                        setFontScale((p) => (p >= 1.3 ? 1 : p + 0.1))
                    }
                    className="p-2 rounded-full hover:bg-secondary/10"
                >
                    <Glasses className="w-5 h-5" />
                </button>
            </div>
        </motion.header>
    );
};

export default TopBar;
