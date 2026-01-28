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
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings"; // 👈 NUEVO

i18n.use(initReactI18next).init({
    resources: {
        es: { translation: {} },
        en: { translation: {} },
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
});

interface Props {
    onToggleSidebar: () => void;
}

const TopBar = ({ onToggleSidebar }: Props) => {
    const [fontScale, setFontScale] = useState(1);
    const [langOpen, setLangOpen] = useState(false);

    const { partyId } = usePartyStore();
    const members = usePartyMembers(partyId);

    const settings = useRestaurantSettings(); // 👈 NUEVO

    useEffect(() => {
        const deviceLang =
            (navigator.languages && navigator.languages[0]) ||
            navigator.language;

        const lang = deviceLang.startsWith("pt")
            ? "pt-BR"
            : deviceLang.split("-")[0];

        i18n.changeLanguage(lang);
    }, []);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontScale * 100}%`;
    }, [fontScale]);

    return (
        <motion.header
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
                sticky top-0 z-30
                w-full h-16 px-4
                flex items-center
                bg-primary
                text-secondary
                backdrop-blur-md
                border-b border-secondary/10
            "
        >
            {/* IZQUIERDA */}
            <div className="flex items-center gap-3 flex-1">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleSidebar}
                    className="p-2 rounded-xl hover:bg-secondary/10 transition"
                >
                    <Menu className="w-6 h-6" />
                </motion.button>

                {/* 👇 NOMBRE DINÁMICO */}
                <span className="font-extrabold tracking-wide text-lg">
                    {settings?.name ?? "Restaurante"}
                </span>
            </div>

            {/* CENTRO */}
            <div className="absolute left-1/2 -translate-x-1/2">
                {/* 👇 LOGO DINÁMICO */}
                {settings?.logo_url ? (
                    <img
                        src={settings.logo_url}
                        alt="Logo restaurante"
                        className="h-10 max-w-[140px] object-contain"
                    />
                ) : (
                    <span className="font-black tracking-widest text-lg">
                        LOGO
                    </span>
                )}
            </div>

            {/* DERECHA */}
            <div className="flex items-center gap-3 flex-1 justify-end">
                {/* MIEMBROS */}
                {members > 0 && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="
                            flex items-center gap-2
                            px-3 py-1.5
                            rounded-full
                            bg-secondary/10
                            text-sm font-semibold
                        "
                    >
                        <Users className="w-5 h-5" />
                        <span>{members}</span>
                    </motion.div>
                )}

                {/* IDIOMAS */}
                <div className="relative flex items-center gap-1">
                    <button
                        onClick={() => setLangOpen((v) => !v)}
                        title="Cambiar idioma"
                        className="p-2 rounded-full hover:bg-secondary/10 transition"
                    >
                        <Globe className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setLangOpen((v) => !v)}
                        className="
                            flex items-center gap-1
                            px-3 py-1.5
                            rounded-full
                            border border-secondary/20
                            hover:bg-secondary/10
                            text-sm font-medium
                            transition
                        "
                    >
                        {i18n.language.toUpperCase()}
                        <ChevronDown className="w-4 h-4" />
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
                            {["es", "en", "pt-BR", "fr", "de", "ja"].map((lng) => (
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

                {/* ZOOM */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                        setFontScale((prev) => (prev >= 1.3 ? 1 : prev + 0.1))
                    }
                    title="Cambiar tamaño"
                    className="p-2 rounded-full hover:bg-secondary/10 transition"
                >
                    <Glasses className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.header>
    );
};

export default TopBar;
