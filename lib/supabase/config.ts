export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    isConfigured: Boolean(url && publishableKey),
    publishableKey,
    url,
  };
}

export function getRequiredSupabaseConfig() {
  const config = getSupabaseConfig();

  if (!config.url || !config.publishableKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
    );
  }

  return {
    publishableKey: config.publishableKey,
    url: config.url,
  };
}
