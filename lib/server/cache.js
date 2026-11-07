// Vercel CDN cache for public read endpoints.
// Each URL hits Supabase at most once per 10 minutes; everyone else gets the
// cached copy. For a further 10 minutes the stale copy keeps being served while
// a single background request refreshes it, so traffic spikes never reach the DB.
export const CDN_CACHE_SECONDS = 600;

export const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": `public, s-maxage=${CDN_CACHE_SECONDS}, stale-while-revalidate=${CDN_CACHE_SECONDS}`,
};

export const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
