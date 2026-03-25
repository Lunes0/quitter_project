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
          auth: {
            username: "Username",
            password: "Password",
            login: "Login",
            register: "Register",
            logout: "Logout",
          },
          welcome: "Welcome to Quitter",
          login: "Login",
          toggle_theme: "Toggle Theme",
          common: {
            save: "Save",
            cancel: "Cancel",
            loading: "Loading...",
          },
          not_found: {
            title: "404 - Not Found",
            message: "Oops! The page you are looking for does not exist.",
          },
        },
      },
      pt: {
        translation: {
          auth: {
            username: "Nome de usuário",
            password: "Senha",
            login: "Entrar",
            register: "Registrar",
            logout: "Sair",
          },
          welcome: "Bem-vindo ao Quitter",
          toggle_theme: "Alternar Tema",
          common: {
            save: "Salvar",
            cancel: "Cancelar",
            loading: "Carregando...",
          },
          not_found: {
            title: "404 - Não Encontrado",
            message: "Ops! A página que você está procurando não existe.",
          },
        },
      },
    },
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
