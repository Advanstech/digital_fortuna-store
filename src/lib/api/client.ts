/**
 * Centralized API client for Digital Fortuna Computing.
 * All API calls should use this instead of hardcoding localhost URLs.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  auth?: boolean; // default true
}

/**
 * Unwrap the API response envelope { data, meta?, timestamp }.
 */
function unwrap(json: any): any {
  if (json && typeof json === "object" && "data" in json) {
    return json;
  }
  return { data: json };
}

export async function api<T = any>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: any; error?: string }> {
  const { method = "GET", body, headers = {}, auth = true } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
    ...(auth ? getAuthHeaders() : {}),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null as any,
        error: json.message || json.error || `Request failed with status ${res.status}`,
      };
    }

    const unwrapped = unwrap(json);
    return { data: unwrapped.data as T, meta: unwrapped.meta };
  } catch (err: any) {
    return { data: null as any, error: err.message || "Network error" };
  }
}

/** Shorthand for GET requests */
export const apiGet = <T = any>(path: string, auth = true) =>
  api<T>(path, { auth });

/** Shorthand for POST requests */
export const apiPost = <T = any>(path: string, body?: any) =>
  api<T>(path, { method: "POST", body });

/** Shorthand for PATCH requests */
export const apiPatch = <T = any>(path: string, body?: any) =>
  api<T>(path, { method: "PATCH", body });

/** Shorthand for DELETE requests */
export const apiDelete = <T = any>(path: string) =>
  api<T>(path, { method: "DELETE" });
