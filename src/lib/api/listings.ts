const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

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
function unwrap<T>(json: any): Paginated<T> {
  const data: T[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  const meta: PageMeta = json?.meta ?? { page: 1, limit: data.length || 20, total: data.length, totalPages: 1 };
  return { data, meta };
}

export async function getListings(query: ListingQuery = {}): Promise<Paginated<any>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const res = await fetch(`${API_BASE}/listings?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return unwrap(await res.json());
}

export async function getListing(slug: string): Promise<any> {
  const res = await fetch(`${API_BASE}/listings/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch listing");
  const json = await res.json();
  return json.data ?? json;
}
