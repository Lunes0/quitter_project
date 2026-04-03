import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import Inputs from "../ui/Inputs";
import Buttons from "../ui/buttons/Buttons";

function Form({
  route,
  method,
}: {
  route: string;
  method: "login" | "register";
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();

  const name = method === "login" ? t("auth.login") : t("auth.register");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        await login(username, res.data.access, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-md shadow-md w-full max-w-sm"
    >
      <h1 className="text-xl font-bold mb-4">{name}</h1>
      <Inputs
        textarea={false}
        type="text"
        placeholder={t("auth.username")}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Inputs
        textarea={false}
        type="password"
        placeholder={t("auth.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex justify-between mt-4">
        <Buttons primary={true} size="lg" disabled={loading} type="submit">
          {loading ? t("common.loading") : name}
        </Buttons>
        {method === "login" ? (
          <Buttons
            primary={false}
            size="lg"
            disabled={loading}
            type="button"
            onClick={() => navigate("/register")}
          >
            {t("auth.register")}
          </Buttons>
        ) : (
          <Buttons
            primary={false}
            size="lg"
            disabled={loading}
            type="button"
            onClick={() => navigate("/login")}
          >
            {t("auth.login")}
          </Buttons>
        )}
      </div>
    </form>
  );
}

export default Form;
