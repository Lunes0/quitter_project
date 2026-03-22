import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to Quitter",
          login: "Login",
          toggle_theme: "Toggle Theme",
        },
      },
      pt: {
        translation: {
          welcome: "Bem-vindo ao Quitter",
          login: "Entrar",
          toggle_theme: "Alternar Tema",
        },
      },
    },
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
