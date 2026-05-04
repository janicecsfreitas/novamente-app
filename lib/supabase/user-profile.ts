import type { User } from "@supabase/supabase-js";

type UserProfileMetadata = {
  avatarUrl: string | null;
  fullName: string | null;
};

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getProfileMetadata(user: User): UserProfileMetadata {
  const metadata = user.user_metadata;

  return {
    avatarUrl:
      readString(metadata.avatar_url) ??
      readString(metadata.picture) ??
      readString(metadata.image),
    fullName:
      readString(metadata.full_name) ??
      readString(metadata.name) ??
      readString(metadata.display_name),
  };
}
