import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import type { UserProfileType } from "../../types";
import Inputs from "../ui/Inputs";
import Button from "../ui/buttons/Buttons";

export default function EditProfileModal({
  profile,
  onClose,
  onSuccess,
}: {
  profile: UserProfileType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [file, setFile] = useState<File | null>(null);
  const { refreshProfile } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("display_name", displayName);
    data.append("bio", bio);
    if (file) data.append("avatar", file);

    try {
      await api.patch("/api/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshProfile();
      onSuccess();
      onClose();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {t("home.edit_profile")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              {t("home.profile_picture")}
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              {t("home.display_name")}
            </label>
            <Inputs
              type="text"
              placeholder={t("home.display_name")}
              textarea={false}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              {t("home.bio")}
            </label>
            <Inputs
              textarea={true}
              placeholder={t("home.bio")}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              primary={false}
              rounded={true}
              size="lg"
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" primary={true} rounded={true} size="lg">
              {t("common.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
