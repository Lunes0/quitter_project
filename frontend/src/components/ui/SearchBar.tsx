import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import Inputs from "./Inputs";
import type { UserProfileType } from "../../types";
import { getAvatarUrl } from "../../api/services/profileImg";

export default function SearchBar({ mobile = false }: { mobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const res = await api.get(`/api/users/search/?search=${query}`);
          setResults(res.data);
          setIsOpen(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div
      className={`relative w-full ${mobile ? "max-w-none" : "max-w-sm hidden md:block"}`}
      ref={searchRef}
    >
      <Inputs
        textarea={false}
        type="text"
        placeholder={t("common.search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-12 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden z-50">
          {results.map((user: UserProfileType) => (
            <div
              key={user.id}
              onClick={() => {
                navigate(`/profile/${user.username}`);
                setIsOpen(false);
                setQuery("");
              }}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <img
                src={getAvatarUrl(user.avatar, user.username)}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white leading-tight">
                  {user.display_name || user.username}
                </p>
                <p className="text-sm text-slate-500">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
