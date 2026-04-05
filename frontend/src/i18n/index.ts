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
          comments: {
            no_comments: "No comments yet. Be the first to comment!",
            comments: "Comments",
            placeholder: "Write a comment...",
            post_button: "Comment",
          },
          home: {
            home: "Home",
            no_bio: "This user has no bio.",
            profile: "Profile",
            edit_profile: "Edit Profile",
            display_name: "Display Name",
            profile_picture: "Profile Picture",
            bio: "Bio",
            post_placeholder: "What's on your mind?",
            create_post: "Post",
            loading_posts: "Loading posts...",
            posting: "Posting...",
            feed: "Feed",
          },
          auth: {
            username: "Username",
            password: "Password",
            login: "Login",
            register: "Register",
            logout: "Logout",
          },
          common: {
            search: "Search on Quitter...",
            toggle_theme: "Switch Theme",
            delete: "Delete",
            edit: "Edit",
            edited: "Edited",
            save: "Save",
            saving: "Saving...",
            cancel: "Cancel",
            loading: "Loading...",
          },
          follow: {
            no_followers: "No followers yet.",
            no_following: "Not following anyone yet.",
            follow: "Follow",
            following: "Following",
            followers: "Followers",
            unfollow: "Unfollow",
          },
          not_found: {
            title: "404 - Not Found",
            message: "Oops! The page you are looking for does not exist.",
          },
        },
      },
      pt: {
        translation: {
          comments: {
            no_comments:
              "Ainda não há comentários. Seja o primeiro a comentar!",
            comments: "Comentários",
            placeholder: "Escreva um comentário...",
            post_button: "Comentar",
          },
          home: {
            home: "Início",
            no_bio: "Este usuário não tem bio.",
            profile: "Perfil",
            edit_profile: "Editar Perfil",
            display_name: "Nome de Exibição",
            profile_picture: "Foto de Perfil",
            bio: "Bio",
            post_placeholder: "O que você está pensando?",
            create_post: "Postar",
            loading_posts: "Carregando posts...",
            posting: "Publicando...",
            feed: "Feed",
          },
          auth: {
            username: "Nome de usuário",
            password: "Senha",
            login: "Entrar",
            register: "Registrar",
            logout: "Sair",
          },
          common: {
            search: "Buscar no Quitter...",
            toggle_theme: "Alternar Tema",
            delete: "Deletar",
            edit: "Editar",
            edited: "Editado",
            save: "Salvar",
            saving: "Salvando...",
            cancel: "Cancelar",
            loading: "Carregando...",
          },
          follow: {
            no_followers: "Nenhum seguidor ainda.",
            no_following: "Ainda não seguindo ninguém.",
            follow: "Seguir",
            following: "Seguindo",
            followers: "Seguidores",
            unfollow: "Deixar de seguir",
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
