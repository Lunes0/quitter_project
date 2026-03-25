import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../api/constants";
import i18n from "../i18n";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name =
    method === "login" ? i18n.t("auth.login") : i18n.t("auth.register");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
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
      <input
        className="focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 px-3 py-2 w-full mb-4"
        type="text"
        placeholder={i18n.t("auth.username")}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 px-3 py-2 w-full mb-4"
        type="password"
        placeholder={i18n.t("auth.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
        type="submit"
      >
        {name}
      </button>
    </form>
  );
}

export default Form;
