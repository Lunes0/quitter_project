import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfile, toggleFollow } from "../api/services/users";
import Post from "../components/layout/Post";
import { useAuth } from "../hooks/useAuth";
import { type UserProfileType } from "../types";
import { useTranslation } from "react-i18next";
import Buttons from "../components/ui/buttons/Buttons";
import EditProfileModal from "../components/layout/EditProfileModal";
import { getAvatarUrl } from "../api/services/profileImg";
import IconButton from "../components/ui/buttons/IconButtons";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const loadData = useCallback(async () => {
    if (!username) return;

    try {
      const data = await getUserProfile(username);
      setProfile(data);
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  }, [username]);

  const handleToggleFollow = async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      await toggleFollow(profile.id);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.username) {
      setCurrentUsername(currentUser.username);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData, currentUser]);

  if (!profile)
    return <div className="p-10 text-center">{t("common.loading")}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => loadData()}
        />
      )}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex justify-between items-start">
          <img
            src={getAvatarUrl(profile.avatar, profile.username)}
            alt={profile.username}
            className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover"
          />
          {currentUsername !== profile.username && (
            <Buttons
              onClick={handleToggleFollow}
              size="lg"
              disabled={isLoading}
              primary={true}
              rounded={true}
            >
              {profile.is_following ? t("follow.unfollow") : t("follow.follow")}
            </Buttons>
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-black dark:text-white">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-slate-500">@{profile.username}</p>
        </div>

        <p className="mt-3 text-slate-700 dark:text-slate-300 wrap-break-word whitespace-pre-wrap">
          {profile.bio || t("home.no_bio")}
        </p>

        <div className="flex mt-4 text-sm justify-between">
          <div className="flex gap-6">
            <div className="relative group">
              <span className="dark:text-slate-400 cursor-pointer">
                <strong className="text-slate-900 dark:text-white">
                  {profile.following_count}
                </strong>{" "}
                {t("follow.following")}
              </span>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 mt-1 w-52 max-h-56 overflow-y-auto rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 z-20 shadow-lg text-xs">
                <div className="font-semibold mb-1">
                  {t("follow.following")}
                </div>
                {profile.following.length > 0 ? (
                  <ul className="space-y-1">
                    {profile.following.map((followed) => (
                      <li
                        key={followed.username}
                        className="truncate cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/${followed.username}`)
                        }
                      >
                        <img
                          src={getAvatarUrl(followed.avatar, followed.username)}
                          alt={followed.username}
                          className="w-6 h-6 rounded-full mr-2 inline-block"
                        />
                        {followed.display_name} ({followed.username})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("follow.no_following")}</p>
                )}
              </div>
            </div>

            <div className="relative group">
              <span className="dark:text-slate-400 cursor-pointer">
                <strong className="text-slate-900 dark:text-white">
                  {profile.followers_count}
                </strong>{" "}
                {t("follow.followers")}
              </span>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 mt-1 w-52 max-h-56 overflow-y-auto rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 z-20 shadow-lg text-xs">
                <div className="font-semibold mb-1">
                  {t("follow.followers")}
                </div>
                {profile.followers.length > 0 ? (
                  <ul className="space-y-1">
                    {profile.followers.map((follower) => (
                      <li
                        key={follower.username}
                        className="truncate cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/${follower.username}`)
                        }
                      >
                        <img
                          src={getAvatarUrl(follower.avatar, follower.username)}
                          alt={follower.username}
                          className="w-6 h-6 rounded-full mr-2 inline-block"
                        />
                        {follower.display_name} ({follower.username})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("follow.no_followers")}</p>
                )}
              </div>
            </div>
          </div>
          <IconButton onClick={() => setShowEditModal(true)} icon="edit" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold px-2 dark:text-white">Quits</h2>
        {profile.posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onDelete={() => loadData()}
            onUpdate={() => loadData()}
          />
        ))}
      </div>
    </div>
  );
}
