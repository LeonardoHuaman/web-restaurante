import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ptBR from "./locales/pt-BR.json";
import zhCN from "./locales/zh-CN.json";
import ja from "./locales/ja.json";
import de from "./locales/de.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "es",
        supportedLngs: ["es", "en", "fr", "pt-BR", "zh-CN", "ja", "de"],
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
        resources: {
            es: { translation: es },
            en: { translation: en },
            fr: { translation: fr },
            "pt-BR": { translation: ptBR },
            "zh-CN": { translation: zhCN },
            ja: { translation: ja },
            de: { translation: de },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
