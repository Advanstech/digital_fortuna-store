const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface ListingQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "mrr-desc";
  minPrice?: number;
  maxPrice?: number;
  minMrr?: number;
  featured?: boolean;
  sellerId?: string;
}

export interface MarketplaceListing {
  id: string;
  slug?: string;
  title: string;
  category?: string;
  tagline?: string | null;
  description?: string | null;
  acquisitionPrice?: number | null;
  monthlyLicensePrice?: number | null;
  verified?: boolean | null;
  details?: {
    assets?: { screenshot?: string | null; logo?: string | null };
    images?: string[];
  };
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

// The API wraps every response in { data, meta?, timestamp, requestId }.
// For paginated endpoints the payload itself is { data: T[], meta: PageMeta },
// which the interceptor flattens to top-level { data: T[], meta: PageMeta }.
function unwrap<T>(json: unknown): Paginated<T> {
  const payload = json && typeof json === "object" ? json as { data?: unknown; meta?: PageMeta } : null;
  const data: T[] = Array.isArray(payload?.data)
    ? payload.data as T[]
    : Array.isArray(json)
      ? json as T[]
      : [];
  const meta: PageMeta = payload?.meta ?? { page: 1, limit: data.length || 20, total: data.length, totalPages: 1 };
  return { data, meta };
}

export async function getListings(query: ListingQuery = {}): Promise<Paginated<MarketplaceListing>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const res = await fetch(`${API_BASE}/listings?${params.toString()}`);
  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error("The listing service is temporarily unavailable.");
    }
    throw new Error(`Listings request failed (${res.status})`);
  }
  return unwrap(await res.json());
}

export async function getListing(slug: string): Promise<MarketplaceListing | null> {
  try {
    const res = await fetch(`${API_BASE}/listings/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}
