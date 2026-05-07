"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logoMini from "@/assets/logo_user.png";
import { createClient } from "@/lib/supabase/client";
import { getProfileMetadata } from "@/lib/supabase/user-profile";

type ProfileAvatarLinkProps = {
  className?: string;
};

export function ProfileAvatarLink({ className = "" }: ProfileAvatarLinkProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAvatar() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active || !user) return;

        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("user_id", user.id)
          .maybeSingle<{ avatar_url: string | null }>();

        const metadata = getProfileMetadata(user);
        setAvatarUrl(data?.avatar_url ?? metadata.avatarUrl);
      } catch {
        if (active) setAvatarUrl(null);
      }
    }

    loadAvatar();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Link
      aria-label="Abrir perfil"
      className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary-fixed bg-white shadow-sm transition-transform hover:scale-[1.02] ${className}`}
      href="/perfil"
    >
      <Image
        alt="Avatar do perfil"
        className="h-full w-full object-cover"
        height={40}
        src={avatarUrl ?? logoMini}
        unoptimized={Boolean(avatarUrl)}
        width={40}
      />
    </Link>
  );
}
