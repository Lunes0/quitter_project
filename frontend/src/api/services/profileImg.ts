const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getAvatarUrl = (
  avatarPath: string | null | undefined,
  username: string,
): string => {
  if (!avatarPath) {
    return `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&bold=true`;
  }

  if (avatarPath.startsWith("http")) {
    return avatarPath;
  }

  const cleanPath = avatarPath.startsWith("/") ? avatarPath : `/${avatarPath}`;
  return `${API_URL}${cleanPath}`;
};
