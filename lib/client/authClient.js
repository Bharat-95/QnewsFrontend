"use client";

// Attaches the signed-in user's token to our own API calls (fetch and axios),
// refreshes it once when it has expired, and sends the user to /Login when the
// session is really over. Imported once from the root layout.
//
// Only write requests (POST/PUT/PATCH/DELETE) and a few private GETs carry the
// token, so cached public GETs stay identical for every visitor.

import axios from "axios";

const PRIVATE_GET_PATHS = new Set(["/api/auth/me", "/api/users"]);
const NEVER_AUTH_PATHS = new Set([
  "/api/auth/signin",
  "/api/auth/refresh",
  "/api/users/reset-password",
  "/api/users/reset-password/request",
]);

function apiPath(rawUrl) {
  try {
    const url = new URL(rawUrl, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname.startsWith("/api/") ? url.pathname : null;
  } catch {
    return null;
  }
}

function needsAuth(path, method) {
  if (!path || NEVER_AUTH_PATHS.has(path)) return false;
  const m = (method || "GET").toUpperCase();
  return m !== "GET" && m !== "HEAD" ? true : PRIVATE_GET_PATHS.has(path);
}

function readToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function clearSessionAndGoToLogin() {
  try {
    ["token", "refreshToken", "role", "email", "firstName", "lastName"].forEach((key) =>
      localStorage.removeItem(key)
    );
  } catch {}
  if (!window.location.pathname.startsWith("/Login")) {
    window.location.href = "/Login";
  }
}

let refreshPromise = null;

// Returns a fresh access token, or null if the session cannot be renewed.
function refreshToken(originalFetch) {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      let stored = null;
      try {
        stored = localStorage.getItem("refreshToken");
      } catch {}
      if (!stored) return null;

      try {
        const res = await originalFetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: stored }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        localStorage.setItem("token", data.token);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        return data.token;
      } catch {
        return null;
      }
    })().finally(() => {
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    });
  }
  return refreshPromise;
}

function install() {
  if (typeof window === "undefined" || window.__qnewsAuthInstalled) return;
  window.__qnewsAuthInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const rawUrl = typeof input === "string" || input instanceof URL ? String(input) : null;
    const method = init.method || "GET";
    const path = rawUrl ? apiPath(rawUrl) : null;
    const token = readToken();

    if (!token || !needsAuth(path, method)) {
      return originalFetch(input, init);
    }

    const withToken = (t) => {
      const headers = new Headers(init.headers || {});
      headers.set("Authorization", `Bearer ${t}`);
      return { ...init, headers };
    };

    let res = await originalFetch(input, withToken(token));
    if (res.status !== 401) return res;

    const fresh = await refreshToken(originalFetch);
    if (!fresh) {
      clearSessionAndGoToLogin();
      return res;
    }

    res = await originalFetch(input, withToken(fresh));
    if (res.status === 401) clearSessionAndGoToLogin();
    return res;
  };

  axios.interceptors.request.use((config) => {
    const fullUrl = (config.baseURL || "") + (config.url || "");
    const token = readToken();
    if (token && needsAuth(apiPath(fullUrl), config.method)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config;
      const fullUrl = (config?.baseURL || "") + (config?.url || "");
      if (
        error?.response?.status !== 401 ||
        !config ||
        config.__qnewsRetried ||
        !needsAuth(apiPath(fullUrl), config.method)
      ) {
        throw error;
      }

      const fresh = await refreshToken(originalFetch);
      if (!fresh) {
        clearSessionAndGoToLogin();
        throw error;
      }
      config.__qnewsRetried = true;
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${fresh}`;
      return axios(config);
    }
  );
}

install();
