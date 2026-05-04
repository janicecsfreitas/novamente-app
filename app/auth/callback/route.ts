import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileMetadata } from "@/lib/supabase/user-profile";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/planner";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { avatarUrl, fullName } = getProfileMetadata(user);

      await supabase.from("profiles").upsert({
        avatar_url: avatarUrl,
        email: user.email ?? null,
        full_name: fullName,
        user_id: user.id,
      });
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
