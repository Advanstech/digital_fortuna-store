/**
 * Centralized Authentication & Session Security System
 * Handles JWT access tokens, automatic silent refresh, session expiration,
 * and seamless return-back redirects.
 */

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_ROLE_KEY = "user_role";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface DecodedJwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  typ?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Safely decodes a JWT payload without requiring external libraries.
 */
export function parseJwtPayload(token: string | null | undefined): DecodedJwtPayload | null {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is expired, with an optional safety margin.
 * @param offsetSeconds Seconds before actual expiry to treat token as expired (default 60s for proactive refresh)
 */
export function isTokenExpired(token: string | null | undefined, offsetSeconds = 60): boolean {
  if (!token) return true;
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) return true;
  const expiryMs = payload.exp * 1000;
  return Date.now() >= expiryMs - offsetSeconds * 1000;
}

/**
 * Retrieves the decoded user information from the currently stored access token.
 */
export function getStoredUserContext(): { userId: string; email: string; role: string } | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;
  const payload = parseJwtPayload(token);
  if (!payload) return null;
  return {
    userId: payload.sub || "",
    email: payload.email || "",
    role: payload.role || localStorage.getItem(USER_ROLE_KEY) || "buyer",
  };
}

let refreshPromise: Promise<string | null> | null = null;

/**
 * Performs a silent token refresh using the stored refresh token.
 * Concurrent requests are automatically deduplicated into a single network call.
 */
export async function refreshAuthTokens(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  // Deduplicate concurrent refreshes
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return null;
    }

    const currentToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const payload = currentToken ? parseJwtPayload(currentToken) : parseJwtPayload(refreshToken);
    const userId = payload?.sub;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken,
          ...(userId ? { userId } : {}),
        }),
      });

      if (!res.ok) {
        return null;
      }

      const resJson = await res.json().catch(() => ({}));
      const data = resJson.data || resJson;

      if (data?.access_token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
        if (data.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
        }
        if (data.user?.role) {
          localStorage.setItem(USER_ROLE_KEY, data.user.role);
        }
        window.dispatchEvent(
          new CustomEvent("df:auth-refreshed", {
            detail: {
              accessToken: data.access_token,
              user: data.user,
            },
          })
        );
        return data.access_token as string;
      }
      return null;
    } catch (err) {
      console.warn("Failed to refresh authentication token:", err);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Returns a valid access token.
 * If the current token is missing, expired, or about to expire in <= 60s,
 * it will automatically attempt silent refresh before returning.
 */
export async function getValidAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;

  // If token is still valid with at least 60s buffer, return immediately
  if (!isTokenExpired(token, 60)) {
    return token;
  }

  // Proactively refresh
  const refreshedToken = await refreshAuthTokens();
  if (refreshedToken) {
    return refreshedToken;
  }

  // If refresh failed but token hasn't strictly hit its hard expiry yet, allow it as fallback
  if (!isTokenExpired(token, 0)) {
    return token;
  }

  return null;
}

/**
 * Gracefully shuts down an expired session:
 * Clears stored credentials and redirects to the sign-in page with returnUrl
 * so the user can sign in and return back to normal.
 */
export function handleSessionExpired(options: { redirect?: boolean; returnUrl?: string } = { redirect: true }) {
  if (typeof window === "undefined") return;

  const currentPath =
    options.returnUrl ||
    (window.location.pathname + window.location.search);

  // Clear session keys
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);

  // Dispatch global custom event for any UI listeners
  window.dispatchEvent(
    new CustomEvent("df:session-expired", {
      detail: { returnUrl: currentPath },
    })
  );

  if (options.redirect !== false) {
    // Only redirect if not already on the auth page
    if (!window.location.pathname.startsWith("/auth")) {
      const encodedReturn = encodeURIComponent(currentPath);
      window.location.href = `/auth?expired=1&returnUrl=${encodedReturn}`;
    }
  }
}

/**
 * Drop-in wrapper around window.fetch with automatic bearer token injection,
 * silent token refresh, and automatic 401 session recovery.
 */
export async function authenticatedFetch(
  input: string | URL | Request,
  init: RequestInit = {}
): Promise<Response> {
  // Proactively obtain a valid token
  let token = await getValidAccessToken();

  const headers = new Headers(init.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      headers,
    });
  } catch (netErr) {
    throw netErr;
  }

  // If server responded with 401 Unauthorized, attempt ONE refresh and transparent retry
  if (response.status === 401) {
    const refreshedToken = await refreshAuthTokens();
    if (refreshedToken) {
      headers.set("Authorization", `Bearer ${refreshedToken}`);
      try {
        response = await fetch(input, {
          ...init,
          headers,
        });
      } catch (retryErr) {
        throw retryErr;
      }
    } else {
      // Both access token and refresh failed -> user session is expired
      handleSessionExpired();
    }
  }

  return response;
}
