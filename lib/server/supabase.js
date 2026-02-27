const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(value, name) {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
  };
}

function buildQuery(query = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  }
  const str = params.toString();
  return str ? `?${str}` : "";
}

async function fetchWithRetry(url, options, { attempts = 3, timeoutMs = 30000 } = {}) {
  let lastError;

  for (let i = 0; i < attempts; i += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
    }
  }

  throw lastError;
}

async function parseResponse(res) {
  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const message = data?.message || data?.error_description || data?.error || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function supabaseRest(path, { method = "GET", query, body, headers } = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  requireEnv(url, "NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
  requireEnv(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY");

  const endpoint = `${url}/rest/v1/${path}${buildQuery(query)}`;
  let res;
  try {
    res = await fetchWithRetry(endpoint, {
      method,
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (error) {
    const wrapped = new Error(`Network error reaching Supabase REST: ${endpoint}`);
    wrapped.status = 503;
    wrapped.data = { cause: error?.message || "fetch failed" };
    throw wrapped;
  }

  return parseResponse(res);
}

export async function supabaseAuth(path, { method = "GET", body, useServiceRole = false } = {}) {
  const { url, anonKey, serviceRoleKey } = getSupabaseConfig();
  requireEnv(url, "NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
  if (useServiceRole) {
    requireEnv(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY");
  } else {
    requireEnv(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)");
  }
  const token = useServiceRole ? serviceRoleKey : anonKey;

  const endpoint = `${url}/auth/v1/${path}`;
  let res;
  try {
    res = await fetchWithRetry(endpoint, {
      method,
      headers: {
        apikey: token,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (error) {
    const wrapped = new Error(`Network error reaching Supabase Auth: ${endpoint}`);
    wrapped.status = 503;
    wrapped.data = { cause: error?.message || "fetch failed" };
    throw wrapped;
  }

  return parseResponse(res);
}

export async function fetchSingleNews(newsId) {
  const rows = await supabaseRest("news", {
    query: {
      select: "*",
      newsId: `eq.${newsId}`,
      limit: "1",
    },
  });

  return Array.isArray(rows) ? rows[0] : null;
}
