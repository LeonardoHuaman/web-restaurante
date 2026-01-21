import { useEffect, useState } from "react";
import { Menu, Glasses } from "lucide-react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { usePartyStore } from "../../stores/partyStore";
import { usePartyMembers } from "../../hooks/usePartyMembers";
import { Users } from "lucide-react";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: { title: "Home" } },
        es: { translation: { title: "Inicio" } },
        pt: { translation: { title: "Início" } },
        fr: { translation: { title: "Accueil" } },
        de: { translation: { title: "Startseite" } },
        it: { translation: { title: "Home" } },
        ja: { translation: { title: "ホーム" } },
        ko: { translation: { title: "홈" } },
        zh: { translation: { title: "首页" } },
        ru: { translation: { title: "Главная" } },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

interface Props {
    onToggleSidebar: () => void;
}

const TopBar = ({ onToggleSidebar }: Props) => {
    const { t } = useTranslation();
    const [fontScale, setFontScale] = useState(1);
    const { partyId } = usePartyStore();
    const members = usePartyMembers(partyId);

    useEffect(() => {
        const deviceLang =
            (navigator.languages && navigator.languages[0]) ||
            navigator.language;
        i18n.changeLanguage(deviceLang.split("-")[0]);
    }, []);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontScale * 100}%`;
    }, [fontScale]);

    return (
        <header className="w-full h-14 flex items-center justify-between px-4 shadow-sm bg-white">
            <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100"
            >
                <Menu />
            </button>

            <div className="font-bold text-lg">LOGO</div>

            <div className="flex items-center gap-3">
                <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                    <option value="pt">PT</option>
                    <option value="fr">FR</option>
                    <option value="de">DE</option>
                    <option value="it">IT</option>
                    <option value="ja">JA</option>
                    <option value="ko">KO</option>
                    <option value="zh">ZH</option>
                    <option value="ru">RU</option>
                </select>

                {members > 1 && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{members}</span>
                    </div>
                )}

                <button
                    onClick={() =>
                        setFontScale((prev) => (prev >= 1.3 ? 1 : prev + 0.1))
                    }
                    title="Cambiar tamaño de fuente"
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <Glasses />
                </button>
            </div>
        </header>
    );
};

export default TopBar;
