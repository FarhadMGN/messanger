import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUsLocale from "./assets/localization/en_US.json"
import ruLocale from "./assets/localization/ru_RU.json"

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: enUsLocale
        },
        ru: {
            translation: ruLocale
        }
    },
    lng: "en",
    fallbackLng: "en"
});

export default i18n;
