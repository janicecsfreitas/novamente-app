import { createBrowserClient } from "@supabase/ssr";
import { getRequiredSupabaseConfig } from "@/lib/supabase/config";

export function createClient() {
  const { publishableKey, url } = getRequiredSupabaseConfig();

  return createBrowserClient(url, publishableKey);
}
